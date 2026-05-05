import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee, Branch } from "../types/branch-admin.type";
import { Label } from "@/components/ui/label";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BranchAdminRepository } from "../repository/branch-admin.repository";

const repo = new BranchAdminRepository();

interface AssignAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  admins: Employee[]; // Initial admins
  onAssign: (employeeId: string) => Promise<void>;
}

export const AssignAdminDialog: React.FC<AssignAdminDialogProps> = ({
  open,
  onOpenChange,
  branch,
  admins: initialAdmins,
  onAssign,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [search, setSearch] = useState("");
  const [adminList, setAdminList] = useState<Employee[]>(initialAdmins);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initial list when dialog opens or prop changes
  useEffect(() => {
    if (open) {
      setAdminList(initialAdmins);
      setSearch("");
    }
  }, [open, initialAdmins]);

  // Search logic
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await repo.getAvailableAdmins(value);
        setAdminList(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleConfirm = async () => {
    if (!selectedAdmin) return;
    await onAssign(selectedAdmin);
    onOpenChange(false);
    setSelectedAdmin("");
  };

  const selectedAdminData = adminList.find(a => a.id === selectedAdmin) || initialAdmins.find(a => a.id === selectedAdmin);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Admin: {branch?.storeName}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Select Store Admin</Label>
            
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between h-12 bg-slate-50 border-slate-200 rounded-xl px-4 font-medium text-slate-700"
                >
                  <span className="truncate">
                    {selectedAdmin
                      ? selectedAdminData?.fullName
                      : "Choose an admin..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-0 z-[1100]">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search by name, email, or username..." 
                    value={search}
                    onValueChange={handleSearch}
                  />
                  <CommandList>
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                    ) : (
                      <>
                        <CommandEmpty>No admin found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {adminList.map((admin) => (
                            <CommandItem
                              key={admin.id}
                              value={admin.id}
                              onSelect={() => {
                                setSelectedAdmin(admin.id);
                                setOpenCombobox(false);
                              }}
                              className="flex flex-col items-start py-3 gap-1"
                            >
                              <div className="flex items-center w-full justify-between">
                                <span className="font-bold text-slate-700">{admin.fullName}</span>
                                {selectedAdmin === admin.id && (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                )}
                              </div>
                              <div className="flex flex-col text-[10px] text-slate-500">
                                <span>{admin.user?.email}</span>
                                <span className="text-emerald-600 font-medium italic">
                                  {admin.branch ? `Currently at ${admin.branch.storeName}` : "No branch"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-slate-500 italic">
            Note: Assigning an admin will move them from their current store to this store.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!selectedAdmin} 
            onClick={handleConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
