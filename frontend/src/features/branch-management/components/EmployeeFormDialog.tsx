import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
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
import { Branch } from "../types/branch-admin.type";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new staff account and assign roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...formik.getFieldProps("fullName")}
                placeholder="John Doe"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-destructive text-xs font-medium">{formik.errors.fullName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                {...formik.getFieldProps("email")}
                placeholder="john@example.com"
                type="email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-destructive text-xs font-medium">{formik.errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formik.values.role} 
                  onValueChange={(val) => formik.setFieldValue("role", val)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branchId">Branch (Optional)</Label>
                <Select 
                  value={formik.values.branchId} 
                  onValueChange={(val) => formik.setFieldValue("branchId", val)}
                  disabled={formik.values.role === "SUPER_ADMIN"}
                >
                  <SelectTrigger id="branchId">
                    <SelectValue placeholder="No branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No branch</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.storeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </DialogFooter>
          
          <p className="text-center text-[10px] text-muted-foreground pt-2">
            Default password is <span className="font-bold">Password123</span>.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
