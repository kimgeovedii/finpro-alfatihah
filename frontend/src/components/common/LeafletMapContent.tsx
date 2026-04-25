"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { storeGeoJSON, USER_LOCATION } from "../../data/storeData";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const storeIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const userIcon = new L.DivIcon({
    className: "",
    html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;background:rgba(59,130,246,0.2);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:14px;height:14px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
        <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface LeafletMapContentProps {
    onSelectStore: (name: string, address: string, distance: string) => void;
}

export const LeafletMapContent = ({ onSelectStore }: LeafletMapContentProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;

        // Initialize Map
        const map = L.map(mapContainerRef.current, {
            center: USER_LOCATION,
            zoom: 13,
            zoomControl: false,
            scrollWheelZoom: true,
            dragging: true,
        });


        // Add Tile Layer
        L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            maxZoom: 20,
            attribution: "&copy; Google Maps"
        }).addTo(map);

        // Zoom Control
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // User Location Marker
        L.marker(USER_LOCATION, { icon: userIcon })
            .addTo(map)
            .bindPopup("<span style='font-weight: 700; color: #2563eb'>📍 Lokasi Anda</span>");

        // Store Radius Circle
        L.circle(USER_LOCATION, {
            radius: 5000,
            color: "#00685d",
            fillColor: "#00685d",
            fillOpacity: 0.05,
            weight: 2,
            dashArray: "8 4",
        }).addTo(map);

        // Store GeoJSON Layer
        const geoJsonLayer = L.geoJSON(storeGeoJSON as any, {
            pointToLayer: (feature, latlng) => L.marker(latlng, { icon: storeIcon }),
            onEachFeature: (feature, layer) => {
                const { name, address, distance, hours } = feature.properties;
                layer.bindPopup(`
                    <div style="font-family:Satoshi,sans-serif;min-width:180px;">
                        <h4 style="margin:0 0 4px;font-weight:800;color:#00685d;font-size:14px;">${name}</h4>
                        <p style="margin:0 0 4px;font-size:12px;color:#475569;">${address}</p>
                        <p style="margin:0 0 8px;font-size:11px;color:#64748b;">🕐 ${hours}</p>
                        <div style="display:flex;align-items:center;gap:4px;background:rgba(0,104,93,0.1);border-radius:999px;padding:3px 8px;width:fit-content;">
                            <span style="font-size:11px;font-weight:700;color:#00685d;">${distance}</span>
                        </div>
                    </div>
                `);
                layer.on("click", () => {
                    onSelectStore(name, address, distance);
                });
            }
        }).addTo(map);

        // Fit Bounds
        const allCoords = storeGeoJSON.features.map((f) => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0],
        ] as [number, number]);
        allCoords.push(USER_LOCATION);
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [50, 50] });

        mapRef.current = map;

        // Invalidate size after a delay to ensure container is ready
        setTimeout(() => {
            map.invalidateSize();
        }, 300);

    }, [isMounted]);

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-[2.5rem]" 
            style={{ isolation: 'isolate', background: '#f1f5f9' }}
        />
    );
};
