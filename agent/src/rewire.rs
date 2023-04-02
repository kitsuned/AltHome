use std::{fs, io};
use std::error::Error;
use std::process::{Command, ExitStatus, Stdio};

use serde::Serialize;
use serde::de::DeserializeOwned;

#[cfg(all(not(feature = "sandbox"), target_os = "linux"))]
pub fn bind(source: &str, target: &str) -> Result<(), Box<dyn Error>> {
    use nix::mount::{mount, umount, MsFlags};
    use mnt::{get_mount, MountEntry};

    while let Some(MountEntry { file, .. }) = get_mount(target)? {
        if file.to_str().unwrap() != target {
            break;
        }

        println!("Cleaning up existing bind mount: {:?}.", file);

        umount(target)?;
    }

    const NONE: Option<&'static [u8]> = None;

    mount(
        Some(source),
        target,
        Some(b"bind".as_ref()),
        MsFlags::MS_BIND | MsFlags::MS_RDONLY,
        NONE,
    )?;

    println!("{:?} bound on {:?}.", source, target);

    Ok(())
}

#[cfg(any(feature = "sandbox", not(target_os = "linux")))]
pub fn bind(_source: &str, _target: &str) -> Result<(), Box<dyn Error>> {
    unimplemented!();
}

fn create_root_directory(file_path: &str) -> Result<(), io::Error> {
    use std::path::PathBuf;

    let root = PathBuf::from(file_path)
        .parent()
        .unwrap()
        .to_owned();

    fs::create_dir_all(root)
}

pub fn rewire<T, F>(path: &str, f: F) -> Result<(), Box<dyn Error>>
    where T: Serialize + DeserializeOwned,
          F: for<'f> FnOnce(&'f mut T)
{
    let manifest = fs::read_to_string(path)?;

    let mut manifest: T = serde_json::from_str(manifest.as_str())?;

    f(&mut manifest);

    let serialized = serde_json::to_string(&manifest)?;

    let custom = String::from("/var/rebound") + path;

    create_root_directory(custom.as_str())?;

    fs::write(custom.to_owned(), serialized)?;

    if cfg!(not(feature = "sandbox")) {
        bind(custom.as_str(), path)
    } else {
        Ok(())
    }
}

pub fn restart_unit(unit: &str) -> Result<ExitStatus, Box<dyn Error>> {
    let status = Command::new("systemctl")
        .arg("--no-block")
        .arg("restart")
        .arg(unit)
        .stderr(Stdio::null())
        .status()?;

    println!("Unit {} restarted.", unit);

    Ok(status)
}

pub fn kill_all(process_name: &str) {
    Command::new("killall")
        .arg(process_name)
        .status()
        .ok();
}
