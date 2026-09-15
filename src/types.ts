export interface SystemStats {
  cpuUsage: number;
  cpuCores: number;
  cpuCoresUsed: number;
  ramUsedMb: number;
  ramTotalMb: number;
  swapUsedMb: number;
  swapTotalMb: number;
  diskUsedMb: number;
  diskTotalMb: number;
  coreUsage: number[];
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  city: string;
  icon: string;
  label: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export type MediaKey = "play" | "next" | "prev" | "volup" | "voldown" | "mute";

export type IslandMode = "collapsed" | "expanded";

export interface Alert {
  id: string;
  level: "warn" | "danger";
  text: string;
  ts: number;
}
