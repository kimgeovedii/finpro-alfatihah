"use client"

import React from "react";
import Image from "next/image";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LoginForm = () => {
  const { error, isLoading, formik } = useLogin();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Logos Container - Top Right */}
      <div className="absolute top-6 left-6 md:top-10 md:right-10 z-30 flex items-center gap-4 md:gap-8 transition-all">
        <img 
          src="/assets/logo-apps.png" 
          alt="PTPN Logo" 
          className="h-6 md:h-10 w-auto object-contain"
        />
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30 flex items-center gap-4 transition-all">
        <p className="text-sm text-gray-500 hidden md:block font-medium"> Belum punya akun? </p>
        <Button 
          variant="outline" 
          className="border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white rounded-full px-6 font-semibold transition-all duration-300"
        >
          Daftar
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-[450px] px-6 py-10 md:py-12">
        {/* Header Text */}
        <div className="text-left mb-10 text-[#444]">
          <p className="text-lg mb-1 font-medium">Selamat Datang di</p>
          <h1 className="text-3xl font-bold mb-1 leading-tight">
            Alfatihah <span className="italic font-extrabold text-primary-teal">Apps</span>
          </h1>
          <p className="text-md font-medium opacity-80">Smart Online Grocery with Location-Based Delivery</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-600 ml-1">
              Username atau Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="vuchaprawira-Admin@example.com"
              className={`h-12 bg-[#0000000D] backdrop-blur-md border-none rounded-[8px] focus-visible:ring-2 focus-visible:ring-primary-teal/40 focus-visible:bg-white transition-all duration-300 ${
                formik.touched.email && formik.errors.email ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs ml-1 font-medium">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="Password" className="text-sm font-semibold text-gray-600 ml-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••••••"
              className={`h-12 bg-[#0000000D] backdrop-blur-md border-none rounded-[8px] focus-visible:ring-2 focus-visible:ring-primary-teal/40 focus-visible:bg-white transition-all duration-300 ${
                formik.touched.password && formik.errors.password ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs ml-1 font-medium">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember_me" 
                checked={formik.values.rememberMe}
                onCheckedChange={(checked) => formik.setFieldValue('rememberMe', checked as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-success-green data-[state=checked]:border-success-green border-gray-300 rounded-md transition-colors"
              />
              <Label htmlFor="remember_me" className="text-sm text-gray-500 cursor-pointer font-medium select-none">
                Ingat saya
              </Label>
            </div>
            <a href="#" className="text-sm text-gray-400 hover:text-primary-teal transition-all duration-300 font-medium decoration-primary-teal/30 underline-offset-4 hover:underline">
              Lupa Password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            className="w-full h-14 bg-primary-teal hover:bg-[#00767a] text-white font-bold text-xl rounded-[8px] shadow-lg shadow-primary-teal/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70"
          >
            {isLoading || formik.isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="relative ">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-medium">Atau</span>
            </div>
          </div>

          <Button
            type="button"
            disabled={isLoading || formik.isSubmitting}
            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg border border-gray-300 rounded-[8px] shadow-sm transition-all duration-300 active:scale-[0.97] disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {isLoading || formik.isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary-teal" />
                <span className="text-gray-400">Connecting...</span>
              </div>
            ) : (
              <>
                <Image 
                  width={22} 
                  height={22} 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" 
                  alt="Google Logo"
                  className="object-contain"
                />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
