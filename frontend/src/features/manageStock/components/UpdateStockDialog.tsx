"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import { updateStockValidationSchema } from "../validations/manageStock.validation";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BuildingStorefrontIcon, CubeIcon } from "@heroicons/react/24/outline";

export const UpdateStockDialog: React.FC<UpdateStockDialogProps> = ({
  open,
  onOpenChange,
  inventoryItem,
  onSubmit,
  isSubmitting,
  branches,
  allProducts,
}) => {
  const formik = useFormik({
    initialValues: {
      actualStock: 0,
      notes: "",
      productId: "",
      branchId: "",
      isNew: false,
    },
    validationSchema: updateStockValidationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    if (open) {
      if (inventoryItem) {
        formik.setValues({
          actualStock: inventoryItem.currentStock,
          notes: "",
          productId: inventoryItem.productId,
          branchId: inventoryItem.branchId,
          isNew: false,
        });
      } else {
        formik.setValues({
          actualStock: 0,
          notes: "",
          productId: "",
          branchId: "",
          isNew: true,
        });
      }
    }
  }, [open, inventoryItem]);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
    }
    onOpenChange(isOpen);
  };

  const selectedProduct = allProducts.find(
    (p) => p.id === formik.values.productId,
  );
  const selectedBranch = branches.find((b) => b.id === formik.values.branchId);

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
                  {inventoryItem
                    ? "Update Stock Level"
                    : "Add New Stock Record"}
                </DialogTitle>
                <DialogDescription className="text-[#87eded]/80 text-sm mt-1">
                  {inventoryItem ? (
                    <>
                      Adjusting stock for{" "}
                      <strong>{inventoryItem?.product?.productName}</strong> at{" "}
                      <strong>{inventoryItem?.branch?.storeName}</strong>
                    </>
                  ) : (
                    "Select a product and branch to manage their inventory."
                  )}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  {/* Branch Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-[#2c2f30] font-semibold flex items-center gap-2">
                      <BuildingStorefrontIcon className="w-4 h-4 text-[#006666]" />
                      Branch
                    </Label>
                    {inventoryItem ? (
                      <div className="px-3 py-2 bg-[#f5f6f7] rounded-lg text-sm text-[#2c2f30] font-medium border border-[#eff1f2]">
                        {inventoryItem.branch?.storeName}
                      </div>
                    ) : (
                      <Select
                        value={formik.values.branchId}
                        onValueChange={(val) =>
                          formik.setFieldValue("branchId", val)
                        }
                      >
                        <SelectTrigger className="w-full rounded-lg border-[#eff1f2] focus:ring-[#006666]/10 text-sm">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#eff1f2]">
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.storeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {formik.touched.branchId && formik.errors.branchId && (
                      <p className="text-[10px] font-medium text-red-500 mt-1">
                        {formik.errors.branchId}
                      </p>
                    )}
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-[#2c2f30] font-semibold flex items-center gap-2">
                      <CubeIcon className="w-4 h-4 text-[#006666]" />
                      Product
                    </Label>
                    {inventoryItem ? (
                      <div className="px-3 py-2 bg-[#f5f6f7] rounded-lg text-sm text-[#2c2f30] font-medium border border-[#eff1f2]">
                        {inventoryItem.product?.productName}
                      </div>
                    ) : (
                      <Select
                        value={formik.values.productId}
                        onValueChange={(val) =>
                          formik.setFieldValue("productId", val)
                        }
                      >
                        <SelectTrigger className="w-full rounded-lg border-[#eff1f2] focus:ring-[#006666]/10 text-sm">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#eff1f2] max-h-64 overflow-y-auto">
                          {allProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.productName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {formik.touched.productId && formik.errors.productId && (
                      <p className="text-[10px] font-medium text-red-500 mt-1">
                        {formik.errors.productId}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="actualStock"
                        className="text-[#2c2f30] font-semibold"
                      >
                        New Stock Level
                      </Label>
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
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end">
                      <div className="text-[10px] text-[#595c5d] font-semibold uppercase tracking-wider mb-1">
                        Current Stock
                      </div>
                      <div className="h-10 flex items-center px-4 bg-[#f5f6f7] rounded-lg text-lg font-mono font-bold text-[#2c2f30] border border-[#eff1f2]">
                        {inventoryItem?.currentStock ?? 0}
                      </div>
                    </div>
                  </div>
                  {formik.touched.actualStock && formik.errors.actualStock && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">
                      {formik.errors.actualStock}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="notes"
                      className="text-[#2c2f30] font-semibold"
                    >
                      Reason / Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Explain this stock adjustment..."
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={3}
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
                    disabled={isSubmitting || !formik.isValid}
                    className="px-6 py-2 rounded-lg bg-[#006666] text-white text-sm font-bold shadow-lg shadow-[#006666]/10 hover:bg-[#005959] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : inventoryItem
                        ? "Update Stock"
                        : "Add Stock"}
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
