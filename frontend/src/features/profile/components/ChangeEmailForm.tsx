"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowPathIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface ChangeEmailFormProps {
  user: any;
  changeEmail: (values: any) => Promise<any>;
  isLoading: boolean;
}

export const ChangeEmailForm = ({ user, changeEmail, isLoading }: ChangeEmailFormProps) => {
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
           <div className="space-y-1">
             <p className="text-xs text-amber-800 font-bold leading-relaxed">
               {user?.newEmail ? (
                 <>
                   Menunggu Verifikasi: <span className="text-teal-700 underline">{user.newEmail}</span>
                 </>
               ) : (
                 "Penting:"
               )}
             </p>
             <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
               {user?.newEmail 
                 ? "Silakan cek inbox email baru Anda untuk mengaktifkan perubahan ini. Selama belum diverifikasi, Anda masih menggunakan email lama."
                 : "Setelah mengubah email, Anda akan diminta untuk memverifikasi alamat email baru tersebut sebelum dapat login kembali."}
             </p>
           </div>
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
