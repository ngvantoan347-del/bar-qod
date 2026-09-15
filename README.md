# Dynamic Island for PC

A premium floating Dynamic Island bar for your Windows desktop — built with **Tauri v2** + **React + TypeScript**.

## Features

- **Pill-shaped floating bar** at the top of your screen — collapses to a tiny capsule, expands on click
- **System Stats**: live CPU / RAM / Disk usage with gradient bars
- **Media Controls**: play / pause / next / prev / volume — controls any active player
- **Clock + Weather**: always-visible clock, weather auto-detected via IP (Open-Meteo)
- **Notifications**: auto-alerts when CPU/RAM/Disk get high
- **Quick Actions**: copy time/date, volume controls

## How it works

The app runs as a frameless, transparent, always-on-top window. No taskbar entry.
Click the pill to expand, click outside or the chevron to collapse.

## Build (no local Rust needed!)

This project uses **GitHub Actions** to build the `.exe` on the cloud:

1. Push this repo to GitHub
2. **Option A** — Tag a release:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
   → GitHub Actions builds the `.exe` and attaches it to a GitHub Release.

3. **Option B** — Manual trigger:
   Go to **Actions** → **Build Dynamic Island** → **Run workflow**

4. Download the `.exe` from **Actions** → latest run → **Artifacts**

## Local development (optional, requires Rust)

```bash
npm install
npm run tauri dev
```

## Tech stack

| Layer | Tech |
|-------|------|
| Shell | Tauri v2 (Rust) |
| Backend | sysinfo crate, PowerShell SendKeys |
| Frontend | React 18, TypeScript, Vite |
| Weather | Open-Meteo API + IP geolocation |
| Build | GitHub Actions |

## Project structure

```
src-tauri/          ← Rust backend (sysinfo, media keys)
src/                ← React frontend (island UI, 5 widgets)
.github/workflows/  ← Cloud build pipeline
scripts/            ← Icon generator
```

## License

MIT
