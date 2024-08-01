mod db;
mod ark_data;

use db::{get_database_path, initialize_db, save_settings, load_settings, Settings, SavedConfig, save_config, load_configs, delete_config, config_name_exists, update_config};
use ark_data::read_ark_data;
use std::fs;
use std::path::{PathBuf, Path};
use serde_json::Value;
use serde::Serialize;
use std::process::Command;
use tauri_plugin_context_menu::init as init_context_menu;

#[tauri::command]
fn save_settings_command(app_handle: tauri::AppHandle, output_path: String) -> Result<(), String> {
    let db_path = get_database_path(&app_handle);
    let conn = initialize_db(&db_path).map_err(|e| e.to_string())?;
    let settings = Settings { output_path };
    save_settings(&conn, &settings).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_settings_command(app_handle: tauri::AppHandle) -> Result<Settings, String> {
    let db_path = get_database_path(&app_handle);
    let conn = initialize_db(&db_path).map_err(|e| e.to_string())?;
    load_settings(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_ark_data_command(app_handle: tauri::AppHandle) -> Result<Value, String> {
    read_ark_data(app_handle)
}

#[derive(Serialize)]
struct ExportResult {
    file_path: String,
    file_existed: bool,
}

#[tauri::command]
fn export_config(app_handle: tauri::AppHandle, config: Value) -> Result<ExportResult, String> {
    let settings = load_settings_command(app_handle.clone()).map_err(|e| e.to_string())?;
    let output_path = settings.output_path;

    if output_path.is_empty() {
        return Err("No output path set. Please set an output path in the settings.".to_string());
    }

    let file_path = PathBuf::from(&output_path).join("config.json");
    
    let file_exists = Path::new(&file_path).exists();

    if !file_exists {
        fs::write(&file_path, serde_json::to_string_pretty(&config).unwrap())
            .map_err(|e| format!("Failed to write file: {}", e))?;
    }

    Ok(ExportResult {
        file_path: file_path.to_string_lossy().into_owned(),
        file_existed: file_exists,
    })
}

#[tauri::command]
fn force_export_config(config: Value, file_path: String) -> Result<(), String> {
    fs::write(&file_path, serde_json::to_string_pretty(&config).unwrap())
        .map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}

#[tauri::command]
fn open_file_location(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    let parent = path_buf.parent().ok_or("Unable to get parent directory")?;

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(parent)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(parent)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(parent)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn save_config_command(app_handle: tauri::AppHandle, id: Option<i64>, name: String, config: Value) -> Result<i64, String> {
    let db_path = get_database_path(&app_handle);
    let conn = initialize_db(&db_path).map_err(|e| e.to_string())?;
    
    if let Some(id) = id {
        // This is an update operation
        update_config(&conn, id, &name, &serde_json::to_string(&config).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        Ok(id)
    } else {
        // This is a new save operation
        if config_name_exists(&conn, &name).map_err(|e| e.to_string())? {
            return Err("A configuration with this name already exists".to_string());
        }
        
        let saved_config = SavedConfig {
            id: None,
            name,
            config: serde_json::to_string(&config).map_err(|e| e.to_string())?,
        };
        save_config(&conn, &saved_config).map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn load_configs_command(app_handle: tauri::AppHandle) -> Result<Vec<SavedConfig>, String> {
    let db_path = get_database_path(&app_handle);
    let conn = initialize_db(&db_path).map_err(|e| e.to_string())?;
    load_configs(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_config_command(app_handle: tauri::AppHandle, id: i64) -> Result<(), String> {
    let db_path = get_database_path(&app_handle);
    let conn = initialize_db(&db_path).map_err(|e| e.to_string())?;
    delete_config(&conn, id).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(init_context_menu())
        .setup(|app| {
            let app_handle = app.handle();
            let db_path = get_database_path(&app_handle);
            initialize_db(&db_path).expect("Failed to initialize database");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_settings_command,
            load_settings_command,
            read_ark_data_command,
            export_config,
            force_export_config,
            open_file_location,
            save_config_command,
            load_configs_command,
            delete_config_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}