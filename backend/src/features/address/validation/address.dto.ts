import { z } from "zod";

export const CreateAddressSchema = z.object({
  label: z.string().min(1, "Label wajib diisi"),
  type: z.string().min(1, "Tipe alamat wajib diisi"),
  receiptName: z.string().min(1, "Nama penerima wajib diisi"),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  address: z.string().min(5, "Alamat lengkap minimal 5 karakter"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  city: z.string().min(1, "Kota/Kabupaten wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  village: z.string().min(1, "Kelurahan/Desa wajib diisi"),
  notes: z.string().optional(),
  lat: z.number(),
  long: z.number(),
  isPrimary: z.boolean().optional().default(false),
});


export const UpdateAddressSchema = CreateAddressSchema.partial();
