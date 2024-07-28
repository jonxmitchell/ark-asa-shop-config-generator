use std::fs;
use serde_json::Value;
use tauri::Manager;

#[tauri::command]
fn read_ark_data(app: tauri::AppHandle) -> Result<Value, String> {
    let resource_path = app
        .path_resolver()
        .resolve_resource("ark_data.json")
        .expect("failed to resolve resource");
    
    let data = fs::read_to_string(resource_path)
        .map_err(|e| format!("Error reading file: {}", e))?;
    
    serde_json::from_str(&data)
        .map_err(|e| format!("Error parsing JSON: {}", e))
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![read_ark_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}