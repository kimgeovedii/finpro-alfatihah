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
import { useFormik } from "formik";
import { createDiscountSchema } from "../validations/discount.validation";
import { IUpdateDiscountRequest, IDiscount, DiscountType, DiscountValueType } from "../types/discount.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface EditDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: IUpdateDiscountRequest) => Promise<void>;
  isSubmitting: boolean;
  discount: IDiscount | null;
}

export const EditDiscountDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  discount,
}: EditDiscountDialogProps) => {
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      apiFetch<{ data: any[] }>("/branches")
        .then((res) => setBranches(res.data || []))
        .catch(console.error);
    }
  }, [open]);

  const formik = useFormik<IUpdateDiscountRequest>({
    initialValues: {
      name: "",
      discountType: "PRODUCT_DISCOUNT",
      discountValueType: "PERCENTAGE",
      discountValue: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0],
      quota: 100,
      branchId: "",
    },
    validationSchema: createDiscountSchema,
    onSubmit: async (values) => {
      if (!discount) return;
      await onSubmit(discount.id, {
        ...values,
        startDate: new Date(values.startDate as string).toISOString(),
        endDate: new Date(values.endDate as string).toISOString(),
      });
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (discount && open) {
      formik.setValues({
        name: discount.name,
        discountType: discount.discountType,
        discountValueType: discount.discountValueType,
        discountValue: discount.discountValue,
        minPurchaseAmount: discount.minPurchaseAmount || 0,
        maxDiscountAmount: discount.maxDiscountAmount,
        startDate: new Date(discount.startDate).toISOString().split("T")[0],
        endDate: new Date(discount.endDate).toISOString().split("T")[0],
        quota: discount.quota,
        branchId: discount.branchId,
      });
    } else if (!open) {
      formik.resetForm();
    }
  }, [discount, open]);

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
                  Edit Discount
                </DialogTitle>
                <DialogDescription className="text-[#87eded]/80 text-sm mt-1">
                  Update discount rules and validity below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 px-0.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Discount Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Summer Sale"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-9"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Discount Type</Label>
                      <Select
                        value={formik.values.discountType}
                        onValueChange={(val) =>
                          formik.setFieldValue("discountType", val)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRODUCT_DISCOUNT">
                            Product Discount
                          </SelectItem>
                          <SelectItem value="BUY_ONE_GET_ONE_FREE">
                            Buy 1 Get 1 Free
                          </SelectItem>
                          <SelectItem value="MINIMUM_PURCHASE">
                            Minimum Purchase
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Value Type</Label>
                      <Select
                        value={formik.values.discountValueType}
                        onValueChange={(val) =>
                          formik.setFieldValue("discountValueType", val)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select value type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="NOMINAL">Nominal ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="discountValue">Value</Label>
                      <Input
                        id="discountValue"
                        type="number"
                        name="discountValue"
                        value={formik.values.discountValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                      {formik.touched.discountValue &&
                        formik.errors.discountValue && (
                          <p className="text-red-500 text-xs">
                            {formik.errors.discountValue}
                          </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="quota">Quota</Label>
                      <Input
                        id="quota"
                        type="number"
                        name="quota"
                        value={formik.values.quota}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                      {formik.touched.quota && formik.errors.quota && (
                        <p className="text-red-500 text-xs">
                          {formik.errors.quota}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="minPurchaseAmount">Min Purchase</Label>
                      <Input
                        id="minPurchaseAmount"
                        type="number"
                        name="minPurchaseAmount"
                        value={formik.values.minPurchaseAmount || 0}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="maxDiscountAmount">Max Discount</Label>
                      <Input
                        id="maxDiscountAmount"
                        type="number"
                        name="maxDiscountAmount"
                        value={formik.values.maxDiscountAmount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        name="startDate"
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                      {formik.touched.startDate && formik.errors.startDate && (
                        <p className="text-red-500 text-xs">
                          {formik.errors.startDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        name="endDate"
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9"
                      />
                      {formik.touched.endDate && formik.errors.endDate && (
                        <p className="text-red-500 text-xs">
                          {formik.errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Applicable Branch</Label>
                    <Select
                      value={formik.values.branchId}
                      onValueChange={(val) =>
                        formik.setFieldValue("branchId", val)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.storeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.branchId && formik.errors.branchId && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.branchId}
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
                    disabled={isSubmitting || !formik.isValid}
                    className="px-5 py-2 rounded-lg bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] text-sm font-medium shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
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
