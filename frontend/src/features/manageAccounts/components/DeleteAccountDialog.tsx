import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DeleteAccountDialogProps } from "../types/manageAccount.type";

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  account,
  onConfirm,
  isDeleting,
}) => {
  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="p-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>

          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Delete Account?
            </DialogTitle>
            <DialogDescription className="text-slate-500 pt-2 leading-relaxed">
              Are you sure you want to delete the account for{" "}
              <span className="font-semibold text-slate-900">
                {account.employee?.fullName || account.email}
              </span>
              ? This action cannot be undone and will remove all associated
              administrative data.
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="bg-slate-50 p-6 flex flex-row gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl text-slate-600 hover:bg-slate-200/50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Yes, Delete Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
