import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { scheduleValidationSchema } from "../validations/branch-admin.schema";
import { Branch, BranchSchedule, DayName } from "../types/branch-admin.types";
import { TrashIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";

interface BranchScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  schedules: BranchSchedule[];
  isLoading: boolean;
  onSubmit: (values: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DAYS: DayName[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const BranchScheduleDialog: React.FC<BranchScheduleDialogProps> = ({
  open,
  onOpenChange,
  branch,
  schedules,
  isLoading,
  onSubmit,
  onDelete,
}) => {
  const formik = useFormik({
    initialValues: {
      id: "" as string,
      dayName: "MON" as DayName,
      startTime: "08:00",
      endTime: "22:00",
    },
    validationSchema: scheduleValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
    },
  });

  const availableDays = DAYS.filter(day => 
    schedules.find(s => s.dayName === day)?.isPlaceholder || day === formik.values.dayName
  );

  React.useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(formik.values.dayName)) {
      formik.setFieldValue("dayName", availableDays[0]);
    }
  }, [availableDays, formik]);

  const handleEdit = (s: BranchSchedule) => {
    formik.setValues({
      id: s.id,
      dayName: s.dayName,
      startTime: s.startTime || "08:00",
      endTime: s.endTime || "22:00",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedules: {branch?.storeName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Add New Schedule Form */}
          {(availableDays.length > 0 || schedules.some(s => s.dayName === formik.values.dayName && !s.isPlaceholder)) && (
            <div className="p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl space-y-4">
              <h4 className="text-sm font-semibold text-emerald-800">
                {schedules.find(s => s.dayName === formik.values.dayName && !s.isPlaceholder) ? "Update" : "Add"} Operating Hours
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Day</Label>
                    <Select 
                      value={formik.values.dayName} 
                      onValueChange={(val) => formik.setFieldValue("dayName", val)}
                    >
                      <SelectTrigger className="h-9 bg-white">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDays.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Open</Label>
                    <Input 
                      type="text" 
                      placeholder="08:00" 
                      className="h-9 bg-white text-xs" 
                      {...formik.getFieldProps("startTime")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase">Close</Label>
                    <Input 
                      type="text" 
                      placeholder="22:00" 
                      className="h-9 bg-white text-xs" 
                      {...formik.getFieldProps("endTime")}
                    />
                  </div>
              </div>
              <Button 
                  onClick={() => formik.handleSubmit()} 
                  className="w-full h-9 bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
              >
                  {schedules.find(s => s.dayName === formik.values.dayName && !s.isPlaceholder) ? (
                    <>Update Schedule</>
                  ) : (
                    <><PlusIcon className="w-4 h-4 mr-1" /> Save Schedule</>
                  )}
              </Button>
            </div>
          )}

          {/* List Existing Schedules */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <h4 className="text-sm font-semibold text-slate-700">Weekly Overview</h4>
               <Badge variant="outline" className="text-[10px] uppercase font-normal text-slate-400 border-slate-100">
                 {schedules.filter(s => !s.isPlaceholder).length}/7 Days Set
               </Badge>
             </div>
             {isLoading ? (
               <Skeleton className="h-20 w-full" />
             ) : schedules.length > 0 ? (
               <div className="space-y-2">
                 {schedules.map((s) => (
                   <div key={s.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-white shadow-sm hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-12 justify-center border-slate-200">{s.dayName}</Badge>
                        <span className={`text-sm font-medium ${s.isPlaceholder ? "text-slate-400 italic" : "text-slate-600"}`}>
                          {s.isPlaceholder ? "Closed / Not set" : `${s.startTime} — ${s.endTime}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!s.isPlaceholder && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                              onClick={() => handleEdit(s)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => onDelete(s.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-xs text-slate-400 italic text-center py-4">No schedules set yet.</p>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Badge } from "@/components/ui/badge";
