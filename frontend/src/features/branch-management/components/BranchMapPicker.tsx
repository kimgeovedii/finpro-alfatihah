"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { regionService } from "@/services/region.service";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface BranchMapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  storeName?: string;
}

export const BranchMapPicker = ({ lat, lng, onChange, onAddressChange, storeName }: BranchMapPickerProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
      });
      if (res.data && res.data.display_name && onAddressChange) {
        onAddressChange(res.data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await regionService.searchAddress(query);
      setSuggestions(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (s: any) => {
    const newLat = parseFloat(s.lat);
    const newLng = parseFloat(s.lon);
    onChange(newLat, newLng);
    if (onAddressChange) onAddressChange(s.display_name);
    
    setSuggestions([]);
    setSearchQuery(s.display_name);
    
    if (mapRef.current) {
      mapRef.current.setView([newLat, newLng], 16);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
      dragging: true,
    });

    // Add Tile Layer (Google Maps)
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: "&copy; Google Maps"
    }).addTo(map);

    // Add Zoom Control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add Marker
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Handle Marker Drag
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChange(pos.lat, pos.lng);
      reverseGeocode(pos.lat, pos.lng);
    });

    // Handle Map Clicks
    map.on("click", (e) => {
      onChange(e.latlng.lat, e.latlng.lng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted]);

  // Sync Position and Marker
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentCenter = mapRef.current.getCenter();
      
      // Update marker position
      markerRef.current.setLatLng([lat, lng]);

      // Only re-center map if distance is significant (to allow dragging)
      if (Math.abs(currentCenter.lat - lat) > 0.0001 || Math.abs(currentCenter.lng - lng) > 0.0001) {
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }

      // Update Popup
      if (storeName) {
        markerRef.current.bindPopup(`
          <div style="padding: 4px;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 0.1em;">Store Location</p>
            <p style="margin: 4px 0 0; font-size: 12px; font-weight: 700; color: #334155; line-height: 1.2;">${storeName || "Branch Location"}</p>
          </div>
        `, { closeButton: false }).openPopup();
      } else {
        markerRef.current.closePopup();
      }
    }
  }, [lat, lng, storeName]);

  return (
    <div className="relative group mt-2">
      {/* Search Bar on top of map */}
      <div className="absolute top-4 left-4 right-4 z-[1001] space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search address or location..."
            className="h-12 w-full pl-12 pr-10 bg-white/90 backdrop-blur-md border-none rounded-2xl shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          />
          {isSearching && (
            <div className="absolute right-4 top-3">
              <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-48 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-none"
              >
                <div className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600 line-clamp-2">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        ref={mapContainerRef} 
        className="w-full h-80 rounded-3xl shadow-inner border-2 border-slate-50 overflow-hidden"
        style={{ background: "#f8fafc" }}
      />
    </div>
  );
};
