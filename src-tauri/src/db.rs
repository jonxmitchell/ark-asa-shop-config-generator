// src-tauri/src/db.rs

use rusqlite::{Connection, Result, Error, params, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tauri::AppHandle;
use chrono::NaiveDate;

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub output_path: String,
    pub auto_save_enabled: bool,
    pub auto_save_interval: i32,
    pub show_tooltips: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SavedConfig {
    pub id: Option<i64>,
    pub name: String,
    pub config: String,
    pub custom_export_paths: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LicenseInfo {
    pub license_key: String,
    pub expiration_date: NaiveDate,
    pub hwid: String,
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
            output_path TEXT NOT NULL,
            auto_save_enabled BOOLEAN NOT NULL DEFAULT 0,
            auto_save_interval INTEGER NOT NULL DEFAULT 5,
            show_tooltips BOOLEAN NOT NULL DEFAULT 1
        )",
        [],
    )?;
    
    conn.execute(
        "CREATE TABLE IF NOT EXISTS saved_configs (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            config TEXT NOT NULL,
            custom_export_paths TEXT
        )",
        [],
    )?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS license_info (
            id INTEGER PRIMARY KEY,
            license_key TEXT NOT NULL,
            expiration_date TEXT NOT NULL,
            hwid TEXT NOT NULL
        )",
        [],
    )?;
    Ok(conn)
}

pub fn save_settings(conn: &Connection, settings: &Settings) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO settings (id, output_path, auto_save_enabled, auto_save_interval, show_tooltips) 
         VALUES (1, ?1, ?2, ?3, ?4)",
        params![
            settings.output_path,
            settings.auto_save_enabled,
            settings.auto_save_interval,
            settings.show_tooltips
        ],
    )?;
    Ok(())
}

pub fn load_settings(conn: &Connection) -> Result<Settings> {
    conn.query_row(
        "SELECT output_path, auto_save_enabled, auto_save_interval, show_tooltips FROM settings WHERE id = 1",
        [],
        |row| Ok(Settings {
            output_path: row.get(0)?,
            auto_save_enabled: row.get(1)?,
            auto_save_interval: row.get(2)?,
            show_tooltips: row.get(3)?,
        })
    ).or_else(|err| {
        if let Error::QueryReturnedNoRows = err {
            Ok(Settings { 
                output_path: String::new(), 
                auto_save_enabled: false, 
                auto_save_interval: 5,
                show_tooltips: true
            })
        } else {
            Err(err)
        }
    })
}

pub fn save_config(conn: &Connection, config: &SavedConfig) -> Result<i64> {
    let custom_export_paths = serde_json::to_string(&config.custom_export_paths).unwrap_or_default();
    conn.execute(
        "INSERT INTO saved_configs (name, config, custom_export_paths) VALUES (?1, ?2, ?3)",
        params![config.name, config.config, custom_export_paths],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn load_configs(conn: &Connection) -> Result<Vec<SavedConfig>> {
    let mut stmt = conn.prepare("SELECT id, name, config, custom_export_paths FROM saved_configs")?;
    let config_iter = stmt.query_map([], |row| {
        let custom_export_paths: Option<String> = row.get(3)?;
        let paths: Option<Vec<String>> = custom_export_paths
            .map(|s| serde_json::from_str(&s).unwrap_or_default())
            .or(Some(Vec::new()));

        Ok(SavedConfig {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            config: row.get(2)?,
            custom_export_paths: paths,
        })
    })?;

    let mut configs = Vec::new();
    for config in config_iter {
        configs.push(config?);
    }
    Ok(configs)
}

pub fn delete_config(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM saved_configs WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn config_name_exists(conn: &Connection, name: &str) -> Result<bool> {
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM saved_configs WHERE name = ?1",
        params![name],
        |row| row.get(0),
    )?;
    Ok(count > 0)
}

pub fn update_config(conn: &Connection, id: i64, name: &str, config: &str, custom_export_paths: Option<&Vec<String>>) -> Result<()> {
    let paths_json = custom_export_paths
        .map(|paths| serde_json::to_string(paths).unwrap_or_default())
        .unwrap_or_default();

    conn.execute(
        "UPDATE saved_configs SET name = ?1, config = ?2, custom_export_paths = ?3 WHERE id = ?4",
        params![name, config, paths_json, id],
    )?;
    Ok(())
}

pub fn update_config_export_paths(conn: &Connection, id: i64, paths: Option<Vec<String>>) -> Result<()> {
    let paths_json = paths
        .map(|p| serde_json::to_string(&p).unwrap_or_default())
        .unwrap_or_default();

    conn.execute(
        "UPDATE saved_configs SET custom_export_paths = ?1 WHERE id = ?2",
        params![paths_json, id],
    )?;
    Ok(())
}

pub fn save_license_info(conn: &Connection, info: &LicenseInfo) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO license_info (id, license_key, expiration_date, hwid) VALUES (1, ?1, ?2, ?3)",
        params![info.license_key, info.expiration_date.to_string(), info.hwid],
    )?;
    Ok(())
}

pub fn load_license_info(conn: &Connection) -> Result<Option<LicenseInfo>> {
    conn.query_row(
        "SELECT license_key, expiration_date, hwid FROM license_info WHERE id = 1",
        [],
        |row| Ok(LicenseInfo {
            license_key: row.get(0)?,
            expiration_date: NaiveDate::parse_from_str(&row.get::<_, String>(1)?, "%Y-%m-%d").unwrap(),
            hwid: row.get(2)?,
        })
    ).optional()
}

pub fn load_current_config(conn: &Connection) -> Result<Option<SavedConfig>> {
    conn.query_row(
        "SELECT id, name, config, custom_export_paths FROM saved_configs WHERE id = (SELECT MAX(id) FROM saved_configs)",
        [],
        |row| {
            let custom_export_paths: Option<String> = row.get(3)?;
            let paths: Option<Vec<String>> = custom_export_paths
                .map(|s| serde_json::from_str(&s).unwrap_or_default())
                .or(Some(Vec::new()));

            Ok(SavedConfig {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                config: row.get(2)?,
                custom_export_paths: paths,
            })
        }
    ).optional()
}

pub fn load_config_by_id(conn: &Connection, id: i64) -> Result<Option<SavedConfig>> {
    conn.query_row(
        "SELECT id, name, config, custom_export_paths FROM saved_configs WHERE id = ?1",
        params![id],
        |row| {
            let custom_export_paths: Option<String> = row.get(3)?;
            let paths: Option<Vec<String>> = custom_export_paths
                .map(|s| serde_json::from_str(&s).unwrap_or_default())
                .or(Some(Vec::new()));

            Ok(SavedConfig {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                config: row.get(2)?,
                custom_export_paths: paths,
            })
        }
    ).optional()
}