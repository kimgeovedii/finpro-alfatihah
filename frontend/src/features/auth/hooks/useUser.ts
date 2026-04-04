import { useEffect } from "react";
import { useAuthService } from "../service/auth.service";

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
