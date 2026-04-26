import { useEffect, useCallback } from "react";
import { useHomeStore } from "@/features/home/service/home.service";
import { locationSchema } from "@/features/home/validations/home.schema";

export const useNearestStore = () => {
  const {
    userCoords,
    locationStatus,
    nearestBranch,
    distance,
    isInRange,
    products,
    productsMeta,
    isLoading,
    error,
    setLocationStatus,
    setUserCoords,
    fetchNearestBranch,
  } = useHomeStore();

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setLocationStatus("denied");
      fetchNearestBranch();
      return;
    }

    // Check permission status if possible
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'denied') {
          console.warn("Geolocation permission is already denied in browser settings.");
          setLocationStatus("denied");
          fetchNearestBranch();
          return;
        }
      } catch (e) {
        console.error("Error checking permissions:", e);
      }
    }

    console.log("Requesting location...");
    setLocationStatus("requesting");
    
    console.log("Calling navigator.geolocation.getCurrentPosition...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Position received:", position.coords.latitude, position.coords.longitude);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        try {
          await locationSchema.validate(coords);
          setUserCoords(coords);
          setLocationStatus("granted");
          fetchNearestBranch(coords.lat, coords.lng);
        } catch (err) {
          console.error("Coords validation failed:", err);
          setLocationStatus("denied");
          fetchNearestBranch();
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message, `(Code: ${error.code})`);
        setLocationStatus("denied");
        fetchNearestBranch(); 
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchNearestBranch, setLocationStatus, setUserCoords]);

  // Initial auto-request location
  useEffect(() => {
    // Only auto-request on mount if status is idle
    if (locationStatus === "idle") {
      requestLocation();
    }
  }, [locationStatus, requestLocation]);

  return {
    userCoords,
    locationStatus,
    nearestBranch,
    distance,
    isInRange,
    products,
    productsMeta,
    isLoading,
    error,
    requestLocation,
    fetchNearestBranch,
  };
};
