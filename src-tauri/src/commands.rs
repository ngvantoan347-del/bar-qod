use serde::Serialize;
use std::sync::{Mutex, OnceLock};
use sysinfo::{Disks, System};
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

static SYS: OnceLock<Mutex<System>> = OnceLock::new();
static DISKS: OnceLock<Mutex<Disks>> = OnceLock::new();

fn sys() -> &'static Mutex<System> {
    SYS.get_or_init(|| Mutex::new(System::new_all()))
}

fn disks() -> &'static Mutex<Disks> {
    DISKS.get_or_init(|| Mutex::new(Disks::new_with_refreshed_list()))
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub cpu_cores: u32,
    pub cpu_cores_used: u32,
    pub ram_used_mb: u64,
    pub ram_total_mb: u64,
    pub swap_used_mb: u64,
    pub swap_total_mb: u64,
    pub disk_used_mb: u64,
    pub disk_total_mb: u64,
    pub core_usage: Vec<f32>,
}

#[tauri::command]
pub fn get_system_stats() -> SystemStats {
    let mut guard = sys().lock().unwrap_or_else(|poisoned| poisoned.into_inner());
    let s = &mut *guard;

    s.refresh_cpu_usage();
    s.refresh_memory();

    let cpu_usage = s.global_cpu_usage();
    let cores_total = s.cpus().len() as u32;
    let core_usage: Vec<f32> = s.cpus().iter().take(8).map(|c| c.cpu_usage()).collect();
    let cores_used = s.cpus().iter().filter(|c| c.cpu_usage() > 20.0).count() as u32;

    let ram_total = s.total_memory() / (1024 * 1024);
    let ram_used = s.used_memory() / (1024 * 1024);
    let swap_total = s.total_swap() / (1024 * 1024);
    let swap_used = s.used_swap() / (1024 * 1024);

    drop(guard);

    let mut disk_guard = disks().lock().unwrap_or_else(|poisoned| poisoned.into_inner());
    disk_guard.refresh(true);
    let (disk_total, disk_used) = match disk_guard.first() {
        Some(disk) => {
            let total = disk.total_space() / (1024 * 1024);
            let available = disk.available_space() / (1024 * 1024);
            (total, total.saturating_sub(available))
        }
        None => (0, 0),
    };

    SystemStats {
        cpu_usage,
        cpu_cores: cores_total,
        cpu_cores_used: cores_used,
        ram_used_mb: ram_used,
        ram_total_mb: ram_total,
        swap_used_mb: swap_used,
        swap_total_mb: swap_total,
        disk_used_mb: disk_used,
        disk_total_mb: disk_total,
        core_usage,
    }
}

#[tauri::command]
pub fn media_key(app: AppHandle, key: &str) -> Result<(), String> {
    let vk: u32 = match key {
        "play" => 0xB3,
        "next" => 0xB0,
        "prev" => 0xB1,
        "volup" => 0xAF,
        "voldown" => 0xAE,
        "mute" => 0xAD,
        other => return Err(format!("unknown media key: {other}")),
    };

    let ps_script = format!(
        "(New-Object -ComObject WScript.Shell).SendKeys([char]::ConvertFromUtf32({vk}))"
    );

    app.shell()
        .command("powershell.exe")
        .args([
            "-NoProfile",
            "-WindowStyle",
            "Hidden",
            "-Command",
            &ps_script,
        ])
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}
