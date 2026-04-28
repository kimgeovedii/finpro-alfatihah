"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchStore } from "../service/search.service";

export const usePriceFilter = () => {
  const { minPrice, maxPrice, setFilters } = useSearchStore();
  
  // Local state for immediate UI feedback
  const [localMin, setLocalMin] = useState<number | undefined>(minPrice);
  const [localMax, setLocalMax] = useState<number | undefined>(maxPrice);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when store changes (e.g. on Reset)
  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value ? Number(value) : undefined;
    
    if (type === "min") setLocalMin(numValue);
    else setLocalMax(numValue);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setFilters({
        [type === "min" ? "minPrice" : "maxPrice"]: numValue,
      });
    }, 500);
  };

  return {
    localMin,
    localMax,
    handlePriceChange,
  };
};
