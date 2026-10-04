"use client";

import { useEffect, useState } from "react";
import { Widget } from "@/components/widgets/widget";
import { WidgetSkeleton } from "@/components/widgets/widget";

/**
 * Current conditions in Colombo, from Open-Meteo.
 *
 * Why this is a client fetch rather than a build-time value: weather that is
 * baked into a static export is wrong within the hour, which makes it worse
 * than showing nothing. Open-Meteo needs no API key and sends CORS headers, so
 * it works from a static host with nothing to configure.
 *
 * What that costs, stated plainly:
 *  - the visitor's IP is exposed to open-meteo.com, which is a real privacy
 *    consideration and is why this is opt-in to remove;
 *  - the request happens on every page that renders this widget, so it is
 *    cached by the browser rather than by us;
 *  - there is no server to hide an API key behind, so anything secret must not
 *    be used here. Open-Meteo's public tier is designed for exactly this.
 *
 * Same hydration discipline as the countdown: skeleton on the server and on
 * the first client render, real data only from an effect.
 */

const COLOMBO = { latitude: 6.9271, longitude: 79.8612 };

/** WMO weather interpretation codes, reduced to the labels a reader needs. */
const CONDITIONS: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorms",
};

type Weather = {
  temperature: number;
  apparent: number;
  condition: string;
  isDay: boolean;
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${COLOMBO.latitude}` +
      `&longitude=${COLOMBO.longitude}` +
      "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
      "&timezone=Asia%2FColombo";

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
        return res.json();
      })
      .then((data: { current?: Record<string, number> }) => {
        const current = data.current;
        if (!current) throw new Error("Open-Meteo returned no current block");
        setWeather({
          temperature: Math.round(current.temperature_2m),
          apparent: Math.round(current.apparent_temperature),
          condition: CONDITIONS[current.weather_code] ?? "Current conditions",
          isDay: current.is_day === 1,
        });
      })
      .catch((error: unknown) => {
        // An aborted request is the unmount path, not a failure to report.
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });

    return () => controller.abort();
  }, []);

  return (
    <Widget title="Colombo" eyebrow="Weather">
      {failed ? (
        <p className="text-sm text-quiet-ink">
          Conditions are unavailable right now.
        </p>
      ) : weather === null ? (
        <WidgetSkeleton lines={2} />
      ) : (
        <div>
          <p className="display-tight text-3xl tabular-nums">
            {weather.temperature}
            <span className="ml-1 text-lg">&deg;C</span>
          </p>
          <p className="mt-1 text-sm text-quiet-ink">{weather.condition}</p>
          <p className="field mt-3 text-xs">
            Feels like {weather.apparent}&deg;C
            {weather.isDay ? "" : " &#183; overnight"}
          </p>
          <p className="field mt-3 text-xs">
            From{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2"
            >
              Open-Meteo
            </a>
          </p>
        </div>
      )}
    </Widget>
  );
}