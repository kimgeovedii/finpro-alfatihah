import React from "react";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      if (!isEdit) resetForm();
    },
  });

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="sm:max-w-lg bg-white rounded-2xl overflow-hidden border-none shadow-2xl p-0 [&>button]:text-white [&>button]:hover:text-gray-400"
            showCloseButton
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-r from-[#006666] to-[#004d4d]">
                <DialogTitle className="text-xl font-bold text-[#bbfffe]">
                  {isEdit ? "Edit Store Admin" : "Add New Store Admin"}
                </DialogTitle>
                <DialogDescription className="text-[#87eded]/80 text-sm mt-1">
                  {isEdit
                    ? "Update the details for this store admin."
                    : "Fill in the details below to add a new store admin to your platform."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 px-0.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...formik.getFieldProps("fullName")}
                      placeholder="e.g. John Doe"
                      className="h-9"
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-xs text-red-500">
                        {formik.errors.fullName as string}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...formik.getFieldProps("email")}
                        placeholder="john@example.com"
                        disabled={isEdit}
                        className={`h-9 ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-red-500">
                          {formik.errors.email as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...formik.getFieldProps("username")}
                        placeholder="johndoe"
                        className="h-9"
                      />
                      {formik.touched.username && formik.errors.username && (
                        <p className="text-xs text-red-500">
                          {formik.errors.username as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="branchId">Assigned Branch</Label>
                    <Select
                      onValueChange={(value) =>
                        formik.setFieldValue("branchId", value)
                      }
                      value={formik.values.branchId}
                    >
                      <SelectTrigger id="branchId" className="h-9">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.storeName} ({branch.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.branchId && formik.errors.branchId && (
                      <p className="text-xs text-red-500">
                        {formik.errors.branchId as string}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#595c5d] hover:bg-[#eff1f2] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting || !formik.isValid}
                    className="px-5 py-2 rounded-lg bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? isEdit
                        ? "Saving..."
                        : "Creating..."
                      : isEdit
                        ? "Save Changes"
                        : "Create Account"}
                  </motion.button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
