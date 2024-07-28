use std::fs;
use serde_json::Value;
use tauri::AppHandle;

pub fn read_ark_data(app: AppHandle) -> Result<Value, String> {
    let resource_path = app
        .path_resolver()
        .resolve_resource("ark_data.json")
        .expect("failed to resolve resource");
    
    let data = fs::read_to_string(resource_path)
        .map_err(|e| format!("Error reading file: {}", e))?;
    
    serde_json::from_str(&data)
        .map_err(|e| format!("Error parsing JSON: {}", e))
}