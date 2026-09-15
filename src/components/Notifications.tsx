import { BellIcon, XIcon } from "./icons";
import type { Alert } from "../types";

interface Props { alerts: Alert[]; onDismiss: (id: string) => void; onClearAll: () => void; collapsed?: boolean; }

export default function Notifications({ alerts, onDismiss, onClearAll, collapsed }: Props) {
  if (collapsed) {
    return (
      <div className="notif-mini">
        <BellIcon />
        {alerts.length > 0 && <span className="notif-badge">{alerts.length}</span>}
      </div>
    );
  }

  return (
    <div className="widget notifications">
      <div className="widget-header">
        <BellIcon />
        <span>Alerts</span>
        {alerts.length > 0 && (
          <button className="clear-btn" onClick={onClearAll}>Clear all</button>
        )}
      </div>
      <div className="notif-list">
        {alerts.length === 0 && <div className="notif-empty">No alerts right now</div>}
        {alerts.map((a) => (
          <div key={a.id} className={`notif-item ${a.level}`}>
            <span className="notif-dot" />
            <span className="notif-text">{a.text}</span>
            <button className="notif-dismiss" onClick={() => onDismiss(a.id)}>
              <XIcon size={9} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
