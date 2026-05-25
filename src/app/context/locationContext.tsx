"use client";
import React, { createContext, useContext, useState, useEffect, use } from 'react';
import useLocation from '../hooks/useLocation';

const LocationContext = createContext<{ coordinates: { latitude: number; longitude: number } | null , loading: boolean  } >( { coordinates: null, loading: true });

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    useEffect(() => {

        if (location) {
            console.log("Location updated:", location);
        }
    }, [location]);

    return (
        <LocationContext.Provider value={{ coordinates: location.coordinates, loading: location.loading }}>
            {children}
        </LocationContext.Provider>
    );
}

export const useLocationContext = () => {
    return useContext(LocationContext);
}
