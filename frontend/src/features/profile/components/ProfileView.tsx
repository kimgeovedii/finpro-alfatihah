"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { AddressTab } from "@/features/profile/components/AddressTab";
import { AvatarUpload } from "./AvatarUpload";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ChangeEmailForm } from "./ChangeEmailForm";

const TABS = [
  { id: "personal", label: "Personal Info", icon: UserIcon },
  { id: "security", label: "Security", icon: LockClosedIcon },
  { id: "email", label: "Email Settings", icon: EnvelopeIcon },
  { id: "address", label: "Daftar Alamat", icon: MapPinIcon },
];

export const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { user } = useAuthService();
  const { updateAvatar, updateProfile, changePassword, changeEmail, isLoading } = useProfile();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar / Navigation */}
        <div className="w-full md:w-80 flex flex-col gap-8">
          {/* Profile Card Summary */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-100 border border-slate-50 flex flex-col items-center text-center">
            <AvatarUpload user={user} updateAvatar={updateAvatar} />
            
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
              {activeTab === "personal" && <PersonalInfoForm user={user} updateProfile={updateProfile} isLoading={isLoading} />}
              {activeTab === "security" && <ChangePasswordForm changePassword={changePassword} isLoading={isLoading} />}
              {activeTab === "email" && <ChangeEmailForm user={user} changeEmail={changeEmail} isLoading={isLoading} />}
              {activeTab === "address" && <AddressTab />}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
