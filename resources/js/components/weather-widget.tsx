import { useEffect, useState } from 'react';
import { Sun } from 'lucide-react';

interface WeatherData {
    temp: number;
}

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            return;
        }

        // If previously denied in this session, do not request or show anything
        if (sessionStorage.getItem('newsportal_geo_denied') === 'true') {
            setDenied(true);
            return;
        }

        // Check if weather is cached in session
        const cached = sessionStorage.getItem('newsportal_weather_cache');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                    setWeather(parsed.data);
                    return;
                }
            } catch {
                sessionStorage.removeItem('newsportal_weather_cache');
            }
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                    );
                    if (!res.ok) {
                        setWeather(null);
                        return;
                    }
                    const json = await res.json();
                    if (json.current_weather && typeof json.current_weather.temperature === 'number') {
                        const data = { temp: Math.round(json.current_weather.temperature) };
                        setWeather(data);
                        sessionStorage.setItem('newsportal_weather_cache', JSON.stringify({
                            data,
                            timestamp: Date.now(),
                        }));
                    }
                } catch {
                    setWeather(null);
                }
            },
            () => {
                // User refused or permission denied -> completely remove weather parts
                sessionStorage.setItem('newsportal_geo_denied', 'true');
                setDenied(true);
                setWeather(null);
            },
            { timeout: 8000 }
        );
    }, []);

    // If user refuses or no weather data available, remove the weather part entirely
    if (denied || !weather) {
        return null;
    }

    return (
        <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{weather.temp}°C</span>
        </span>
    );
}
