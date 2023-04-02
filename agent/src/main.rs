use crate::routines::memory_manager;

#[cfg(feature = "sandbox")]
use crate::sandbox::chroot;

#[cfg(feature = "sandbox")]
mod sandbox;

mod routines;
mod rewire;

fn main() {
    #[cfg(feature = "sandbox")]
    chroot().expect("Failed to chroot in sandbox.");

    memory_manager::rewire()
        .expect("Failed to rewire Memory Manager configuration.");
}
