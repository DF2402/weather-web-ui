import { NextRequest, NextResponse } from 'next/server';
const STATIONS_COORDS = {
    "香港天文台": {"lat": 22.3022, "lon": 114.1742, "district": "油尖旺"},
    "京士柏": {"lat": 22.3119, "lon": 114.1728, "district": "油尖旺"},
    "黃竹坑": {"lat": 22.2478, "lon": 114.1667, "district": "南區"},
    "香港公園": {"lat": 22.2783, "lon": 114.1622, "district": "中西區"},
    "九龍城": {"lat": 22.3350, "lon": 114.1847, "district": "九龍城"},
    "深水埗": {"lat": 22.3361, "lon": 114.1536, "district": "深水埗"},
    "黃大仙": {"lat": 22.3394, "lon": 114.2053, "district": "黃大仙"},
    "觀塘": {"lat": 22.3186, "lon": 114.2247, "district": "觀塘"},
    "跑馬地": {"lat": 22.2706, "lon": 114.1836, "district": "灣仔"},
    "筲箕灣": {"lat": 22.2817, "lon": 114.2361, "district": "東區"},
    "啟德跑道公園": {"lat": 22.3047, "lon": 114.2172, "district": "九龍城"},

    "沙田": {"lat": 22.4025, "lon": 114.2100, "district": "沙田"},
    "大埔": {"lat": 22.4461, "lon": 114.1783, "district": "大埔"},
    "打鼓嶺": {"lat": 22.5286, "lon": 114.1567, "district": "北區"},
    "流浮山": {"lat": 22.4689, "lon": 113.9839, "district": "元朗"},
    "屯門": {"lat": 22.3858, "lon": 113.9642, "district": "屯門"},
    "將軍澳": {"lat": 22.3158, "lon": 114.2625, "district": "西貢"},
    "西貢": {"lat": 22.3836, "lon": 114.2708, "district": "西貢"},
    "長洲": {"lat": 22.2011, "lon": 114.1267, "district": "離島區"},
    "赤鱲角": {"lat": 22.3094, "lon": 113.9219, "district": "離島區"},
    "青衣": {"lat": 22.3453, "lon": 114.1083, "district": "葵青"},
    "石崗": {"lat": 22.4361, "lon": 114.0789, "district": "元朗"},
    "元朗公園": {"lat": 22.4419, "lon": 114.0181, "district": "元朗"},
    "大美督": {"lat": 22.4744, "lon": 114.2431, "district": "大埔"},
    "赤柱": {"lat": 22.2144, "lon": 114.2144, "district": "南區"},

    "荃灣可觀": {"lat": 22.3828, "lon": 114.1114, "district": "荃灣"},
    "荃灣城門谷": {"lat": 22.3756, "lon": 114.1261, "district": "荃灣"}
};

interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    uvindex: number;
    city: string;
    warningMessage ?: string;
}
function findNearestStation(lat: number, lon: number) {
    let nearestStation = null;
    let associatedDistrict = null;
    let minDistance = Infinity;
    let phi1 = lat * Math.PI / 180;
    let R = 6371.0;

    for (const [station, coords] of Object.entries(STATIONS_COORDS)) {
        const dLat = (coords.lat - lat) * Math.PI / 180;
        const dLon = (coords.lon - lon) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(phi1) * Math.cos(coords.lat * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
            associatedDistrict = coords.district; 
        }
    }

    return {
        tempStation: nearestStation,  
        rainDistrict: associatedDistrict
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing lat or lon parameters' }, { status: 400 });
    }

    const { tempStation, rainDistrict } = findNearestStation(parseFloat(lat), parseFloat(lon));
    if (!tempStation || !rainDistrict) {
        return NextResponse.json({ error: 'No nearby weather station found' }, { status: 404 });
    }

    const params = new URLSearchParams({
        dataType: 'rhrread',
        lang: 'tc'
    });
    const apiUrl = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?${params.toString()}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const rawData = await response.json();

        const tempEntry = rawData.temperature?.data?.find((entry: any) => entry.place === tempStation);
        const temperature = tempEntry ? tempEntry.value : null;

        const humidityEntry = rawData.humidity?.data?.[0];
        const humidity = humidityEntry ? humidityEntry.value : null;

        const rainfallEntry = rawData.rainfall?.data?.find((entry: any) =>
            entry.place === rainDistrict || rainDistrict.includes(entry.place)
        );
        const rainfall = rainfallEntry ? rainfallEntry.max : 0;

let uvindex = 0;
if (rawData.uvindex && typeof rawData.uvindex === 'object' && rawData.uvindex.data) {
    uvindex = rawData.uvindex.data[0]?.value || 0;
} else {
    uvindex = 0; 
}


        if (temperature === null) {
            return NextResponse.json({ error: ` [${tempStation}] data missing` }, { status: 404 });
        }   

        const data: WeatherData = {
            temperature: temperature,
            humidity: humidity,
            rainfall: rainfall,
            uvindex: uvindex,
            city: tempStation
        };
        console.log("Fetched weather data:", data);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }

    
}