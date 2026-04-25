"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilSquareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface PersonalInfoFormProps {
  user: any;
  updateProfile: (values: any) => Promise<any>;
  isLoading: boolean;
}

export const PersonalInfoForm = ({ user, updateProfile, isLoading }: PersonalInfoFormProps) => {
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
