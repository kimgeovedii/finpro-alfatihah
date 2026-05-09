import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Branch, Employee } from "../types/branch-admin.type";

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  branches: Branch[];
  isSubmitting: boolean;
  onAssign: (branchId: string) => Promise<void>;
}

export const AssignEmployeeDialog: React.FC<AssignEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  branches,
  isSubmitting,
  onAssign,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  useEffect(() => {
    if (open) {
      setSelectedBranchId("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedBranchId) return;
    try {
      await onAssign(selectedBranchId);
      onOpenChange(false);
    } catch {
      // Error is handled by the hook layer
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#2c2f30] font-bold">
            Assign Employee to Branch
          </DialogTitle>
          <DialogDescription className="text-[#595c5d]">
            Select a branch to assign{" "}
            <span className="font-semibold text-[#006666]">{employee?.fullName}</span>{" "}
            to.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-4 space-y-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="branchId" className="text-xs uppercase text-[#595c5d] font-medium tracking-wider">
              Target Branch
            </Label>
            <Select
              value={selectedBranchId}
              onValueChange={setSelectedBranchId}
            >
              <SelectTrigger id="branchId" className="h-11 rounded-xl bg-white border-[#eff1f2] text-[#2c2f30]">
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
          </div>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedBranchId || isSubmitting}
              className="rounded-xl bg-linear-to-r from-[#006666] to-[#005959] text-[#bbfffe] shadow-sm shadow-[#006666]/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isSubmitting ? "Assigning..." : "Assign"}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
