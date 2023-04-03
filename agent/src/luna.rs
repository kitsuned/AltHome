use std::error::Error;
use std::process::Command;
use serde::{Serialize, de::DeserializeOwned};

pub fn send<T, R>(url: &str, message: T) -> Result<R, Box<dyn Error>>
    where T: Serialize,
          R: DeserializeOwned
{
    let message = serde_json::to_string(&message).unwrap();

    let result = Command::new("luna-send")
        .args(["-n", "1"])
        .arg(url)
        .arg(message)
        .output()?
        .stdout;

    let response: R = serde_json::from_slice(result.as_slice())?;

    Ok(response)
}

pub enum LunaHubControlAction {
    ScanServices,
    ScanVolatileDirs,
}

pub fn control(action: LunaHubControlAction) {
    Command::new("ls-control")
        .arg(match action {
            LunaHubControlAction::ScanServices => "scan-services",
            LunaHubControlAction::ScanVolatileDirs => "scan-volatile-dirs"
        })
        .spawn()
        .unwrap();
}

pub mod configd {
    use std::error::Error;
    use std::collections::HashMap;
    use std::fmt::Debug;

    use serde::{Deserialize, Serialize};
    use serde::de::DeserializeOwned;

    use crate::luna;

    #[derive(Serialize)]
    struct ConfigGetReq {
        #[serde(rename = "configNames")]
        keys: Vec<String>,
    }

    #[derive(Deserialize)]
    struct ConfigGetResp<V> {
        configs: HashMap<String, V>,
    }

    pub fn get<T>(key: &str) -> Result<T, Box<dyn Error>> where T: DeserializeOwned + Debug + Clone
    {
        let response = luna::send::<ConfigGetReq, ConfigGetResp<T>>(
            "luna://com.webos.service.config/getConfigs",
            ConfigGetReq {
                keys: vec![key.to_string()],
            },
        ).unwrap();

        let config = response.configs.get(key)
            .cloned()
            .unwrap();

        Ok(config)
    }

    #[derive(Serialize)]
    struct ConfigSetReq<V> where V: Serialize {
        configs: HashMap<String, V>,
    }

    #[derive(Deserialize)]
    struct ConfigSetResp {}

    pub fn set<T>(key: &str, message: T) where T: Serialize {
        luna::send::<ConfigSetReq<T>, ConfigSetResp>(
            "luna://com.webos.service.config/setConfigs",
            ConfigSetReq {
                configs: HashMap::from([(key.to_string(), message)]),
            },
        ).unwrap();
    }
}
