use std::{env, io};
use std::os::unix::fs;

const SANDBOX_ROOT: &str = "./sandbox";

pub fn chroot() -> io::Result<()> {
    fs::chroot(SANDBOX_ROOT)?;
    env::set_current_dir("/")
}
