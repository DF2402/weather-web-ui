import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

export default function App() :React.JSX.Element {
  const [bar, setBar] = useState(50)
  return(
    <div className="flex min-h-screen item-center justify-center bg-bg "> 
      <div className="flex flex-col item-center justify-center w-[340px] h-[480] rounded-3xl bg-bg shadow-convex ">
          <div className="relative flex items-center justify-center h-[240px] w-[240px]  rounded-full bg-bg shadow-convex">
            <div className="relative flex items-center justify-center h-[220px] w-[220px] rounded-full bg-bg shadow-concave">
              <div className="relative flex items-center justify-center h-[170px] w-[170px] rounded-full bg-bg shadow-convex">
              </div> 
              <svg className="absolute -rotate-90 w-[220px] h-[220px]" viewBox='0 0 100 100'>
                  <circle cx='50' cy='50' r='45' fill='none' stroke="rgba(255, 205, 4, 0.8)" stroke-width='6' strokeLinecap="round" strokeDasharray={`${283 * (bar / 100)} 283`} className="transition-all duration-300 ease-out "  />
                </svg>
                <div 
                  className="absolute w-full h-full flex justify-center transition-all duration-300 ease-out pointer-events-none"
                  style={{ transform: `rotate(${bar * 3.6}deg)` }}
                >
                <div className=' justify-center h-[30px] w-[30px] rounded-full bg-bg shadow-convex-sm'> </div>
                </div>

              
            </div>
          </div>
        </div>
      </div>
  )
}