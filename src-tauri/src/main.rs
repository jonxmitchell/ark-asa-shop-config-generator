mod ark_data;
use tauri_plugin_context_menu::init as init_context_menu;

#[tauri::command]
fn read_ark_data(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    ark_data::read_ark_data(app)
}

fn main() {
    tauri::Builder::default()
        .plugin(init_context_menu())  // Add this line
        .invoke_handler(tauri::generate_handler![read_ark_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}