import { useCallback } from "react";
import { ZapIcon, ClockIcon, ClipboardIcon, CalendarIcon } from "./icons";
import { mediaKey } from "../services/tauri";

function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export default function QuickActions({ collapsed }: { collapsed?: boolean }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const handleCopyTime = useCallback(() => copy(timeStr), [timeStr]);
  const handleCopyDate = useCallback(() => copy(dateStr), [dateStr]);

  if (collapsed) {
    return (
      <div className="qa-mini">
        <ZapIcon />
      </div>
    );
  }

  return (
    <div className="widget quick-actions">
      <div className="widget-header">
        <ZapIcon />
        <span>Quick Actions</span>
      </div>
      <div className="qa-grid">
        <button className="qa-btn" onClick={handleCopyTime} title="Copy current time">
          <ClockIcon />
          <span>Copy Time</span>
        </button>
        <button className="qa-btn" onClick={handleCopyDate} title="Copy current date">
          <CalendarIcon />
          <span>Copy Date</span>
        </button>
        <button className="qa-btn" onClick={() => mediaKey("volup")} title="Volume up">
          <ZapIcon />
          <span>Vol +</span>
        </button>
        <button className="qa-btn" onClick={() => mediaKey("mute")} title="Mute">
          <ClipboardIcon />
          <span>Mute</span>
        </button>
      </div>
    </div>
  );
}
