"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  changePassword: (values: any) => Promise<any>;
  isLoading: boolean;
}

export const ChangePasswordForm = ({ changePassword, isLoading }: ChangePasswordFormProps) => {
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
