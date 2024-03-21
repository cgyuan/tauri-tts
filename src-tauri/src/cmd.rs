use std::{fs, path::PathBuf};

#[tauri::command]
pub fn download_file(path: String, blob: Vec<u8>) {
  let path = PathBuf::from(path);
  fs::write(path, blob).expect("Unable to write file");
}