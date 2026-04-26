"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface AddressMapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
  addressLabel?: string;
}

const AddressMap = ({ position, onPositionChange, addressLabel }: AddressMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: position,
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
    const marker = L.marker(position).addTo(map);
    markerRef.current = marker;

    // Handle Map Clicks
    map.on("click", (e) => {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
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
      markerRef.current.setLatLng(position);

      // Only re-center map if distance is significant (to allow dragging)
      if (Math.abs(currentCenter.lat - position[0]) > 0.0001 || Math.abs(currentCenter.lng - position[1]) > 0.0001) {
        mapRef.current.setView(position, mapRef.current.getZoom());
      }

      // Update Popup
      if (addressLabel) {
        markerRef.current.bindPopup(`
          <div style="padding: 4px;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #0d9488; text-transform: uppercase; letter-spacing: 0.1em;">Lokasi Terpilih</p>
            <p style="margin: 4px 0 0; font-size: 12px; font-weight: 700; color: #334155; line-height: 1.2;">${addressLabel}</p>
          </div>
        `, { closeButton: false }).openPopup();
      } else {
        markerRef.current.closePopup();
      }
    }
  }, [position, addressLabel]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-[40px] shadow-inner border-2 border-slate-50"
      style={{ minHeight: "400px", background: "#f8fafc" }}
    />
  );
};

export default AddressMap;
