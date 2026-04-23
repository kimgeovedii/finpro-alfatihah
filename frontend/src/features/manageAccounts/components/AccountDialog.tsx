import React from "react";
import { useFormik } from "formik";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccountDialogProps,
  CreateAccountPayload,
} from "../types/manageAccount.type";
import {
  manageAccountValidationSchema,
  updateAccountValidationSchema,
} from "../validations/manageAccount.validation";

export const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  onOpenChange,
  branches,
  account,
  onSubmit,
  isSubmitting,
}) => {
  const isEdit = !!account;

  const formik = useFormik<CreateAccountPayload>({
    initialValues: {
      email: account?.email || "",
      username: account?.username || "",
      fullName: account?.employee?.fullName || "",
      role: account?.employee?.role || "STORE_ADMIN",
      branchId: account?.employee?.branchId || "",
    },
    enableReinitialize: true,
    validationSchema: isEdit
      ? updateAccountValidationSchema
      : manageAccountValidationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden border-none shadow-2xl">
        <DialogHeader className="bg-slate-50/50 -mx-6 -mt-6 px-6 py-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEdit ? "Edit Store Admin" : "Add New Store Admin"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-slate-700"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              {...formik.getFieldProps("fullName")}
              placeholder="e.g. John Doe"
              className={`h-11 rounded-xl border-slate-200 focus:ring-teal-500/20 focus:border-teal-500 ${formik.touched.fullName && formik.errors.fullName ? "border-red-500" : ""}`}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.fullName as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="john@example.com"
                disabled={isEdit}
                className={`h-11 rounded-xl border-slate-200 focus:ring-teal-500/20 focus:border-teal-500 ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.email as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-slate-700"
              >
                Username (Optional)
              </Label>
              <Input
                id="username"
                {...formik.getFieldProps("username")}
                placeholder="johndoe"
                className={`h-11 rounded-xl border-slate-200 focus:ring-teal-500/20 focus:border-teal-500 ${formik.touched.username && formik.errors.username ? "border-red-500" : ""}`}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.username as string}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="branchId"
              className="text-sm font-medium text-slate-700"
            >
              Assigned Branch
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("branchId", value)}
              value={formik.values.branchId}
            >
              <SelectTrigger
                className={`h-11 rounded-xl border-slate-200 focus:ring-teal-500/20 focus:border-teal-500 ${formik.touched.branchId && formik.errors.branchId ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {branches.map((branch) => (
                  <SelectItem
                    key={branch.id}
                    value={branch.id}
                    className="rounded-lg"
                  >
                    {branch.storeName} ({branch.city})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.branchId && formik.errors.branchId && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.branchId as string}
              </p>
            )}
          </div>

          {!isEdit && (
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
              Note: A temporary password will be generated and sent to the
              user's email.
            </p>
          )}

          <DialogFooter className="pt-4 border-t border-slate-100 -mx-6 px-6 bg-slate-50/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className="h-11 bg-teal-900 hover:bg-teal-950 text-white px-8 rounded-xl shadow-lg shadow-teal-900/10 disabled:bg-slate-300 disabled:shadow-none transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isEdit ? "Saving..." : "Creating..."}</span>
                </div>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
