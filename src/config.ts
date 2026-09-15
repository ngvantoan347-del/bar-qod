export const CONFIG = {
  collapsed: { width: 226, height: 64 },
  expanded: { width: 432, height: 470 },
  statsUpdateMs: 1500,
  weatherUpdateMs: 60_000,
  weatherApi: "https://api.open-meteo.com/v1/forecast",
  geoApi: "https://ipapi.co/json",
  geoFallback: "https://ipwho.is/",
  defaultCity: "Ha Noi",
  defaultLat: 21.03,
  defaultLon: 105.85,
} as const;
