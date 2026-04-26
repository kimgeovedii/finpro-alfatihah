import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Branch } from "../types/branch-admin.types";
import { Badge } from "@/components/ui/badge";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface BranchAdminsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
}

export const BranchAdminsDialog: React.FC<BranchAdminsDialogProps> = ({
  open,
  onOpenChange,
  branch,
}) => {
  const admins = branch?.employees || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Admins: <span className="text-emerald-600">{branch?.storeName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {admins.length > 0 ? (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-start gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                    {admin.user?.avatar ? (
                      <img src={admin.user.avatar} alt={admin.fullName} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      admin.fullName.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{admin.fullName}</p>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <UserIcon className="w-3 h-3" />
                          <span>@{admin.user?.username || "no-username"}</span>
                       </div>
                       <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <EnvelopeIcon className="w-3 h-3" />
                          <span className="truncate">{admin.user?.email}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No admins assigned to this branch yet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
