mod ark_data;

#[tauri::command]
fn read_ark_data(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    ark_data::read_ark_data(app)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_ark_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}