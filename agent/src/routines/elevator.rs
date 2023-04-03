use std::{fs, io};
use std::collections::HashMap;
use std::path::Path;

use serde_json::{json, Value};
use serde::{Serialize, Deserialize};

use crate::luna;
use crate::luna::LunaHubControlAction;

#[derive(Serialize, Deserialize, Debug)]
struct Manifest {
    #[serde(rename = "clientPermissionFiles")]
    client_permission_files: Vec<String>,

    #[serde(flatten)]
    rest: HashMap<String, Value>,
}

fn rescan() {
    luna::control(LunaHubControlAction::ScanVolatileDirs);
    luna::control(LunaHubControlAction::ScanServices);
}

pub fn elevate(app_id: &str) -> Result<(), io::Error> {
    let client_permissions_path =
        format!("/var/luna-service2-dev/client-permissions.d/{}.all.json", app_id);
    let manifest_path =
        format!("/var/luna-service2-dev/manifests.d/{}.json", app_id);

    if !Path::new(client_permissions_path.as_str()).exists() {
        let client_permissions = json!({
            format!("{}-*", app_id): [
                "all",
            ],
        });

        fs::write(&client_permissions_path, client_permissions.to_string())?;

        println!("Created extra client permissions file.");
    }

    let manifest = fs::read_to_string(&manifest_path)?;
    let mut manifest: Manifest = serde_json::from_str(manifest.as_str())?;

    if manifest.client_permission_files.contains(&client_permissions_path) {
        return Ok(());
    }

    manifest.client_permission_files.push(client_permissions_path);
    manifest.client_permission_files.sort_unstable();
    manifest.client_permission_files.dedup();

    let manifest = serde_json::to_string(&manifest)?;

    fs::write(&manifest_path, manifest)?;

    println!("Rewired manifest file.");

    rescan();

    Ok(())
}
