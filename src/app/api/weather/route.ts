import { NextRequest, NextResponse } from 'next/server';

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  humidity: number;
  icon: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing lat or lon parameters' }, { status: 400 });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const rawData = await response.json();
        const data: WeatherData = {
            city: rawData.name,
            temp: rawData.main.temp,
            description: rawData.weather[0].description,
            humidity: rawData.main.humidity,
            icon: rawData.weather[0].icon,
        };
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }

    
}