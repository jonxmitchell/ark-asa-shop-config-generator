mod db;
mod ark_data;
mod hwid;
mod license;

use db::{get_database_path, initialize_db, save_settings, load_settings, Settings, SavedConfig, save_config, load_configs, delete_config, config_name_exists, update_config};
use ark_data::read_ark_data;
use std::fs;
use std::path::{PathBuf, Path};
use serde_json::Value;
use serde::Serialize;
use std::process::Command;
use tauri_plugin_context_menu::init as init_context_menu;
use std::sync::Mutex;
use tokio::task;
use std::fs::OpenOptions;
use std::io::Write;
use std::env;

struct LicenseState(Mutex<bool>);

fn log_to_file(message: &str) {
    let log_path = env::current_exe()
        .unwrap()
        .parent()
        .unwrap()
        .join("app_log.txt");
    
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_path)
        .unwrap();
    writeln!(file, "{}: {}", chrono::Local::now(), message).unwrap();
}

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

#[tauri::command]
fn get_hwid() -> String {
    hwid::generate_hwid()
}

#[tauri::command]
async fn validate_license(license_key: String, state: tauri::State<'_, LicenseState>) -> Result<bool, String> {
    let hwid = hwid::generate_hwid();
    log_to_file(&format!("Validating license. HWID: {}", hwid));
    
    let result = task::spawn_blocking(move || {
        license::verify_license(&license_key, &hwid)
    }).await.map_err(|e| format!("Task join error: {}", e))?;

    match result {
        Ok(is_valid) => {
            log_to_file(&format!("License validation result: {}", is_valid));
            if is_valid {
                let mut license_state = state.0.lock().unwrap();
                *license_state = true;
                Ok(true)
            } else {
                Err("License key is not valid for the current HWID or is expired".to_string())
            }
        }
        Err(e) => {
            log_to_file(&format!("License validation error: {}", e));
            Err(format!("License validation failed: {}", e))
        }
    }
}

#[tauri::command]
fn get_license_state(state: tauri::State<LicenseState>) -> bool {
    *state.0.lock().unwrap()
}

fn main() {
    std::panic::set_hook(Box::new(|panic_info| {
        if let Some(location) = panic_info.location() {
            log_to_file(&format!("Panic occurred in file '{}' at line {}", location.file(), location.line()));
        }
        if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            log_to_file(&format!("Panic message: {}", s));
        } else if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            log_to_file(&format!("Panic message: {}", s));
        }
    }));

    let result = std::panic::catch_unwind(|| {
        log_to_file("Starting application");
        tauri::Builder::default()
            .plugin(init_context_menu())
            .setup(|app| {
                let app_handle = app.handle();
                let db_path = get_database_path(&app_handle);
                initialize_db(&db_path).expect("Failed to initialize database");

                #[cfg(not(debug_assertions))]
                {
                    use tauri::Manager;
                    let window = app.get_window("main").unwrap();
                    let hwid = hwid::generate_hwid();
                    log_to_file(&format!("Startup HWID: {}", hwid));
                    
                    // TODO: Implement proper license key storage and retrieval
                    let license_key = ""; // Retrieve stored license key
                    log_to_file(&format!("Startup license key: {}", license_key));
                    
                    match license::verify_license(license_key, &hwid) {
                        Ok(valid) => {
                            if !valid {
                                log_to_file("License verification failed on startup");
                                // Instead of closing, show an error message
                                window.emit("license-error", "License verification failed").unwrap();
                            } else {
                                log_to_file("License verification succeeded on startup");
                            }
                        },
                        Err(e) => {
                            log_to_file(&format!("License verification error on startup: {}", e));
                            // Instead of closing, show an error message
                            window.emit("license-error", &format!("License error: {}", e)).unwrap();
                        }
                    }
                }
                Ok(())
            })
            .manage(LicenseState(Mutex::new(false)))
            .invoke_handler(tauri::generate_handler![
                save_settings_command,
                load_settings_command,
                read_ark_data_command,
                export_config,
                force_export_config,
                open_file_location,
                save_config_command,
                load_configs_command,
                delete_config_command,
                get_hwid,
                validate_license,
                get_license_state
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    });

    if let Err(_) = result {
        log_to_file("Application panicked");
        // You might want to show an error message to the user here
    }
}