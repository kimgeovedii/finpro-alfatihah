"use client";

import { useState, useEffect, useCallback } from "react";
import { BranchData } from "../types/home.types";
import { Region, regionService } from "@/services/region.service";
import { useHomeStore } from "../service/home.service";
import toast from "react-hot-toast";

export interface StoreDetail {
  name: string;
  address: string;
  distance: string;
  maxDelivery: number;
  lat: number;
  lng: number;
}

export const useNearestStoreMap = (isExpanded: boolean, userCoords: { lat: number; lng: number } | null) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);
  const { 
    searchCoords, 
    setSearchCoords, 
    fetchNearestBranch, 
    setLocationStatus, 
    allBranchesMeta, 
    fetchAllBranches 
  } = useHomeStore();

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<{code: string, name: string} | null>(null);
  const [selectedCity, setSelectedCity] = useState<{code: string, name: string} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{code: string, name: string} | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      regionService.getProvinces().then(setProvinces).catch(console.error);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (selectedProvince) {
      regionService.getRegencies(selectedProvince.code).then(setRegencies).catch(console.error);
      setSelectedCity(null);
      setSelectedDistrict(null);
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      regionService.getDistricts(selectedCity.code).then(setDistricts).catch(console.error);
      setSelectedDistrict(null);
    }
  }, [selectedCity]);

  const handleLocationSearch = async () => {
    if (!selectedProvince) {
      toast.error("Pilih setidaknya provinsi");
      return;
    }

    setIsSearchingLocation(true);
    try {
      const query = [
        selectedDistrict?.name,
        selectedCity?.name,
        selectedProvince.name,
        "Indonesia"
      ].filter(Boolean).join(", ");

      const results = await regionService.searchAddress(query);
      if (results && results.length > 0) {
        const bestResult = results[0];
        const newCoords = {
          lat: parseFloat(bestResult.lat),
          lng: parseFloat(bestResult.lon)
        };
        
        setSearchCoords(newCoords);
        setLocationStatus("granted");
        fetchNearestBranch(newCoords.lat, newCoords.lng);
        toast.success(`Berhasil menemukan lokasi: ${selectedDistrict?.name || selectedCity?.name || selectedProvince.name}`);
      } else {
        toast.error("Lokasi tidak ditemukan pada peta");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Gagal mencari lokasi");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleLoadMoreBranches = () => {
    if (allBranchesMeta && allBranchesMeta.page < allBranchesMeta.totalPages) {
      fetchAllBranches(allBranchesMeta.page + 1);
    }
  };

  const handleShowStore = useCallback((name: string, address: string, distance: string, maxDelivery: number, lat: number, lng: number) => {
    setSelectedStore({ name, address, distance, maxDelivery, lat, lng });
  }, []);

  return {
    isFilterOpen,
    setIsFilterOpen,
    selectedStore,
    setSelectedStore,
    searchCoords,
    setSearchCoords,
    fetchNearestBranch,
    setLocationStatus,
    allBranchesMeta,
    provinces,
    regencies,
    districts,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    setSelectedProvince,
    setSelectedCity,
    setSelectedDistrict,
    isSearchingLocation,
    handleLocationSearch,
    handleLoadMoreBranches,
    handleShowStore,
  };
};
