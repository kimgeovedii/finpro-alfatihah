"use client";

import React, { useRef } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface AvatarUploadProps {
  user: any;
  updateAvatar: (file: File) => Promise<any>;
}

export const AvatarUpload = ({ user, updateAvatar }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateAvatar(file);
        toast.success("Foto profil berhasil diperbarui!");
      } catch (err: any) {
        toast.error(err.message || "Gagal mengunggah foto");
      }
    }
  };

  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith("http") 
        ? user.avatar 
        : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`) 
    : "https://ui-avatars.com/api/?name=" + (user?.username || "User");

  return (
    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
      <div className="h-32 w-32 rounded-[40px] overflow-hidden ring-4 ring-slate-50 transition-all duration-300 group-hover:ring-teal-100 shadow-lg">
        <img 
          src={avatarUrl} 
          alt={user?.username} 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <CameraIcon className="h-5 w-5" />
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </div>
  );
};
