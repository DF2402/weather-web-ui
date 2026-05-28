"use client";
import React, { useEffect, useState } from 'react'
import { useLocationContext } from './context/locationContext';

export default function App() :React.JSX.Element {
  const [temperature , setTemperature] = useState(50)
  const [humidity, setHumidity] = useState(0);
  const [city, setCity] = useState("unknown")
  const { coordinates, loading } = useLocationContext();
  const [forecast, setForecast] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
 
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
              console.log("Received weather data:", data);
                if (data !== undefined) {
                    setTemperature(data.temperature);
                    setHumidity(data.humidity);
                    setCity(data.city);
                    setForecast(data.forecast || "No forecast available");
                    setIcon(data.icon || "");
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
    <div className="flex w-full min-h-screen justify-center bg-bg "> 

      <div className=' flex flex-col w-full max-w-[2400px] gap-8 p-10 '>  

        <div className="row-span-1 w-full h-[152px] rounded-3xl bg-bg shadow-convex">

          <div className='className="flex flex-col items-start justify-start w-full h-full gap-4 p-4' >

            <span className="text-2xl rounded-full font-bold text-center text-gauge shadow-concave py-2 px-4"> 天氣預報 </span>

            <div id="warning=" className="flex items-center justify-start gap-4 p-4">
              <img src="https://www.hko.gov.hk/images/HKOWarningSymbols/warn800_20_hot.png" alt="warning" className="w-[70px] h-[70px]" />
            </div>

          </div>


        </div>

        <div id="" className="flex flex-col lg:flex-row  gap-8 p-10 w-full "> 

          <div id="left column " className="flex-grow flex flex-col gap-8">

            <div className="flex flex-col items-end justify-start w-full h-[480px] rounded-3xl bg-bg shadow-convex gap-4 p-4">
              <div id="header" className='text-2xl rounded-full font-bold text-center text-gauge shadow-concave py-2 px-4'>分區天氣</div>

              <div id ="content group" className="flex flex-row items-end justify-start w-full h-full">
                <div className="flex flex-col ">
                
                  
                
               
                  <div id ="content row" className="flex items-start justify-start w-full h-full gap-4 p-4">
                    <span className=" text-2xl font-bold text-center text-gauge "> {city} </span>
                    
                  </div>
                  <div id ="content group" className="flex flex-col items-start justify-start w-full h-full gap-4 p-4">
                    <span className=" text-8xl font-bold text-center text-inter "> {temperature.toFixed(1)}°C </span>
                    <span className=" text-8xl font-bold text-center text-inter "> {humidity }% </span>
                      
                      
                  </div>
                </div>

                  <div id ="content row" className="flex flex-row items-start justify-end w-full h-full gap-4 p-4">
                    <img src={`data:image/png;base64,${icon}`} className=" w-[300px] h-[300px]" />
                  </div>
              
              
                  
              </div>
                
            </div>

            <div className=" items-center justify-center w-full h-[200px] rounded-3xl bg-bg shadow-convex ">
                  
              </div>

            
            
          </div>

          <div id="right column" className="lg:w-[350px] flex flex-col gap-8 ">

              <div className=" items-center justify-center w-full h-[280px] rounded-3xl bg-bg shadow-convex ">

            </div>

              <div className="items-center justify-center w-full  rounded-3xl bg-bg shadow-convex ">
                <div id ="content group" className="flex flex-col items-start justify-start w-full h-full gap-4 p-4">
                    <span className="text-2xl rounded-full font-bold text-center text-gauge shadow-concave py-2 px-4"> 天氣預報 </span>
                    <div className="flex items-center justify-start gap-4 p-4">
                    <span className=" text-2xl font-bold text-center text-gauge "> {forecast} </span>
                    </div>

                </div>
                  
              </div>

          </div>
        </div>
      </div>
    </div>
  )
}


function weatherWidget() : React.JSX.Element {
  const loading = true;
  const coordinates = { latitude: 0, longitude: 0 };
  const temp = 25;
  const city = "Unknown";
  return (
    <>
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
      </>
  )}
