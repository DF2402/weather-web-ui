"use client";
import React, { useEffect, useState } from 'react'
import { useLocationContext } from './context/locationContext';

export default function App() :React.JSX.Element {
  const [temp, setTemp] = useState(50)
  const [city, setCity] = useState("unknown")
  const { coordinates, loading } = useLocationContext();
 
  function tempToBar(temp: number): number {
    const minTemp = -30; 
    const maxTemp = 50;
    if (temp < minTemp) temp = minTemp;
    if (temp > maxTemp) temp = maxTemp;
    return ((temp - minTemp) / (maxTemp - minTemp)) * 100;
  }
  
  useEffect(() => {
  
    if (coordinates) {
        const { latitude, longitude } = coordinates;

        try {
            fetch(`api/weather?lat=${latitude}&lon=${longitude}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.temperature !== undefined) {
                    setTemp(data.temperature);
                    setCity(data.city);
                } else {
                    console.error("Temperature data is missing in the response:", data);
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
        } catch (error) {
            console.error("Error in fetch:", error);
        }
    }
  }, [coordinates]);
  return(
    <div className="flex min-h-screen justify-center bg-bg gap-8 p-8"> 
      <div className="flex flex-col items-center justify-center w-[340px] h-[480] rounded-3xl bg-bg shadow-convex ">
          <div className="relative flex items-center justify-center h-[240px] w-[240px]  rounded-full bg-bg shadow-convex">
            <div className="relative flex items-center justify-center h-[220px] w-[220px] rounded-full bg-bg shadow-concave">
              <div className="relative flex items-center justify-center h-[170px] w-[170px] rounded-full bg-bg shadow-convex">
              </div> 
              <svg className="absolute -rotate-90 w-[220px] h-[220px]" viewBox='0 0 100 100'>
                  <circle cx='50' cy='50' r='45' fill='none' stroke="rgba(255, 205, 4, 0.8)" strokeWidth='6' strokeLinecap="round" strokeDasharray={`${283 * (tempToBar(temp) / 100)} 283`} className="transition-all duration-300 ease-out "  />
                </svg>
                <div 
                  className="absolute  flex justify-center w-full h-full transition-all duration-300 ease-out pointer-events-none"
                  style={{ transform: `rotate(${tempToBar(temp) * 3.6}deg)` }}
                >
                <div className=' justify-center h-[30px] w-[30px] rounded-full bg-bg shadow-convex-sm'> </div>
                </div>
                <div className='absolute flex flex-col items-center justify-center  w-full h-full p-8 gap-4'>
            
                    <div className="text-center text-apple">
                        {temp.toFixed(1)}°C
                    </div>

                    <div className="text-center text-gauge-sm">
                        {city}
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center w-[180px] h-[100] rounded-3xl bg-bg shadow-convex">
              <div className="text-2xl font-bold text-center text-gauge"> location  </div>
              {
                loading ? (
                  <div className="text-center text-gauge">
                    Loading...
                  </div>
                  
                ) : (
                    <div className="text-center text-gauge">
                    Latitude: {coordinates.latitude.toFixed(2)} <br />
                    Longitude: {coordinates.longitude.toFixed(2)}
                  </div>
                )
              }
        </div>

    
      </div>
  )
}