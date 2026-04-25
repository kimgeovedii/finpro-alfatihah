import { useEffect } from "react";
import { useAuthService } from "../hooks/useAuthService";

export const useUser = () => {
  const { user, fetchUser, isLoading, error } = useAuthService();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser();
    }
  }, [user, fetchUser, isLoading]);

  return {
    user,
    isLoading,
    error,
  };
};
