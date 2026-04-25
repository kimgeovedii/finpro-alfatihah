"use client";

import { useState } from "react";
import { profileService } from "../service/profile.service";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const updateAvatar = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await profileService.updateAvatar(file);
      // Update local user state if needed, or rely on store
      // If data contains new avatar URL, update the store
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({ ...currentUser, avatar: (data as any).avatar });
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { username?: string }) => {
    setIsLoading(true);
    try {
      const res = await profileService.updateProfile(data);
      const currentUser = useAuthStore.getState().user;
      if (currentUser && data.username) {
        setUser({ ...currentUser, username: data.username });
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: any) => {
    setIsLoading(true);
    try {
      return await profileService.changePassword(data);
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = async (data: any) => {
    setIsLoading(true);
    try {
      return await profileService.changeEmail(data);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateAvatar,
    updateProfile,
    changePassword,
    changeEmail,
    isLoading,
  };
};
