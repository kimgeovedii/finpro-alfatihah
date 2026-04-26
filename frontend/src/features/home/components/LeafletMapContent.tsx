"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BranchData } from "@/features/home/types/home.types";

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
    className: "user-location-marker",
    html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;">
            <div style="position:absolute;width:100%;height:100%;background:rgba(59,130,246,0.3);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:14px;height:14px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);z-index:10;"></div>
        </div>
        <style>
            @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }
            .leaflet-div-icon { background: transparent !important; border: none !important; }
        </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface LeafletMapContentProps {
    onSelectStore: (name: string, address: string, distance: string) => void;
    branches: BranchData[];
    userCoords?: [number, number];
    searchCoords?: [number, number];
}

export const LeafletMapContent = ({ onSelectStore, branches, userCoords, searchCoords }: LeafletMapContentProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.LayerGroup | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Default center to Indonesia if no user coords
    const defaultCenter: [number, number] = userCoords || [-0.789275, 113.921327];

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
            center: defaultCenter,
            zoom: userCoords ? 13 : 5,
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

        // Initialize Layer Group for markers
        const layers = L.layerGroup().addTo(map);
        layersRef.current = layers;
        
        mapRef.current = map;

        // Invalidate size after a delay to ensure container is ready
        setTimeout(() => {
            map.invalidateSize();
        }, 300);

    }, [isMounted]);

    // Update markers and view when coords or branches change
    useEffect(() => {
        const map = mapRef.current;
        const layers = layersRef.current;
        if (!map || !layers) return;

        // Clear existing markers/circles in the layer group
        layers.clearLayers();

        // 1. User Location Marker - ALWAYS SHOW AT GPS POSITION
        if (userCoords) {
            L.marker(userCoords, { 
                icon: userIcon, 
                zIndexOffset: 1000,
                interactive: true 
            })
                .addTo(layers)
                .bindPopup("<div style='font-weight: 800; color: #2563eb; padding: 4px;'>📍 Lokasi Anda Sekarang</div>");
        }

        // 2. Search / User Area Circle
        const centerCoords = searchCoords || userCoords;
        if (centerCoords) {
            L.circle(centerCoords, {
                radius: 5000,
                color: "#00685d",
                fillColor: "#00685d",
                fillOpacity: 0.08,
                weight: 2,
                dashArray: "8 4",
            }).addTo(layers);
        }

        // Store Markers
        branches.forEach((branch) => {
            if (!branch.latitude || !branch.longitude) return;
            const latlng: [number, number] = [
                Number(branch.latitude), 
                Number(branch.longitude)
            ];

            const marker = L.marker(latlng, { icon: storeIcon }).addTo(layers);
            
            marker.bindPopup(`
                <div style="font-family:Satoshi,sans-serif;min-width:180px;">
                    <h4 style="margin:0 0 4px;font-weight:800;color:#00685d;font-size:14px;">${branch.storeName}</h4>
                    <p style="margin:0 0 4px;font-size:12px;color:#475569;">${branch.address}</p>
                    <p style="margin:0 0 8px;font-size:11px;color:#64748b;">${branch.city}</p>
                </div>
            `);

            marker.on("click", () => {
                onSelectStore(branch.storeName, branch.address, "");
            });
        });

        // Smooth fly to new location
        if (centerCoords) {
            const bounds = L.latLng(centerCoords).toBounds(5000);
            map.flyToBounds(bounds, { padding: [40, 40], duration: 1.5 });
        } else if (branches.length > 0) {
            const allCoords = branches
                .filter(b => b.latitude && b.longitude)
                .map(b => [Number(b.latitude), Number(b.longitude)] as [number, number]);
            
            if (allCoords.length > 0) {
                const bounds = L.latLngBounds(allCoords);
                map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
            }
        }

    }, [branches, userCoords, searchCoords, onSelectStore]);

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-[2.5rem]" 
            style={{ isolation: 'isolate', background: '#f1f5f9' }}
        />
    );
};
