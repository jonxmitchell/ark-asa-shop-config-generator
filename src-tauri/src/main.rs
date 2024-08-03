// src-tauri/src/main.rs

mod db;
mod ark_data;
mod hwid;
mod license;

use db::{get_database_path, initialize_db, save_settings, load_settings, Settings, SavedConfig, save_config, load_configs, delete_config, config_name_exists, update_config, LicenseInfo, save_license_info, load_license_info, load_current_config, load_config_by_id};
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
use chrono::Utc;
use rusqlite::Connection;
use tauri::Manager;

struct LicenseState(Mutex<bool>);
struct AppState(Mutex<Connection>);

unsafe impl Send for AppState {}
unsafe impl Sync for AppState {}

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
    writeln!(file, "{}: {}", Utc::now(), message).unwrap();
}

#[tauri::command]
fn save_settings_command(state: tauri::State<AppState>, output_path: String, auto_save_enabled: bool, auto_save_interval: i32) -> Result<(), String> {
    let conn = state.0.lock().unwrap();
    let settings = Settings { output_path, auto_save_enabled, auto_save_interval };
    save_settings(&conn, &settings).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_settings_command(state: tauri::State<AppState>) -> Result<Settings, String> {
    let conn = state.0.lock().unwrap();
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
fn export_config(state: tauri::State<AppState>, config: Value) -> Result<ExportResult, String> {
    let conn = state.0.lock().unwrap();
    let settings = load_settings(&conn).map_err(|e| e.to_string())?;
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
fn save_config_command(state: tauri::State<AppState>, id: Option<i64>, name: String, config: Value) -> Result<i64, String> {
    let conn = state.0.lock().unwrap();
    
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
fn load_configs_command(state: tauri::State<AppState>) -> Result<Vec<SavedConfig>, String> {
    let conn = state.0.lock().unwrap();
    load_configs(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_config_command(state: tauri::State<AppState>, id: i64) -> Result<(), String> {
    let conn = state.0.lock().unwrap();
    delete_config(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_hwid() -> String {
    hwid::generate_hwid()
}

#[tauri::command]
async fn validate_license(license_key: String, state: tauri::State<'_, LicenseState>, app_state: tauri::State<'_, AppState>) -> Result<bool, String> {
    let hwid = hwid::generate_hwid();
    log_to_file(&format!("Validating license. HWID: {}", hwid));
    
    let license_key_clone = license_key.clone();
    let hwid_clone = hwid.clone();
    
    let result = task::spawn_blocking(move || {
        license::verify_license(&license_key_clone, &hwid_clone)
    }).await.map_err(|e| format!("Task join error: {}", e))?;

    match result {
        Ok((is_valid, expiration_date)) => {
            log_to_file(&format!("License validation result: {}", is_valid));
            if is_valid {
                let mut license_state = state.0.lock().unwrap();
                *license_state = true;

                // Save license info to database
                let conn = app_state.0.lock().unwrap();
                let license_info = LicenseInfo {
                    license_key,
                    expiration_date,
                    hwid,
                };
                save_license_info(&conn, &license_info).map_err(|e| e.to_string())?;

                Ok(true)
            } else {
                Ok(false)
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

#[tauri::command]
fn get_license_info(state: tauri::State<AppState>) -> Result<serde_json::Value, String> {
    let conn = state.0.lock().unwrap();
    
    if let Some(license_info) = load_license_info(&conn).map_err(|e| e.to_string())? {
        Ok(serde_json::json!({
            "license_key": license_info.license_key,
            "expiration_date": license_info.expiration_date.to_string(),
            "hwid": license_info.hwid,
        }))
    } else {
        Err("No license information found".to_string())
    }
}

#[tauri::command]
async fn check_license_on_startup(state: tauri::State<'_, AppState>, license_state: tauri::State<'_, LicenseState>) -> Result<bool, String> {
    let conn = state.0.lock().unwrap();
    
    if let Some(license_info) = load_license_info(&conn).map_err(|e| e.to_string())? {
        let hwid = hwid::generate_hwid();
        
        if license_info.hwid != hwid {
            return Err("HWID mismatch".to_string());
        }
        
        let result = license::verify_license(&license_info.license_key, &hwid);
        
        match result {
            Ok((is_valid, _)) => {
                if is_valid {
                    let mut license_state = license_state.0.lock().unwrap();
                    *license_state = true;
                    Ok(true)
                } else {
                    Err("License is no longer valid".to_string())
                }
            }
            Err(e) => Err(format!("License verification failed: {}", e)),
        }
    } else {
        Ok(false) // No license found, but not an error
    }
}

#[tauri::command]
async fn auto_save_config(config: Value, config_id: i64, state: tauri::State<'_, AppState>) -> Result<(), String> {
    println!("Auto-save triggered for config_id: {}", config_id); // Add this line for debugging
    let conn = state.0.lock().map_err(|_| "Failed to acquire database lock".to_string())?;
    let current_config = load_config_by_id(&conn, config_id).map_err(|e| e.to_string())?;
    
    if let Some(current_config) = current_config {
        println!("Updating config: {}", current_config.name); // Add this line for debugging
        update_config(&conn, current_config.id.unwrap(), &current_config.name, &serde_json::to_string(&config).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        println!("Config updated successfully"); // Add this line for debugging
        Ok(())
    } else {
        println!("No configuration found for id: {}", config_id); // Add this line for debugging
        Err("No configuration is currently loaded".to_string())
    }
}

#[tauri::command]
fn get_current_config(state: tauri::State<AppState>) -> Result<Option<SavedConfig>, String> {
    let conn = state.0.lock().map_err(|_| "Failed to acquire database lock".to_string())?;
    load_current_config(&conn).map_err(|e| e.to_string())
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
                let conn = initialize_db(&db_path).expect("Failed to initialize database");
                app.manage(AppState(Mutex::new(conn)));

                #[cfg(not(debug_assertions))]
                {
                    use tauri::Manager;
                    let window = app.get_window("main").unwrap();
                    
                    // Check for existing license
                    let state = app.state::<AppState>();
                    let conn = state.0.lock().unwrap();
                    if let Ok(Some(license_info)) = load_license_info(&conn) {
                        let hwid = hwid::generate_hwid();
                        log_to_file(&format!("Startup HWID: {}", hwid));
                        
                        if license_info.hwid == hwid {
                            match license::verify_license(&license_info.license_key, &hwid) {
                                Ok((valid, _)) => {
                                    if valid {
                                        log_to_file("License verification succeeded on startup");
                                    } else {
                                        log_to_file("License verification failed on startup");
                                        window.emit("license-error", "License verification failed").unwrap();
                                    }
                                },
                                Err(e) => {
                                    log_to_file(&format!("License verification error on startup: {}", e));
                                    window.emit("license-error", &format!("License error: {}", e)).unwrap();
                                }
                            }
                        } else {
                            log_to_file("HWID mismatch on startup");
                            window.emit("license-error", "HWID mismatch").unwrap();
                        }
                    } else {
                        log_to_file("No license found on startup");
                        window.emit("license-error", "No license found").unwrap();
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
                get_license_state,
                get_license_info,
                check_license_on_startup,
                auto_save_config,
                get_current_config
            ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    });

    if let Err(_) = result {
        log_to_file("Application panicked");
        // You might want to show an error message to the user here
    }
}