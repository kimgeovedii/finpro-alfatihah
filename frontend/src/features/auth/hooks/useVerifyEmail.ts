"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthService } from "../hooks/useAuthService";

export const useVerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { verifyEmailToken, resendVerification } = useAuthService();
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend-ui">("loading");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Timer cooldown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Initial verification or resend UI logic
  useEffect(() => {
    if (token) {
      verifyEmailToken(token)
        .then((res: any) => {
          setStatus("success");
          setMessage(res.message || "Email verified successfully!");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err.message || "Invalid or expired token.");
        });
    } else if (email) {
      setStatus("resend-ui");
      setMessage("Silakan periksa kotak masuk email Anda.");
    } else {
      setStatus("error");
      setMessage("Tautan tidak valid. Token atau email tidak ditemukan.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, router]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setIsResending(true);
    try {
      await resendVerification(email);
      setMessage("Tautan verifikasi baru telah dikirimkan!");
      setCooldown(60); 
    } catch (err: any) {
      setMessage(err.message || "Gagal mengirim ulang email. Silakan coba lagi nanti.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    status,
    message,
    cooldown,
    isResending,
    handleResend,
    router,
  };
};
