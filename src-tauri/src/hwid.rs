use sha2::{Sha256, Digest};
use sysinfo::{System, SystemExt, CpuExt, DiskExt};
use std::env;
use uuid::Uuid;

pub fn generate_hwid() -> String {
    let mut system = System::new_all();
    system.refresh_all();

    let mut hasher = Sha256::new();

    // CPU information
    if let Some(cpu) = system.cpus().first() {
        hasher.update(cpu.brand().as_bytes());
        hasher.update(cpu.vendor_id().as_bytes());
    }

    // Disk information
    if let Some(disk) = system.disks().first() {
        hasher.update(disk.name().to_str().unwrap_or("").as_bytes());
    }

    // Computer name
    if let Ok(hostname) = env::var("COMPUTERNAME").or_else(|_| env::var("HOSTNAME")) {
        hasher.update(hostname.as_bytes());
    }

    // User name
    if let Ok(username) = env::var("USERNAME").or_else(|_| env::var("USER")) {
        hasher.update(username.as_bytes());
    }

    // Generate a SHA-256 hash
    let result = hasher.finalize();
    let hash = format!("{:x}", result);

    // Use the hash to create a UUID v5
    let namespace = Uuid::NAMESPACE_OID;
    let uuid = Uuid::new_v5(&namespace, hash.as_bytes());

    uuid.to_string()
}