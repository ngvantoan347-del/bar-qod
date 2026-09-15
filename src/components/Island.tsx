import type { IslandMode, SystemStats as StatsType, WeatherData, Alert } from "../types";
import { ChevronDown } from "./icons";
import ClockWeather from "./ClockWeather";
import SystemStats from "./SystemStats";
import MusicPanel from "./MusicPanel";
import Notifications from "./Notifications";
import QuickActions from "./QuickActions";

interface Props {
  mode: IslandMode;
  stats: StatsType | null;
  weather: WeatherData | null;
  alerts: Alert[];
  onDismissAlert: (id: string) => void;
  onClearAlerts: () => void;
  onToggleMode: () => void;
  onDragStart: () => void;
}

export default function Island({ mode, stats, weather, alerts, onDismissAlert, onClearAlerts, onToggleMode, onDragStart }: Props) {
  const expanded = mode === "expanded";

  return (
    <div className={`island ${expanded ? "expanded" : "collapsed"}`} onPointerDown={(e) => {
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      onDragStart();
    }}>
      {/* Glow backdrop */}
      <div className="island-glow" />

      {/* Collapsed pill */}
      <div className={`pill-content ${expanded ? "hidden" : ""}`}>
        <div className="collapsed-zones" data-no-drag>
          <div className="zone zone-left" onClick={onToggleMode}>
            <ClockWeather weather={weather} collapsed />
          </div>
          <div className="zone zone-center" onClick={onToggleMode}>
            <div className="island-notch" />
          </div>
          <div className="zone zone-right" onClick={onToggleMode}>
            <SystemStats stats={stats} collapsed />
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      <div className={`expanded-panel ${expanded ? "" : "hidden"}`} data-no-drag>
        <div className="expanded-header" onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart();
        }}>
          <div className="expanded-dot" />
          <button className="collapse-btn" onClick={onToggleMode} title="Collapse">
            <ChevronDown />
          </button>
        </div>
        <div className="expanded-grid">
          <ClockWeather weather={weather} collapsed={false} />
          <SystemStats stats={stats} collapsed={false} />
          <MusicPanel collapsed={false} />
          <Notifications alerts={alerts} onDismiss={onDismissAlert} onClearAll={onClearAlerts} collapsed={false} />
          <QuickActions collapsed={false} />
        </div>
      </div>
    </div>
  );
}
