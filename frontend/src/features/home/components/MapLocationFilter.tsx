"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { Region } from "@/services/region.service";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapLocationFilterProps {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  selectedProvince: { code: string; name: string } | null;
  selectedCity: { code: string; name: string } | null;
  selectedDistrict: { code: string; name: string } | null;
  setSelectedProvince: (p: { code: string; name: string } | null) => void;
  setSelectedCity: (c: { code: string; name: string } | null) => void;
  setSelectedDistrict: (d: { code: string; name: string } | null) => void;
  handleLocationSearch: () => Promise<void>;
  isSearchingLocation: boolean;
  searchCoords: { lat: number; lng: number } | null;
  userCoords: { lat: number; lng: number } | null;
  setSearchCoords: (coords: { lat: number; lng: number } | null) => void;
  fetchNearestBranch: (lat: number, lng: number, page?: number) => Promise<void>;
}

export const MapLocationFilter = ({ 
  provinces, regencies, districts,
  selectedProvince, selectedCity, selectedDistrict,
  setSelectedProvince, setSelectedCity, setSelectedDistrict,
  handleLocationSearch, isSearchingLocation,
  searchCoords, userCoords, setSearchCoords, fetchNearestBranch
}: MapLocationFilterProps) => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2">
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 flex-1">
      <Select
        value={selectedProvince?.code || ""}
        onValueChange={(value) => {
          const p = provinces.find((x) => x.code === value);
          setSelectedProvince(p ? { code: p.code, name: p.name } : null);
        }}
      >
        <SelectTrigger className="bg-transparent border-none shadow-none text-xs font-bold text-slate-700 h-9 min-w-[130px] md:border-r md:border-slate-200 md:rounded-none focus:ring-0">
          <SelectValue placeholder="Province" />
        </SelectTrigger>
        <SelectContent className="z-[2000]">
          {provinces.map((p) => (
            <SelectItem key={p.code} value={p.code} className="text-xs font-medium">
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCity?.code || ""}
        onValueChange={(value) => {
          const c = regencies.find((x) => x.code === value);
          setSelectedCity(c ? { code: c.code, name: c.name } : null);
        }}
        disabled={!selectedProvince}
      >
        <SelectTrigger className="bg-transparent border-none shadow-none text-xs font-bold text-slate-700 h-9 min-w-[130px] md:border-r md:border-slate-200 md:rounded-none focus:ring-0 disabled:opacity-40">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent className="z-[2000]">
          {regencies.map((c) => (
            <SelectItem key={c.code} value={c.code} className="text-xs font-medium">
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDistrict?.code || ""}
        onValueChange={(value) => {
          const d = districts.find((x) => x.code === value);
          setSelectedDistrict(d ? { code: d.code, name: d.name } : null);
        }}
        disabled={!selectedCity}
      >
        <SelectTrigger className="bg-transparent border-none shadow-none text-xs font-bold text-slate-700 h-9 min-w-[130px] focus:ring-0 disabled:opacity-40">
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent className="z-[2000]">
          {districts.map((d) => (
            <SelectItem key={d.code} value={d.code} className="text-xs font-medium">
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex items-center gap-2">
      <button 
        onClick={handleLocationSearch}
        disabled={isSearchingLocation || !selectedProvince}
        className="flex-1 md:flex-none bg-primary text-white text-[10px] uppercase tracking-widest px-6 py-3 md:py-2 rounded-xl font-black hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {isSearchingLocation ? "Searching..." : "Search"}
      </button>

      {searchCoords && (
        <button 
          onClick={() => {
            setSearchCoords(null);
            setSelectedProvince(null);
            setSelectedCity(null);
            setSelectedDistrict(null);
            if (userCoords) fetchNearestBranch(userCoords.lat, userCoords.lng);
            toast.success("Back to your location");
          }}
          className="hidden md:flex bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all active:scale-95 items-center justify-center"
          title="Back to my location"
        >
          <MapPinIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);
