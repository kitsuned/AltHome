use std::env::{current_exe, set_current_dir};
use std::io;
use serde::Deserialize;

use crate::routines::{elevator, keyfilter, memory_manager, root_syml};

mod routines;
mod rewire;
mod luna;

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
struct AltHomeSettings {
    #[serde(default = "low_memory")]
    memory_quirks: bool,
}

fn low_memory() -> bool {
    // TODO implement checks
    true
}

fn setup_env() -> Result<(), io::Error> {
    set_current_dir(current_exe().unwrap().parent().unwrap())
}

fn main() {
    setup_env().unwrap();

    elevator::elevate("com.kitsuned.althome")
        .expect("Failed to elevate app.");

    root_syml::create_symlink()
        .expect("Failed to create symbolic link.");

    keyfilter::rewire()
        .expect("Failed to rewire KeyFilters configuration.");

    let config = luna::configd::get::<AltHomeSettings>("com.kitsuned.althome");

    let config = match config {
        Ok(config) => config,
        Err(_) => AltHomeSettings {
            memory_quirks: low_memory()
        }
    };

    if config.memory_quirks {
        memory_manager::rewire()
            .expect("Failed to rewire Memory Manager configuration.");
    }
}
