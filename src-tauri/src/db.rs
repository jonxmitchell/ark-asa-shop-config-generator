use rusqlite::{Connection, Result, Error};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub output_path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SavedConfig {
    pub id: Option<i64>,
    pub name: String,
    pub config: String,
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
    conn.execute(
        "CREATE TABLE IF NOT EXISTS saved_configs (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            config TEXT NOT NULL
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

pub fn save_config(conn: &Connection, config: &SavedConfig) -> Result<i64> {
    conn.execute(
        "INSERT INTO saved_configs (name, config) VALUES (?1, ?2)",
        [&config.name, &config.config],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn load_configs(conn: &Connection) -> Result<Vec<SavedConfig>> {
    let mut stmt = conn.prepare("SELECT id, name, config FROM saved_configs")?;
    let config_iter = stmt.query_map([], |row| {
        Ok(SavedConfig {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            config: row.get(2)?,
        })
    })?;

    let mut configs = Vec::new();
    for config in config_iter {
        configs.push(config?);
    }
    Ok(configs)
}

pub fn delete_config(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM saved_configs WHERE id = ?1", [id])?;
    Ok(())
}

pub fn config_name_exists(conn: &Connection, name: &str) -> Result<bool> {
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM saved_configs WHERE name = ?1",
        [name],
        |row| row.get(0),
    )?;
    Ok(count > 0)
}

pub fn update_config(conn: &Connection, id: i64, name: &str, config: &str) -> Result<()> {
    conn.execute(
        "UPDATE saved_configs SET name = ?1, config = ?2 WHERE id = ?3",
        [name, config, &id.to_string()],
    )?;
    Ok(())
}