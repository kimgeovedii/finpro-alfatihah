"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchStore } from "../service/search.service";
import { useSearchFilters } from "./useSearchFilters";

export const usePriceFilter = () => {
  const { minPrice, maxPrice } = useSearchStore();
  const { updateFilters } = useSearchFilters();

  const [localMin, setLocalMin] = useState<number | undefined>(minPrice);
  const [localMax, setLocalMax] = useState<number | undefined>(maxPrice);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
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
      updateFilters({
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
