import React from "react";
import type { SystemStats as StatsType } from "../types";
import { CpuIcon, RamIcon, DiskIcon } from "./icons";

interface Props { stats: StatsType | null; collapsed?: boolean; }

function Bar({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="stat-row">
      <span className="stat-icon" style={{ color }}>{icon}</span>
      <span className="stat-label">{label}</span>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="stat-value">{Math.round(pct)}%</span>
    </div>
  );
}

export default function SystemStats({ stats, collapsed }: Props) {
  if (collapsed) {
    const cpu = stats ? Math.round(stats.cpuUsage) : "--";
    return (
      <div className="system-mini">
        <CpuIcon />
        <span className="system-mini-val">{cpu}%</span>
      </div>
    );
  }

  const cpuPct = stats?.cpuUsage ?? 0;
  const ramPct = stats ? (stats.ramUsedMb / stats.ramTotalMb) * 100 : 0;
  const diskPct = stats ? (stats.diskUsedMb / stats.diskTotalMb) * 100 : 0;

  const ramLabel = stats ? `${stats.ramUsedMb}M / ${stats.ramTotalMb}M` : "--";
  const diskLabel = stats ? `${Math.round(stats.diskUsedMb / 1024)}G / ${Math.round(stats.diskTotalMb / 1024)}G` : "--";

  return (
    <div className="widget system-stats">
      <div className="widget-header">
        <CpuIcon />
        <span>System</span>
        {stats?.coreUsage && stats.coreUsage.length > 0 && (
          <span className="core-chips">
            {stats.coreUsage.slice(0, 4).map((u, i) => (
              <span key={i} className="core-chip" style={{ opacity: 0.4 + (u / 100) * 0.6 }}>{Math.round(u)}</span>
            ))}
          </span>
        )}
      </div>
      <Bar icon={<CpuIcon />} label="CPU" value={cpuPct} color="var(--accent-1)" />
      <Bar icon={<RamIcon />} label="RAM" value={ramPct} color="var(--accent-2)" />
      <div className="stat-detail">{ramLabel}</div>
      <Bar icon={<DiskIcon />} label="Disk" value={diskPct} color="var(--accent-3)" />
      <div className="stat-detail">{diskLabel}</div>
    </div>
  );
}
