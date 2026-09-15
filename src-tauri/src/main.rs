mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_system_stats,
            commands::media_key,
        ])
        .setup(|app| {
            if let Some(win) = app.get_webview_window("main") {
                if let Ok(Some(monitor)) = app.primary_monitor() {
                    let mon_size = monitor.size();
                    if let Ok(win_size) = win.outer_size() {
                        let x = (mon_size.width as i32 - win_size.width as i32) / 2;
                        let _ = win.set_position(tauri::PhysicalPosition::new(x, 20i32));
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Dynamic Island");
}
