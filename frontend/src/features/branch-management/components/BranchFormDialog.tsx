import React from "react";
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
  SelectValue 
} from "@/components/ui/select";
import { useFormik } from "formik";
import { branchValidationSchema } from "../validations/branch-admin.schema";
import { Branch, CreateBranchPayload, UpdateBranchPayload } from "../types/branch-admin.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { useRegions } from "@/hooks/useRegions";

const BranchMapPicker = dynamic(() => import("./BranchMapPicker").then(mod => mod.BranchMapPicker), {
  ssr: false,
  loading: () => <div className="w-full h-64 rounded-xl bg-slate-100 animate-pulse mt-2 flex items-center justify-center text-slate-400">Loading Map...</div>
});

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
  onSubmit: (values: CreateBranchPayload | UpdateBranchPayload) => Promise<void>;
  isSubmitting: boolean;
}

export const BranchFormDialog: React.FC<BranchFormDialogProps> = ({
  open,
  onOpenChange,
  branch,
  onSubmit,
  isSubmitting,
}) => {
  const formik = useFormik({
    initialValues: {
      storeName: branch?.storeName || "",
      address: branch?.address || "",
      latitude: branch?.latitude || -6.2088,
      longitude: branch?.longitude || 106.8456,
      maxDeliveryDistance: branch?.maxDeliveryDistance || 10,
      city: branch?.city || "",
      province: branch?.province || "",
      district: branch?.district || "",
      village: branch?.village || "",
    },
    validationSchema: branchValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const { provinces, regencies, districts, villages } = useRegions(formik);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 py-4 max-h-[calc(90vh-140px)]">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  {...formik.getFieldProps("storeName")}
                  placeholder="e.g. Alfatihah Kebayoran"
                  className={formik.touched.storeName && formik.errors.storeName ? "border-red-500" : ""}
                />
                {formik.touched.storeName && formik.errors.storeName && (
                  <p className="text-xs text-red-500">{formik.errors.storeName}</p>
                )}
              </div>

            <div className="space-y-2 col-span-2">
                <Label htmlFor="maxDeliveryDistance">Max Delivery Distance (km)</Label>
                <Input
                  id="maxDeliveryDistance"
                  type="number"
                  {...formik.getFieldProps("maxDeliveryDistance")}
                />
              </div>

              {/* Province */}
              <div className="space-y-2">
                <Label>Province</Label>
                <Select
                  value={formik.values.province}
                  onValueChange={(val) => {
                    formik.setFieldValue("province", val);
                    formik.setFieldValue("city", "");
                    formik.setFieldValue("district", "");
                    formik.setFieldValue("village", "");
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City / Regency */}
              <div className="space-y-2">
                <Label>City / Regency</Label>
                <Select
                  value={formik.values.city}
                  onValueChange={(val) => {
                    formik.setFieldValue("city", val);
                    formik.setFieldValue("district", "");
                    formik.setFieldValue("village", "");
                  }}
                  disabled={!formik.values.province}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {regencies.map((r) => (
                      <SelectItem key={r.code} value={r.name}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>District (Kecamatan)</Label>
                <Select
                  value={formik.values.district}
                  onValueChange={(val) => {
                    formik.setFieldValue("district", val);
                    formik.setFieldValue("village", "");
                  }}
                  disabled={!formik.values.city}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.code} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Village */}
              <div className="space-y-2">
                <Label>Village (Kelurahan)</Label>
                <Select
                  value={formik.values.village}
                  onValueChange={(val) => formik.setFieldValue("village", val)}
                  disabled={!formik.values.district}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Village" />
                  </SelectTrigger>
                  <SelectContent>
                    {villages.map((v) => (
                      <SelectItem key={v.code} value={v.name}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            
     <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  {...formik.getFieldProps("address")}
                  placeholder="Street name, number, etc."
                />
              </div >
              <div className="space-y-2 col-span-2">
                <Label>Store Location (Pick on Map)</Label>
                <BranchMapPicker
                  lat={formik.values.latitude}
                  lng={formik.values.longitude}
                  storeName={formik.values.storeName}
                  onAddressChange={(address) => formik.setFieldValue("address", address)}
                  onChange={(lat, lng) => {
                    formik.setFieldValue("latitude", lat);
                    formik.setFieldValue("longitude", lng);
                  }}
                />
               
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => formik.handleSubmit()} 
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "Saving..." : branch ? "Update Branch" : "Create Branch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
