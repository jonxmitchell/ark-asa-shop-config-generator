mod db;

use db::{get_database_path, initialize_db, save_settings, load_settings, Settings};

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

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let db_path = get_database_path(&app_handle);
            initialize_db(&db_path).expect("Failed to initialize database");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save_settings_command, load_settings_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}