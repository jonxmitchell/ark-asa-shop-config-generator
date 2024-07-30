use rusqlite::{Connection, Result, Error};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub output_path: String,
}

pub fn get_database_path(handle: &AppHandle) -> PathBuf {
    handle.path_resolver()
        .resolve_resource("settings.db")
        .expect("failed to resolve resource")
}

pub fn ensure_database_exists(db_path: &Path) -> Result<()> {
    if let Some(parent) = db_path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| Error::SqliteFailure(
            rusqlite::ffi::Error::new(1), Some(e.to_string())
        ))?;
    }
    Ok(())
}

pub fn initialize_db(db_path: &Path) -> Result<Connection> {
    ensure_database_exists(db_path)?;
    let conn = Connection::open(db_path)?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            output_path TEXT NOT NULL
        )",
        [],
    )?;
    Ok(conn)
}

pub fn save_settings(conn: &Connection, settings: &Settings) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO settings (id, output_path) VALUES (1, ?1)",
        [&settings.output_path],
    )?;
    Ok(())
}

pub fn load_settings(conn: &Connection) -> Result<Settings> {
    conn.query_row(
        "SELECT output_path FROM settings WHERE id = 1",
        [],
        |row| Ok(Settings {
            output_path: row.get(0)?,
        })
    ).or_else(|err| {
        if let Error::QueryReturnedNoRows = err {
            Ok(Settings { output_path: String::new() })
        } else {
            Err(err)
        }
    })
}