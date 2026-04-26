"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { BranchData } from "../types/home.types";

// --- Leaflet Configuration & Icons ---

// Fix Leaflet marker icon issue
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
}

const createStoreIcon = () => new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const createUserIcon = () => new L.DivIcon({
    className: "user-location-marker",
    html: `
        <div class="relative flex items-center justify-center w-10 h-10">
            <div class="absolute inset-0 bg-blue-500/30 rounded-full animate-ping-slow"></div>
            <div class="w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div>
        </div>
        <style>
            @keyframes ping-slow { 75%, 100% { transform: scale(2.5); opacity: 0; } }
            .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
            .leaflet-div-icon { background: transparent !important; border: none !important; }
        </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface UseLeafletMapProps {
    onSelectStore: (name: string, address: string, distance: string, maxDelivery: number, lat: number, lng: number, branchId: string) => void;
    branches: BranchData[];
    userCoords?: [number, number];
    searchCoords?: [number, number];
}

export const useLeafletMap = ({ 
    onSelectStore, 
    branches, 
    userCoords, 
    searchCoords 
}: UseLeafletMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.LayerGroup | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const defaultCenter: [number, number] = userCoords || [-0.789275, 113.921327];

    // 1. Initialize Map
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

        const map = L.map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: userCoords ? 13 : 5,
            zoomControl: false,
            scrollWheelZoom: true,
            dragging: true,
        });

        // Add Google Maps Tile Layer
        L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            maxZoom: 20,
            attribution: "&copy; Google Maps"
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
        
        layersRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        setTimeout(() => map.invalidateSize(), 300);
    }, [isMounted]);

    // 2. Handle Markers & View Updates
    useEffect(() => {
        const map = mapRef.current;
        const layers = layersRef.current;
        if (!map || !layers) return;

        layers.clearLayers();

        // Add User Location
        if (userCoords) {
            L.marker(userCoords, { icon: createUserIcon(), zIndexOffset: 1000 })
                .addTo(layers)
                .bindPopup("<div class='font-black text-blue-600 p-1'>📍 Lokasi Anda Sekarang</div>");
        }

        // Add Coverage Circle
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

        // Add Store Markers
        branches.forEach((branch) => {
            if (!branch.latitude || !branch.longitude) return;
            const latlng: [number, number] = [Number(branch.latitude), Number(branch.longitude)];

            const marker = L.marker(latlng, { icon: createStoreIcon() }).addTo(layers);
            
            marker.bindPopup(`
                <div class="min-w-[180px] font-sans">
                    <h4 class="m-0 mb-1 font-black text-primary text-sm">${branch.storeName}</h4>
                    <p class="m-0 mb-1 text-xs text-slate-600">${branch.address}</p>
                    <p class="m-0 mb-2 text-[11px] text-slate-400 font-bold">${branch.city}</p>
                </div>
            `);

            marker.on("click", () => {
                let distanceStr = "";
                if (userCoords) {
                    const userLatLng = L.latLng(userCoords);
                    const branchLatLng = L.latLng(latlng);
                    const distanceMeters = userLatLng.distanceTo(branchLatLng);
                    distanceStr = (distanceMeters / 1000).toFixed(1) + " km";
                }
                onSelectStore(branch.storeName, branch.address, distanceStr, branch.maxDeliveryDistance, latlng[0], latlng[1], branch.id);
            });
        });

        // Fly to Bounds
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

    return { mapContainerRef };
};
