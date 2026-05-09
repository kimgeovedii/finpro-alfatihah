"use client";

import React from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryDialogProps } from "@/features/manageCategories/types/manageCategory.type";
import { categoryValidationSchema } from "@/features/manageCategories/validations/manageCategory.validation";
import { motion, AnimatePresence } from "framer-motion";

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting,
  title,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      slugName: category?.slugName || "",
      description: category?.description || "",
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
      } catch (error) {
        throw new Error(error as string);
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    formik.setFieldValue("name", name);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    formik.setFieldValue("slugName", slug);
  };

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
          <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl overflow-hidden border-none shadow-2xl p-0 [&>button]:text-white [&>button]:hover:text-gray-400">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-r from-[#006666] to-[#004d4d]">
                <DialogTitle className="text-xl font-bold text-[#bbfffe]">
                  {title}
                </DialogTitle>
                <p className="text-[#87eded]/80 text-sm mt-1">
                  {category
                    ? "Modify existing category details."
                    : "Create a new product category taxonomy."}
                </p>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-[#2c2f30]"
                    >
                      Category Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Tropical Fruits"
                      value={formik.values.name}
                      onChange={handleNameChange}
                      onBlur={formik.handleBlur}
                      className="h-9"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-xs text-red-500">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="slugName"
                      className="text-sm font-semibold text-[#2c2f30]"
                    >
                      Slug Name
                    </Label>
                    <Input
                      id="slugName"
                      name="slugName"
                      readOnly
                      placeholder="tropical-fruits"
                      value={formik.values.slugName}
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    {formik.touched.slugName && formik.errors.slugName && (
                      <p className="text-xs text-red-500">
                        {formik.errors.slugName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-[#2c2f30]"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the types of products in this category..."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={3}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <p className="text-xs text-red-500">
                          {formik.errors.description}
                        </p>
                      )}
                  </div>
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
                    disabled={isSubmitting || !formik.isValid}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2 rounded-lg bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#bbfffe]/30 border-t-[#bbfffe] rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : category ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
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
