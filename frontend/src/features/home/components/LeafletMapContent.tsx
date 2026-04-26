"use client";

import { BranchData } from "@/features/home/types/home.types";
import { useLeafletMap } from "../hooks/useLeafletMap";
import "leaflet/dist/leaflet.css";

interface LeafletMapContentProps {
    onSelectStore: (name: string, address: string, distance: string, maxDelivery: number) => void;
    branches: BranchData[];
    userCoords?: [number, number];
    searchCoords?: [number, number];
}

export const LeafletMapContent = (props: LeafletMapContentProps) => {
    const { mapContainerRef } = useLeafletMap(props);

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-[2.5rem] bg-slate-100" 
            style={{ isolation: 'isolate' }}
        />
    );
};
