// src-tauri/src/main.rs

mod db;
mod ark_data;

use db::{get_database_path, initialize_db, save_settings, load_settings, Settings};
use ark_data::read_ark_data;
use std::fs;
use std::path::{PathBuf, Path};
use serde_json::Value;
use serde::Serialize;
use std::process::Command;

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

fn main() {
    tauri::Builder::default()
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
            open_file_location
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}