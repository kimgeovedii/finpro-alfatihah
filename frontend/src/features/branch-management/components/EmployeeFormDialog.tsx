import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Branch } from "../types/branch-admin.types";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  branches: Branch[];
  defaultBranchId?: string;
}

const EmployeeSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().oneOf(["STORE_ADMIN", "SUPER_ADMIN"]).required("Role is required"),
  branchId: Yup.string().optional(),
});

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  branches,
  defaultBranchId,
}) => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      role: "STORE_ADMIN",
      branchId: defaultBranchId || "none",
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        branchId: values.branchId === "none" ? undefined : values.branchId
      };
      await onSubmit(payload);
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="relative z-10">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-extrabold tracking-tight">Add New Employee</DialogTitle>
                </DialogHeader>
                <p className="text-slate-400 mt-2 font-medium">Create a new staff account and assign roles.</p>
            </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-500 ml-1">Full Name</Label>
              <Input
                {...formik.getFieldProps("fullName")}
                placeholder="John Doe"
                className="h-12 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-500 ml-1">Email Address</Label>
              <Input
                {...formik.getFieldProps("email")}
                placeholder="john@example.com"
                type="email"
                className="h-12 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-500 ml-1">Employee Role</Label>
                    <Select 
                        value={formik.values.role} 
                        onValueChange={(val) => formik.setFieldValue("role", val)}
                    >
                        <SelectTrigger className="h-12 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl">
                            <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-500 ml-1">Assign to Branch (Optional)</Label>
                    <Select 
                        value={formik.values.branchId} 
                        onValueChange={(val) => formik.setFieldValue("branchId", val)}
                        disabled={formik.values.role === "SUPER_ADMIN"}
                    >
                        <SelectTrigger className="h-12 bg-slate-50 border-none rounded-2xl px-5 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700">
                            <SelectValue placeholder="No branch" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl">
                            <SelectItem value="none">No branch</SelectItem>
                            {branches.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.storeName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-14 rounded-2xl border-none bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] h-14 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </div>
          
          <p className="text-center text-[11px] text-slate-400 font-medium px-4">
              Creating an employee will automatically generate a user account. Default password is <span className="text-emerald-600 font-bold">Password123</span>.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
