use std::io;
use std::os::unix::fs::symlink;
use std::path::Path;

pub fn create_symlink() -> Result<(), io::Error> {
    if Path::new("./root").is_symlink() {
        return Ok(());
    }

    symlink("/", "./root")?;

    println!("Created symbolic link to /.");

    Ok(())
}
