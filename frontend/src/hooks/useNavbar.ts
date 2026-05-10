import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useHomeStore } from "@/features/home/service/home.service";
import { useCartService } from "@/features/cart/services/cart.service";
import toast from "react-hot-toast";

export const useNavbar = () => {
  const router = useRouter();
  const { user, fetchUser, isVerified, isAuthenticated, logout } = useAuthService();
  const { handleSearch: executeSearch, isSearching } = useProductSearch();
  const { summary, fetchCartSummary } = useCartService();
  const locationName = useHomeStore((state) => state.locationName);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (!fetchRef.current) {
      fetchRef.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated() && isVerified()) {
      fetchCartSummary();
    }
  }, [isAuthenticated, isVerified, fetchCartSummary]);

  const onSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  }, [searchTerm, router]);

  const handleProtectedAction = useCallback((action: string) => {
    if (!isAuthenticated()) {
      toast.error("Silakan login atau daftar terlebih dahulu untuk " + action, {
        duration: 4000,
        icon: "🔒",
      });
      return false;
    }
    if (!isVerified()) {
      toast.error("Silakan verifikasi email Anda terlebih dahulu untuk " + action, {
        duration: 4000,
        icon: "📧",
      });
      return false;
    }
    return true;
  }, [isAuthenticated, isVerified]);

  const handleCartClick = useCallback(() => {
    if (!handleProtectedAction("mengakses keranjang")) return;
    router.push('/cart')
  }, [handleProtectedAction]);

  const handleLogout = useCallback(async () => {
    await logout();
    toast.success("Berhasil logout");
    window.location.href = "/";
  }, [logout]);

  return {
    user,
    cartItems: summary?.totalItems || 0,
    searchTerm,
    setSearchTerm,
    onSearchSubmit,
    handleCartClick,
    handleLogout,
    isSearching,
    mounted,
    isAuthenticated,
    isVerified,
    locationName
  };
};
