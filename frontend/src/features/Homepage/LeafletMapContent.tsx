"use client";

import { useEffect, useId } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, Point } from "geojson";
import { storeGeoJSON, USER_LOCATION, type StoreProperties } from "../../data/storeData";
import "leaflet/dist/leaflet.css";

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

function FitBounds() {
    const map = useMap();
    useEffect(() => {
        const allCoords = storeGeoJSON.features.map((f) => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0],
        ] as [number, number]);
        allCoords.push(USER_LOCATION);
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map]);
    return null;
}

export const LeafletMapContent = ({ onSelectStore }: LeafletMapContentProps) => {
    const mapId = useId();
    
    useEffect(() => {
        return () => {
            const container = document.getElementById(mapId);
            if (container && (container as any)._leaflet_id) {
                (container as any)._leaflet_id = null;
            }
        };
    }, [mapId]);

    const onEachFeature = (feature: Feature<Point, StoreProperties>, layer: L.Layer) => {
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
    };

    const pointToLayer = (_feature: Feature<Point, StoreProperties>, latlng: L.LatLng) => {
        return L.marker(latlng, { icon: storeIcon });
    };

    return (
        <MapContainer
            key={mapId}
            id={mapId}
            center={USER_LOCATION}
            zoom={13}
            className="w-full h-full rounded-[2.5rem]"
            style={{ zIndex: 0 }}
            zoomControl={false}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.google.com/help/terms_maps/">Google Maps</a>'
                url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                maxZoom={20}
            />

            <Marker position={USER_LOCATION} icon={userIcon}>
                <Popup>
                    <span style={{ fontWeight: 700, color: "#2563eb" }}>📍 Your Location</span>
                </Popup>
            </Marker>

            <Circle
                center={USER_LOCATION}
                radius={5000}
                pathOptions={{
                    color: "#00685d",
                    fillColor: "#00685d",
                    fillOpacity: 0.05,
                    weight: 2,
                    dashArray: "8 4",
                }}
            />

            <GeoJSON
                data={storeGeoJSON}
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
            />

            <FitBounds />
        </MapContainer>
    );
};
