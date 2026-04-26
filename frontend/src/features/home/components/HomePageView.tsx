"use client";

import { Suspense, useEffect, useState } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { NearestStoreMap } from "./NearestStoreMap";
import { LocationPrompt } from "./LocationPrompt";
import { ProductList } from "./ProductList";
import { ExclusiveVoucher } from "./ExclusiveVoucher";
import { NotificationHandler } from "@/components/common/NotificationHandler";
import { useNearestStore } from "../hooks/useNearestStore";
import { apiFetch } from "@/utils/api";
import { BranchData } from "@/features/home/types/home.types";

export const HomePageView = () => {
  const { products, nearestBranch, userCoords, isLoading } = useNearestStore();
  const [allBranches, setAllBranches] = useState<BranchData[]>([]);

  useEffect(() => {
    // Fetch all active branches for the map
    apiFetch<BranchData[]>("/branches").then((data) => {
      setAllBranches(data);
    }).catch(console.error);
  }, []);

  return (
    <>
      <Suspense>
        <NotificationHandler />
      </Suspense>
      <HeroCarousel />
      <LocationPrompt />
      <NearestStoreMap 
        branches={allBranches} 
        userCoords={userCoords} 
        nearestBranch={nearestBranch} 
      />
      <ProductList products={products} isLoading={isLoading} />
      <ExclusiveVoucher />
    </>
  );
};
