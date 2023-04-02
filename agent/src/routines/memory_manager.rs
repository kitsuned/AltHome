use std::collections::HashMap;
use std::error::Error;

use serde_json::Value;
use serde::{Serialize, Deserialize};

use crate::rewire::{kill_all, restart_unit, rewire as rewire_util};

const FACTORY_SETTINGS: &str = "/etc/palm/memorymanager-conf.json";

#[derive(Serialize, Deserialize, Debug)]
struct Manifest {
    #[serde(rename = "KeepOnLaunchEx")]
    keep_alive_extra: Vec<String>,

    #[serde(flatten)]
    extra: HashMap<String, Value>,
}

pub fn rewire() -> Result<(), Box<dyn Error>> {
    rewire_util(FACTORY_SETTINGS, |manifest: &mut Manifest| {
        manifest.keep_alive_extra.retain(|id| id != "com.webos.app.home");
        manifest.keep_alive_extra.push(String::from("com.kitsuned.althome"));
    })?;

    restart_unit("memchute.service")?;

    kill_all("com.webos.app.home");

    Ok(())
}
