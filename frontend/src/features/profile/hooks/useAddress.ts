"use client";

import { useState, useEffect } from "react";
import { addressService } from "../service/address.service";

export const useAddress = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAddress = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await addressService.createAddress(data);
      await fetchAddresses();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const res = await addressService.updateAddress(id, data);
      await fetchAddresses();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await addressService.deleteAddress(id);
      await fetchAddresses();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const setPrimaryAddress = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await addressService.setPrimaryAddress(id);
      await fetchAddresses();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    isLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  };
};
