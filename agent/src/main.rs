use serde::Deserialize;

use crate::routines::{elevator, keyfilter, memory_manager};

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

fn main() {
    elevator::elevate("com.kitsuned.althome")
        .expect("Failed to elevate app.");

    keyfilter::rewire()
        .expect("Failed to rewire KeyFilters configuration.");

    let config: AltHomeSettings = luna::configd::get("com.kitsuned.althome").unwrap();

    if config.memory_quirks {
        memory_manager::rewire()
            .expect("Failed to rewire Memory Manager configuration.");
    }
}
