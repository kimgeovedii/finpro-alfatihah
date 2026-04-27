import { useCallback } from "react";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import { useSidebarStore } from "./useSidebarStore";

export const useDashboardNavbar = () => {
  const { user, logout } = useAuthService();
  const toggleMobileMenu = useSidebarStore((state) => state.toggleMobileMenu);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user,
    handleLogout,
    toggleMobileMenu,
  };
};
