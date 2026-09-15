import { invoke } from "@tauri-apps/api/core";
import type { SystemStats, MediaKey } from "../types";

export const getSystemStats = () => invoke<SystemStats>("get_system_stats");

export const mediaKey = (key: MediaKey) =>
  invoke<void>("media_key", { key });
