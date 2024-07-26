#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use std::fs;

#[tauri::command]
fn save_config(config: String) -> Result<(), String> {
  fs::write("config.json", config).map_err(|e| e.to_string())
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      window.set_title("Ark ASA Shop Config Generator").unwrap();
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![save_config])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}