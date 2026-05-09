"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import { X, Image as ImageIcon, Plus } from "lucide-react";
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
import { editProductValidationSchema } from "@/features/manageProducts/validations/manageProduct.validation";

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  categories,
  product,
  onSubmit,
  isUpdating,
}) => {
  const [imagePreviews, setImagePreviews] = useState<
    Array<{ file?: File; preview: string; isExisting: boolean; id?: string }>
  >([]);
  const [existingImageIds, setExistingImageIds] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      productName: "",
      slugName: "",
      description: "",
      categoryId: "",
      basePrice: 0,
      sku: "",
      weight: 0,
      images: null as File[] | null,
      existingImageIds: [] as string[],
    },
    validationSchema: editProductValidationSchema,
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
      const currentImageIds = product.productImages.map((img) => img.id);
      formik.setValues({
        productName: product.productName || "",
        slugName: product.slugName || "",
        description: product.description || "",
        categoryId: product.category?.id || "",
        basePrice: product.basePrice || 0,
        sku: product.sku || product.slugName || "",
        weight: (product as any).weight || 0,
        images: null,
        existingImageIds: currentImageIds,
      });

      if (product.productImages && product.productImages.length > 0) {
        const existingPreviews = product.productImages.map((img) => ({
          preview: img.imageUrl,
          isExisting: true,
          id: img.id,
        }));
        setImagePreviews(existingPreviews);
        setExistingImageIds(currentImageIds);
      } else {
        setImagePreviews([]);
        setExistingImageIds([]);
      }
    }
  }, [open, product]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: Array<{
        file?: File;
        preview: string;
        isExisting: boolean;
        id?: string;
      }> = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string,
            isExisting: false,
          });

          if (newImages.length === Array.from(files).length) {
            const updatedPreviews = [...imagePreviews, ...newImages];
            setImagePreviews(updatedPreviews);
            const fileArray = updatedPreviews
              .filter((img) => img.file)
              .map((img) => img.file as File);
            formik.setFieldValue(
              "images",
              fileArray.length > 0 ? fileArray : null,
            );
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    if (imageToRemove.isExisting && imageToRemove.id) {
      const updatedIds = existingImageIds.filter((id) => id !== imageToRemove.id);
      setExistingImageIds(updatedIds);
      formik.setFieldValue("existingImageIds", updatedIds);
    }

    const fileArray = updatedPreviews
      .filter((img) => img.file)
      .map((img) => img.file as File);
    formik.setFieldValue("images", fileArray.length > 0 ? fileArray : null);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
      setImagePreviews([]);
      setExistingImageIds([]);
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
                  Edit Product
                </DialogTitle>
                <DialogDescription className="text-[#87eded]/80 text-sm mt-1">
                  Update the details of the product.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 px-0.5">
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
                    {formik.touched.productName &&
                      formik.errors.productName && (
                        <p className="text-xs text-red-500">
                          {formik.errors.productName}
                        </p>
                      )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slugName">Slug</Label>
                    <Input
                      id="slugName"
                      name="slugName"
                      readOnly
                      placeholder="organic-avocados"
                      value={formik.values.slugName}
                      className="h-9 bg-gray-100 cursor-not-allowed"
                    />
                    {formik.touched.slugName && formik.errors.slugName && (
                      <p className="text-xs text-red-500">
                        {formik.errors.slugName}
                      </p>
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
                      <p className="text-xs text-red-500">
                        {formik.errors.sku}
                      </p>
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
                        {categories
                          .filter((cat) => !cat.deletedAt)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.categoryId && formik.errors.categoryId && (
                      <p className="text-xs text-red-500">
                        {formik.errors.categoryId}
                      </p>
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
                        formik.setFieldValue(
                          "basePrice",
                          Number(e.target.value),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="h-9"
                    />
                    {formik.touched.basePrice && formik.errors.basePrice && (
                      <p className="text-xs text-red-500">
                        {formik.errors.basePrice}
                      </p>
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
                      <p className="text-xs text-red-500">
                        {formik.errors.weight}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="images">Product Images</Label>
                    <div className="mt-1 flex flex-col items-center gap-3">
                      {imagePreviews.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {imagePreviews.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-200 group"
                              >
                                <img
                                  src={image.preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white rounded-full text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                {image.isExisting && (
                                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                                    Existing
                                  </div>
                                )}
                                {!image.isExisting && index === 0 && (
                                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                                    New
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <label
                            htmlFor="images"
                            className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
                          >
                            <Plus className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-gray-600 font-medium">
                              Add or replace images
                            </span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImagesChange}
                            />
                          </label>
                        </div>
                      ) : (
                        <label
                          htmlFor="images"
                          className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-3 bg-teal-50 rounded-full group-hover:scale-110 transition-transform">
                              <ImageIcon className="w-6 h-6 text-teal-600" />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-semibold text-teal-600">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG or WEBP (MAX. 1MB each, up to 10 images)
                            </p>
                          </div>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                          />
                        </label>
                      )}
                    </div>
                    {formik.touched.images && formik.errors.images && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.images as string}
                      </p>
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
