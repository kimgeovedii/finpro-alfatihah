"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { Textarea } from "@/components/ui/textarea";
import { UpdateStockDialogProps } from "../types/manageStock.type";

const updateStockValidationSchema = Yup.object().shape({
  actualStock: Yup.number()
    .min(0, "Stock cannot be negative")
    .required("Stock level is required"),
  notes: Yup.string()
    .min(5, "Reason must be at least 5 characters")
    .required("Please provide a reason for this stock adjustment"),
});

export const UpdateStockDialog: React.FC<UpdateStockDialogProps> = ({
  open,
  onOpenChange,
  inventoryItem,
  onSubmit,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      actualStock: 0,
      notes: "",
    },
    validationSchema: updateStockValidationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    if (open && inventoryItem) {
      formik.setValues({
        actualStock: inventoryItem.currentStock,
        notes: "",
      });
    }
  }, [open, inventoryItem]);

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
            className="sm:max-w-md bg-white rounded-2xl overflow-hidden border-none shadow-2xl p-0 [&>button]:text-white [&>button]:hover:text-gray-200"
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
                  Update Stock Level
                </DialogTitle>
                <DialogDescription className="text-[#87eded]/80 text-sm mt-1">
                  Adjusting stock for <strong>{inventoryItem?.product?.productName}</strong>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="actualStock" className="text-[#2c2f30] font-semibold">
                      New Stock Level
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="actualStock"
                        name="actualStock"
                        type="number"
                        placeholder="0"
                        value={formik.values.actualStock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 text-lg font-mono font-bold text-[#006666] border-[#eff1f2] focus:ring-[#006666]/10"
                      />
                      <div className="text-xs text-[#595c5d] bg-[#f5f6f7] px-3 py-2 rounded-lg leading-tight">
                        Current: <span className="font-bold text-[#2c2f30]">{inventoryItem?.currentStock}</span>
                      </div>
                    </div>
                    {formik.touched.actualStock && formik.errors.actualStock && (
                      <p className="text-[10px] font-medium text-red-500 mt-1">
                        {formik.errors.actualStock}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-[#2c2f30] font-semibold">
                      Adjustment Reason (Journal Notes)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Explain why the stock is being adjusted..."
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={4}
                      className="resize-none border-[#eff1f2] focus:ring-[#006666]/10 placeholder:text-[#595c5d]/50 text-sm"
                    />
                    {formik.touched.notes && formik.errors.notes && (
                      <p className="text-[10px] font-medium text-red-500 mt-1">
                        {formik.errors.notes}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 border-t border-[#eff1f2] pt-6 -mx-6 px-6">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#595c5d] hover:bg-[#f5f6f7] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting || !formik.isValid || !formik.dirty}
                    className="px-6 py-2 rounded-lg bg-[#006666] text-white text-sm font-bold shadow-lg shadow-[#006666]/10 hover:bg-[#005959] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Updating..." : "Update Stock"}
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
