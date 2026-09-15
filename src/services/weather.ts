import { CONFIG } from "../config";
import type { WeatherData, GeoLocation } from "../types";

const WMO_ICONS: Record<number, { icon: string; label: string }> = {
  0:  { icon: "\u2600\uFE0F",  label: "Clear" },
  1:  { icon: "\uD83C\uDF24\uFE0F", label: "Partly cloudy" },
  2:  { icon: "\u26C5",  label: "Cloudy" },
  3:  { icon: "\u2601\uFE0F", label: "Overcast" },
  45: { icon: "\uD83C\uDF2B\uFE0F", label: "Fog" },
  48: { icon: "\uD83C\uDF2B\uFE0F", label: "Rime fog" },
  51: { icon: "\uD83C\uDF26\uFE0F", label: "Light drizzle" },
  53: { icon: "\uD83C\uDF26\uFE0F", label: "Drizzle" },
  55: { icon: "\uD83C\uDF27\uFE0F", label: "Heavy drizzle" },
  61: { icon: "\uD83C\uDF27\uFE0F", label: "Light rain" },
  63: { icon: "\uD83C\uDF27\uFE0F", label: "Rain" },
  65: { icon: "\u26C8\uFE0F", label: "Heavy rain" },
  66: { icon: "\uD83C\uDF28\uFE0F", label: "Freezing rain" },
  67: { icon: "\uD83C\uDF28\uFE0F", label: "Heavy freezing rain" },
  71: { icon: "\uD83C\uDF28\uFE0F", label: "Light snow" },
  73: { icon: "\u2744\uFE0F",  label: "Snow" },
  75: { icon: "\u2744\uFE0F",  label: "Heavy snow" },
  77: { icon: "\u2744\uFE0F",  label: "Snow grains" },
  80: { icon: "\uD83C\uDF26\uFE0F", label: "Light showers" },
  81: { icon: "\uD83C\uDF27\uFE0F", label: "Showers" },
  82: { icon: "\u26C8\uFE0F", label: "Heavy showers" },
  85: { icon: "\uD83C\uDF28\uFE0F", label: "Snow showers" },
  86: { icon: "\uD83C\uDF28\uFE0F", label: "Heavy snow showers" },
  95: { icon: "\u26C8\uFE0F", label: "Thunderstorm" },
  96: { icon: "\u26C8\uFE0F", label: "Thunderstorm + hail" },
  99: { icon: "\u26C8\uFE0F", label: "Severe thunderstorm" },
};

export function weatherCodeInfo(code: number): { icon: string; label: string } {
  return WMO_ICONS[code] ?? { icon: "\u2753", label: "Unknown" };
}

async function locate(): Promise<GeoLocation> {
  try {
    const r = await fetch(CONFIG.geoApi, { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    return { latitude: d.latitude, longitude: d.longitude, city: d.city ?? CONFIG.defaultCity, country: d.country_name ?? "" };
  } catch {
    /* fallback */
  }
  try {
    const r = await fetch(CONFIG.geoFallback, { signal: AbortSignal.timeout(3000) });
    const d = await r.json();
    return { latitude: d.latitude, longitude: d.longitude, city: d.city ?? CONFIG.defaultCity, country: d.country ?? "" };
  } catch {
    /* fall back to defaults */
  }
  return { latitude: CONFIG.defaultLat, longitude: CONFIG.defaultLon, city: CONFIG.defaultCity, country: "VN" };
}

let cachedLoc: GeoLocation | null = null;

async function getLoc(): Promise<GeoLocation> {
  if (!cachedLoc) cachedLoc = await locate();
  return cachedLoc;
}

export async function getWeather(): Promise<WeatherData> {
  const loc = await getLoc();
  const url =
    `${CONFIG.weatherApi}?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    "&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m" +
    "&timezone=auto";
  const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error(`Weather API ${r.status}`);
  const d = await r.json();
  const cur = d.current;
  const code: number = cur.weather_code;
  const info = weatherCodeInfo(code);
  return {
    temperature: cur.temperature_2m,
    weatherCode: code,
    humidity: cur.relative_humidity_2m,
    windSpeed: cur.wind_speed_10m,
    city: loc.city,
    icon: info.icon,
    label: info.label,
  };
}
