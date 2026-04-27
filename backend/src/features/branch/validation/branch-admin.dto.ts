import { z } from "zod";
import { DayName } from "@prisma/client";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const CreateBranchSchema = z.object({
  storeName: z.string().min(3),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  maxDeliveryDistance: z.number().min(0),
  city: z.string().min(2),
  province: z.string().min(2),
  district: z.string().min(2).optional().nullable(),
  village: z.string().min(2).optional().nullable(),
});

export const UpdateBranchSchema = CreateBranchSchema.partial();

export const CreateScheduleSchema = z.object({
  dayName: z.nativeEnum(DayName),
  startTime: z.string().regex(timeRegex, "Format must be HH:mm"),
  endTime: z.string().regex(timeRegex, "Format must be HH:mm"),
});

export const UpdateScheduleSchema = CreateScheduleSchema.partial();

export const AssignAdminSchema = z.object({
  employeeId: z.string().uuid(),
});
