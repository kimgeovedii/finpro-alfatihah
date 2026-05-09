import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@heroicons/react/24/solid";

interface SetDefaultBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchName: string;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const SetDefaultBranchDialog: React.FC<SetDefaultBranchDialogProps> = ({
  open,
  onOpenChange,
  branchName,
  onConfirm,
  isSubmitting = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-amber-500" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Set as Default Branch?
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-500 leading-relaxed">
            Branch <strong className="text-slate-700">{branchName}</strong> will become the
            default fallback branch. When a customer is outside all delivery
            ranges, products from this branch will be displayed instead.
            <br />
            <br />
            <span className="text-amber-600 font-medium">
              Only one branch can be set as default at a time.
            </span>{" "}
            The current default branch (if any) will be unset automatically.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
          >
            {isSubmitting ? "Setting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
