"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  CameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

const TABS = [
  { id: "personal", label: "Personal Info", icon: UserIcon },
  { id: "security", label: "Security", icon: LockClosedIcon },
  { id: "email", label: "Email Settings", icon: EnvelopeIcon },
];

export const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { user } = useAuthService();
  const { updateAvatar, updateProfile, changePassword, changeEmail, isLoading } = useProfile();
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar / Navigation */}
        <div className="w-full md:w-80 flex flex-col gap-8">
          {/* Profile Card Summary */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-100 border border-slate-50 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="h-32 w-32 rounded-[40px] overflow-hidden ring-4 ring-slate-50 transition-all duration-300 group-hover:ring-teal-100 shadow-lg">
                <img 
                  src={user?.avatar ? (user.avatar.startsWith("http") ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${user.avatar.startsWith("/") ? user.avatar.slice(1) : user.avatar}`) : "https://ui-avatars.com/api/?name=" + (user?.username || "User")} 
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
            
            <h2 className="mt-6 text-2xl font-bold text-slate-800">{user?.username || "Username"}</h2>
            <p className="text-slate-400 font-medium text-sm mt-1">{user?.email}</p>
            
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.emailVerifiedAt ? (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Verified Account</span>
                </>
              ) : (
                <>
                  <ExclamationCircleIcon className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-600">Pending Verification</span>
                </>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isActive 
                      ? "bg-teal-900 text-white shadow-lg shadow-teal-900/20" 
                      : "bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="tab-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 h-full"
            >
              {activeTab === "personal" && <PersonalTab user={user} updateProfile={updateProfile} isLoading={isLoading} />}
              {activeTab === "security" && <SecurityTab changePassword={changePassword} isLoading={isLoading} />}
              {activeTab === "email" && <EmailTab user={user} changeEmail={changeEmail} isLoading={isLoading} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Tabs ---

const PersonalTab = ({ user, updateProfile, isLoading }: any) => {
  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, "Username minimal 3 karakter").required("Wajib diisi"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfile(values);
        toast.success("Profil berhasil diperbarui!");
      } catch (err: any) {
        toast.error(err.message || "Gagal memperbarui profil");
      }
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-bold text-slate-800">Informasi Personal</h3>
        <p className="text-slate-400 mt-2 font-medium">Perbarui detail profil publik Anda di sini.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Username</Label>
            <div className="relative">
              <Input 
                {...formik.getFieldProps("username")}
                className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700"
              />
              <PencilSquareIcon className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.username as string}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || !formik.dirty}
          className="h-14 px-10 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 transition-all duration-300"
        >
          {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
};

const SecurityTab = ({ changePassword, isLoading }: any) => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Password lama wajib diisi"),
      newPassword: Yup.string().min(6, "Password baru minimal 6 karakter").required("Password baru wajib diisi"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Konfirmasi password tidak cocok").required("Wajib diisi"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword(values);
        toast.success("Password berhasil diubah!");
        resetForm();
      } catch (err: any) {
        toast.error(err.message || "Gagal mengubah password");
      }
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-bold text-slate-800">Keamanan</h3>
        <p className="text-slate-400 mt-2 font-medium">Kelola password Anda untuk mengamankan akun.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-6 max-w-md">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Password Lama</Label>
            <Input 
              type="password"
              {...formik.getFieldProps("oldPassword")}
              className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20"
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <p className="text-red-500 text-xs font-bold">{formik.errors.oldPassword as string}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Password Baru</Label>
            <Input 
              type="password"
              {...formik.getFieldProps("newPassword")}
              className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-xs font-bold">{formik.errors.newPassword as string}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Konfirmasi Password Baru</Label>
            <Input 
              type="password"
              {...formik.getFieldProps("confirmPassword")}
              className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs font-bold">{formik.errors.confirmPassword as string}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-14 px-10 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-100 transition-all mt-4"
        >
          {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : "Perbarui Password"}
        </Button>
      </form>
    </div>
  );
};

const EmailTab = ({ user, changeEmail, isLoading }: any) => {
  const formik = useFormik({
    initialValues: {
      oldEmail: user?.email || "",
      newEmail: "",
      password: "",
    },
    validationSchema: Yup.object({
      oldEmail: Yup.string().email("Format email tidak valid").required("Wajib diisi"),
      newEmail: Yup.string().email("Format email baru tidak valid").required("Email baru wajib diisi"),
      password: Yup.string().required("Konfirmasi password wajib diisi"),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changeEmail(values);
        toast.success("Permintaan perubahan email berhasil! Silakan verifikasi email baru Anda.");
        resetForm();
      } catch (err: any) {
        toast.error(err.message || "Gagal mengubah email");
      }
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-3xl font-bold text-slate-800">Pengaturan Email</h3>
        <p className="text-slate-400 mt-2 font-medium">Ubah alamat email utama Anda. Anda perlu memverifikasi email baru.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-6 max-w-md">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Email Saat Ini</Label>
            <Input 
              disabled
              {...formik.getFieldProps("oldEmail")}
              className="h-14 bg-slate-100 border-none rounded-2xl px-6 text-slate-500 font-bold"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Email Baru</Label>
            <Input 
              type="email"
              placeholder="Masukkan email baru"
              {...formik.getFieldProps("newEmail")}
              className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700"
            />
            {formik.touched.newEmail && formik.errors.newEmail && (
              <p className="text-red-500 text-xs font-bold">{formik.errors.newEmail as string}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-500 ml-1">Konfirmasi Password</Label>
            <Input 
              type="password"
              placeholder="Masukkan password untuk verifikasi"
              {...formik.getFieldProps("password")}
              className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs font-bold">{formik.errors.password as string}</p>
            )}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-4 items-start max-w-md">
           <ExclamationCircleIcon className="h-6 w-6 text-amber-500 shrink-0" />
           <p className="text-xs text-amber-800 font-medium leading-relaxed">
             Setelah mengubah email, Anda akan diminta untuk memverifikasi alamat email baru tersebut sebelum dapat login kembali.
           </p>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-14 px-10 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 transition-all"
        >
          {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : "Ubah Alamat Email"}
        </Button>
      </form>
    </div>
  );
};
