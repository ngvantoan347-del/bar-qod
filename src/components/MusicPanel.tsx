import { useState, useCallback } from "react";
import { mediaKey } from "../services/tauri";
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPrevIcon, VolUpIcon, VolDownIcon, MuteIcon } from "./icons";
import type { MediaKey } from "../types";

interface Props { collapsed?: boolean; }

const btn = (action: MediaKey) => mediaKey(action).catch(() => {});

export default function MusicPanel({ collapsed }: Props) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    btn("play");
    setPlaying((p) => !p);
  }, []);

  if (collapsed) {
    return (
      <div className="music-mini">
        <span className="music-mini-icon">{playing ? "\uD83C\uDFB5" : "\uD83C\uDFB6"}</span>
        <span className="music-mini-label">Music</span>
      </div>
    );
  }

  return (
    <div className="widget music-panel">
      <div className="music-header">
        <span className="music-dot" />
        <span className="music-label">Media Controls</span>
      </div>
      <div className="music-controls">
        <button className="ctrl-btn sm" onClick={() => btn("prev")} title="Previous"><SkipPrevIcon /></button>
        <button className="ctrl-btn lg" onClick={handlePlay} title={playing ? "Pause" : "Play"}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="ctrl-btn sm" onClick={() => btn("next")} title="Next"><SkipNextIcon /></button>
      </div>
      <div className="music-volume">
        <button className="ctrl-btn sm" onClick={() => btn("voldown")} title="Volume down"><VolDownIcon /></button>
        <button className="ctrl-btn sm" onClick={() => btn("mute")} title="Mute"><MuteIcon /></button>
        <button className="ctrl-btn sm" onClick={() => btn("volup")} title="Volume up"><VolUpIcon /></button>
      </div>
    </div>
  );
}
