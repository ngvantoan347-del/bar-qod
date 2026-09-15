import { useState, useEffect } from "react";
import type { WeatherData } from "../types";

interface Props { weather: WeatherData | null; collapsed?: boolean; }

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

export default function ClockWeather({ weather, collapsed }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  const dateLine = now.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" });

  if (collapsed) {
    return (
      <div className="cw-mini">
        <span className="cw-time">{hh}:{mm}</span>
        {weather && <span className="cw-temp">{weather.icon}{Math.round(weather.temperature)}°</span>}
      </div>
    );
  }

  return (
    <div className="widget clock-weather">
      <div className="cw-big-time">
        <span>{hh}</span>
        <span className="cw-colon">:</span>
        <span>{mm}</span>
        <span className="cw-sec">{ss}</span>
      </div>
      <div className="cw-date">{dateLine}</div>
      {weather ? (
        <div className="cw-weather">
          <span className="cw-weather-icon">{weather.icon}</span>
          <span className="cw-weather-temp">{Math.round(weather.temperature)}°C</span>
          <span className="cw-weather-label">{weather.label}</span>
          <span className="cw-weather-city">{weather.city}</span>
          <span className="cw-weather-detail">Humidity {weather.humidity}%  Wind {weather.windSpeed} km/h</span>
        </div>
      ) : (
        <div className="cw-weather cw-loading">Loading weather...</div>
      )}
    </div>
  );
}
