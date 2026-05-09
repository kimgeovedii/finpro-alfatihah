"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BranchMiniMapProps {
  lat: number;
  lng: number;
  storeName: string;
}

export const BranchMiniMap = ({ lat, lng, storeName }: BranchMiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || leafletMapRef.current) return;

    // Fix marker icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
    });

    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxZoom: 20,
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<span class="font-bold text-xs">${storeName}</span>`);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [lat, lng, storeName]);

  return (
    <div className="relative group/map">
      <div 
        ref={mapRef} 
        className="w-full h-40 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner z-0 overflow-hidden" 
      />
      <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl border-2 border-primary/0 group-hover/map:border-primary/20 transition-all" />
      
      {/* Map Link Overlay */}
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-primary shadow-sm border border-primary/10 hover:bg-primary hover:text-white transition-all pointer-events-auto"
      >
        OPEN IN GOOGLE MAPS
      </a>
    </div>
  );
};
