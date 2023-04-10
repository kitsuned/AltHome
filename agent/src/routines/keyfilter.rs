use std::fs;
use std::error::Error;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Serialize, Deserialize};
use crate::luna;

use crate::rewire::create_root_directory;

const CUSTOM_KF: &str = "/var/rebound/sysui-keyfilter.js";

#[derive(Serialize, Deserialize, Clone, Debug)]
struct KeyFilterPolicy {
    file: String,
    handler: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct SurfaceManagerConfig {
    #[serde(rename = "keyFilters")]
    key_filters: Vec<KeyFilterPolicy>,
}

fn get_patched_policies() -> Result<Vec<KeyFilterPolicy>, Box<dyn Error>> {
    let sm_config = fs::read_to_string(
        "/etc/configd/layers/base/com.webos.surfacemanager.json"
    )?;

    let mut sm_config: SurfaceManagerConfig = serde_json::from_str(sm_config.as_str())?;

    // TODO refactor
    sm_config.key_filters
        .iter_mut()
        .find(|x| x.handler == "handleSystemKeys")
        .unwrap()
        .file = CUSTOM_KF.to_string();

    sm_config.key_filters.push(KeyFilterPolicy {
        file: CUSTOM_KF.to_string(),
        handler: String::from("nonce") + SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_millis()
            .to_string()
            .as_str(),
    });

    Ok(sm_config.key_filters)
}

pub fn rewire() -> Result<(), Box<dyn Error>> {
    let mut keyfilter = fs::read_to_string("/usr/lib/qt5/qml/KeyFilters/systemUi.js")
        .expect("Failed to read System UI keyfilter.");

    let shadow = include_str!("shadow.js");

    keyfilter.push_str(shadow);

    create_root_directory(CUSTOM_KF)?;

    fs::write(CUSTOM_KF, keyfilter)?;

    let policies = get_patched_policies()?;

    luna::configd::set("com.webos.surfacemanager.keyFilters", policies);

    println!("Updated keyfilter configuration.");

    Ok(())
}
