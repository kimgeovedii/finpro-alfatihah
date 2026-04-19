"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditProductDialogProps } from "@/features/manageProducts/types/manageProduct.type";
import { manageProductValidationSchema } from "@/features/manageProducts/validations/manageProduct.validation";

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  categories,
  product,
  onSubmit,
  isUpdating,
}) => {
  const formik = useFormik({
    initialValues: {
      productName: "",
      slugName: "",
      description: "",
      categoryId: "",
      basePrice: 0,
      sku: "",
      weight: 0,
    },
    validationSchema: manageProductValidationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        throw new Error(error as string);
      }
    },
  });

  useEffect(() => {
    if (open && product) {
      formik.setValues({
        productName: product.productName || "",
        slugName: product.slugName || "",
        description: product.description || "",
        categoryId: product.category?.id || "",
        basePrice: product.basePrice || 0,
        sku: product.sku || product.slugName || "",
        weight: (product as any).weight || 0, 
      });
    }
  }, [open, product]);

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
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#2c2f30]">
                  Edit Product
                </DialogTitle>
                <DialogDescription>
                  Update the details of the product.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    placeholder="e.g. Organic Avocados"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9"
                  />
                  {formik.touched.productName && formik.errors.productName && (
                    <p className="text-xs text-red-500">{formik.errors.productName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slugName">Slug</Label>
                  <Input
                    id="slugName"
                    name="slugName"
                    placeholder="organic-avocados"
                    value={formik.values.slugName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9"
                  />
                  {formik.touched.slugName && formik.errors.slugName && (
                    <p className="text-xs text-red-500">{formik.errors.slugName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="e.g. PROD-001"
                    value={formik.values.sku}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9"
                  />
                  {formik.touched.sku && formik.errors.sku && (
                    <p className="text-xs text-red-500">{formik.errors.sku}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={formik.values.categoryId}
                    onValueChange={(value) =>
                      formik.setFieldValue("categoryId", value)
                    }
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <p className="text-xs text-red-500">{formik.errors.categoryId}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="basePrice">Base Price (IDR)</Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    placeholder="0"
                    value={formik.values.basePrice || ""}
                    onChange={(e) =>
                      formik.setFieldValue("basePrice", Number(e.target.value))
                    }
                    onBlur={formik.handleBlur}
                    className="h-9"
                  />
                  {formik.touched.basePrice && formik.errors.basePrice && (
                    <p className="text-xs text-red-500">{formik.errors.basePrice}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="weight">Weight (gram)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="0"
                    value={formik.values.weight || ""}
                    onChange={(e) =>
                      formik.setFieldValue("weight", Number(e.target.value))
                    }
                    onBlur={formik.handleBlur}
                    className="h-9"
                  />
                  {formik.touched.weight && formik.errors.weight && (
                    <p className="text-xs text-red-500">{formik.errors.weight}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the product..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-xs text-red-500">{formik.errors.description}</p>
                  )}
                </div>

                <DialogFooter>
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
                    disabled={isUpdating || !formik.isValid}
                    className="px-5 py-2 rounded-lg bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
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
