use base64::{Engine as _, engine::general_purpose};
use chrono::NaiveDate;

pub fn verify_license(license_key: &str, hwid: &str) -> Result<bool, String> {
    println!("Verifying license. Key: {}, HWID: {}", license_key, hwid);
    
    // Decode the license key
    let decoded = general_purpose::STANDARD.decode(license_key)
        .map_err(|e| format!("Failed to decode license key: {}", e))?;
    
    // The decoded key should contain the HWID and expiration date
    let decoded_str = String::from_utf8(decoded)
        .map_err(|e| format!("Failed to convert decoded key to string: {}", e))?;
    
    println!("Decoded license key: {}", decoded_str);
    
    let parts: Vec<&str> = decoded_str.split('|').collect();
    if parts.len() != 2 {
        return Err("Invalid license key format".to_string());
    }
    
    let license_hwid = parts[0];
    let expiration_date_str = parts[1];
    
    println!("License HWID: {}", license_hwid);
    println!("Expiration date string: {}", expiration_date_str);
    
    if license_hwid != hwid {
        return Err("HWID mismatch".to_string());
    }
    
    let expiration_date = NaiveDate::parse_from_str(expiration_date_str, "%Y%m%d")
        .map_err(|e| format!("Failed to parse expiration date: {}", e))?;
    
    println!("Parsed expiration date: {}", expiration_date);
    
    let today = chrono::Local::now().naive_local().date();
    
    if today > expiration_date {
        return Err("License has expired".to_string());
    }
    
    Ok(true)
}