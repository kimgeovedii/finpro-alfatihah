"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { Region } from "@/services/region.service";
import toast from "react-hot-toast";

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
  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 flex-1">
      <select 
        className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] md:border-r border-slate-200"
        value={selectedProvince?.code || ""}
        onChange={(e) => {
          const p = provinces.find((x) => x.code === e.target.value);
          setSelectedProvince(p ? {code: p.code, name: p.name} : null);
        }}
      >
        <option value="">Pilih Provinsi</option>
        {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
      </select>

      <select 
        className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] md:border-r border-slate-200 disabled:opacity-50"
        value={selectedCity?.code || ""}
        disabled={!selectedProvince}
        onChange={(e) => {
          const c = regencies.find((x) => x.code === e.target.value);
          setSelectedCity(c ? {code: c.code, name: c.name} : null);
        }}
      >
        <option value="">Pilih Kota</option>
        {regencies.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>

      <select 
        className="bg-slate-50 md:bg-transparent text-xs font-bold text-slate-700 outline-none p-2 md:p-1 rounded-xl md:rounded-none min-w-[120px] disabled:opacity-50"
        value={selectedDistrict?.code || ""}
        disabled={!selectedCity}
        onChange={(e) => {
          const d = districts.find((x) => x.code === e.target.value);
          setSelectedDistrict(d ? {code: d.code, name: d.name} : null);
        }}
      >
        <option value="">Pilih Kecamatan</option>
        {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
      </select>
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
            toast.success("Kembali ke lokasi Anda");
          }}
          className="hidden md:flex bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all active:scale-95 items-center justify-center"
          title="Kembali ke lokasi saya"
        >
          <MapPinIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);
