use std::process::Command;
use sha2::{Sha256, Digest};

pub fn generate_hwid() -> String {
    let mut hasher = Sha256::new();

    // CPU ID
    if let Ok(output) = Command::new("wmic").args(&["cpu", "get", "processorid"]).output() {
        hasher.update(&output.stdout);
    }

    // BIOS Serial Number
    if let Ok(output) = Command::new("wmic").args(&["bios", "get", "serialnumber"]).output() {
        hasher.update(&output.stdout);
    }

    // Motherboard Serial Number
    if let Ok(output) = Command::new("wmic").args(&["baseboard", "get", "serialnumber"]).output() {
        hasher.update(&output.stdout);
    }

    // First MAC Address
    if let Ok(output) = Command::new("getmac").output() {
        hasher.update(&output.stdout);
    }

    // Convert hash to hexadecimal string
    let result = hasher.finalize();
    let hwid = format!("{:x}", result);
    println!("Generated HWID: {}", hwid);
    hwid
}