"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const NotificationHandler = () => {
  const searchParams = useSearchParams();
  const unverified = searchParams.get("unverified");
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (unverified === "true") {
      toast.error("Silakan verifikasi email Anda terlebih dahulu untuk mengakses halaman tersebut.", {
        duration: 5000,
      });
    }

    if (redirect && !unverified) {
      toast.info("Silakan masuk terlebih dahulu untuk melanjutkan.", {
        duration: 4000,
      });
    }
  }, [unverified, redirect]);

  return null;
};
