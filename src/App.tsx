import { useState, useCallback, useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { PhysicalSize, PhysicalPosition } from "@tauri-apps/api/dpi";
import { getSystemStats } from "./services/tauri";
import { getWeather } from "./services/weather";
import { usePolling } from "./hooks/usePolling";
import { CONFIG } from "./config";
import type { IslandMode, Alert, SystemStats as StatsType, WeatherData } from "./types";
import Island from "./components/Island";

let alertId = 0;
function makeAlert(level: Alert["level"], text: string): Alert {
  return { id: String(++alertId), level, text, ts: Date.now() };
}

export default function App() {
  const [mode, setMode] = useState<IslandMode>("collapsed");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const prevStats = useRef<StatsType | null>(null);
  const win = useRef(getCurrentWindow());

  const [stats] = usePolling<StatsType>(getSystemStats, CONFIG.statsUpdateMs);
  const [weather] = usePolling<WeatherData>(getWeather, CONFIG.weatherUpdateMs);

  // Derive alerts from system stats
  useEffect(() => {
    if (!stats) return;
    prevStats.current = stats;
    const next: Alert[] = [];

    if (stats.cpuUsage > 85) next.push(makeAlert("danger", `CPU ${Math.round(stats.cpuUsage)}% is high`));
    if (stats.cpuUsage > 65 && stats.cpuUsage <= 85) next.push(makeAlert("warn", `CPU ${Math.round(stats.cpuUsage)}% elevated`));

    const ramPct = (stats.ramUsedMb / stats.ramTotalMb) * 100;
    if (ramPct > 85) next.push(makeAlert("danger", `RAM ${Math.round(ramPct)}% — low memory`));
    else if (ramPct > 70) next.push(makeAlert("warn", `RAM ${Math.round(ramPct)}%`));

    const diskPct = (stats.diskUsedMb / stats.diskTotalMb) * 100;
    if (diskPct > 90) next.push(makeAlert("danger", `Disk ${Math.round(diskPct)}% — critically low`));

    setAlerts((prev) => {
      // keep only still-relevant alerts + new ones
      const keep = prev.filter((a) => {
        const still = next.find((n) => n.level === a.level && a.text === n.text);
        return !!still || (Date.now() - a.ts < 20_000);
      });
      // dedupe new by text
      const fresh = next.filter((n) => !keep.some((k) => k.text === n.text));
      return [...keep, ...fresh].slice(-8);
    });
  }, [stats]);

  // Resize window on mode change
  useEffect(() => {
    const t = CONFIG[mode];
    (async () => {
      try {
        const cur = await win.current.innerSize();
        const pos = await win.current.outerPosition();
        const newW = t.width;
        const newH = t.height;
        const dx = newW - cur.width;
        await win.current.setPosition(new PhysicalPosition(pos.x - Math.round(dx / 2), pos.y));
        await win.current.setSize(new PhysicalSize(newW, newH));
      } catch {
        /* window not ready yet */
      }
    })();
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "collapsed" ? "expanded" : "collapsed"));
  }, []);

  const handleDragStart = useCallback(() => {
    win.current.startDragging().catch(() => {});
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return (
    <Island
      mode={mode}
      stats={stats}
      weather={weather}
      alerts={alerts}
      onDismissAlert={dismissAlert}
      onClearAlerts={clearAlerts}
      onToggleMode={toggleMode}
      onDragStart={handleDragStart}
    />
  );
}
