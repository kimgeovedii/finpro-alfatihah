"use client";

import { Suspense, useEffect, useState } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { NearestStoreMap } from "./NearestStoreMap";
import { LocationPrompt } from "./LocationPrompt";
import { ProductList } from "./ProductList";
import { ExclusiveVoucher } from "./ExclusiveVoucher";
import { NotificationHandler } from "@/components/common/NotificationHandler";
import { useHomeStore } from "@/features/home/service/home.service";

export const HomePageView = () => {
  const { products, nearestBranch, userCoords, isLoading, requestLocation, allBranches, fetchAllBranches, fetchNearestBranch } = useHomeStore();

  useEffect(() => {
    fetchAllBranches(1);
    fetchNearestBranch(); // Fetch default products immediately
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
        onRequestLocation={requestLocation}
      />
      <ExclusiveVoucher />
      <ProductList products={products} isLoading={isLoading} />
    </>
  );
  
};
