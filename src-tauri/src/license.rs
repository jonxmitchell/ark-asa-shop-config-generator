use base64::{Engine as _, engine::general_purpose};
use chrono::NaiveDate;
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

const SECRET_KEY: &str = "qq0300WCLU7URZH3Xif7"; // Must match the C# secret key

pub fn verify_license(license_key: &str, hwid: &str) -> Result<bool, String> {
    println!("Verifying license. Key: {}, HWID: {}", license_key, hwid);

    // Decode the license key
    let decoded = general_purpose::STANDARD.decode(license_key)
        .map_err(|e| format!("Failed to decode license key: {}", e))?;

    let license_str = String::from_utf8(decoded)
        .map_err(|e| format!("Failed to convert decoded key to string: {}", e))?;

    let parts: Vec<&str> = license_str.split('|').collect();
    if parts.len() != 4 {
        return Err("Invalid license key format".to_string());
    }

    let license_hwid = parts[0];
    let expiration_date_str = parts[1];
    let salt = parts[2];
    let provided_signature = parts[3];

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

    // Verify the signature
    let data_to_verify = format!("{}|{}|{}", license_hwid, expiration_date_str, salt);
    let mut mac = HmacSha256::new_from_slice(SECRET_KEY.as_bytes())
        .map_err(|e| format!("HMAC error: {}", e))?;
    mac.update(data_to_verify.as_bytes());

    let computed_signature = general_purpose::STANDARD.encode(mac.finalize().into_bytes());

    if computed_signature != provided_signature {
        return Err("Invalid license signature".to_string());
    }

    Ok(true)
}