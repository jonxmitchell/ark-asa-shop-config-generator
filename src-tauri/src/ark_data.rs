// src-tauri/src/ark_data.rs

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
    
    let mut json_data: Value = serde_json::from_str(&data)
        .map_err(|e| format!("Error parsing JSON: {}", e))?;

    // Ensure the JSON structure includes a "Beacons" field
    if !json_data.as_object().unwrap().contains_key("Beacons") {
        json_data.as_object_mut().unwrap().insert("Beacons".to_string(), serde_json::json!({}));
    }

    Ok(json_data)
}