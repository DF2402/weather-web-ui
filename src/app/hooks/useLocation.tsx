"use client";
import { useState, useEffect } from "react";

export default function useLocation() {
    let [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    let [loading, setLoading] = useState(true);
    useEffect(() => { 
        if (!("geolocation" in navigator)) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

    const handleSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        setLoading(false);
    }

    const handleError = (error: GeolocationPositionError) => {
        console.error("Error getting location:", error);
        setLoading(false);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, []);

    return { coordinates, loading };
}