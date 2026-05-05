import { useHomeStore } from "@/features/home/service/home.service";

export const useStoreSelection = (storeNameProp?: string) => {
  const { nearestBranch } = useHomeStore();
  const storeName = (storeNameProp && storeNameProp !== "undefined") 
    ? storeNameProp 
    : nearestBranch?.storeName || "";

  return { storeName };
};
