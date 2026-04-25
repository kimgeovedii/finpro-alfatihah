import * as Yup from "yup";

export const AddressValidationSchema = Yup.object({
  label: Yup.string().required("Label wajib diisi"),
  type: Yup.string().required("Tipe wajib diisi"),
  receiptName: Yup.string().required("Nama penerima wajib diisi"),
  phone: Yup.string().required("Nomor telepon wajib diisi"),
  address: Yup.string().required("Alamat lengkap wajib diisi"),
  province: Yup.string().required("Provinsi wajib diisi"),
  city: Yup.string().required("Kota/Kabupaten wajib diisi"),
  district: Yup.string().required("Kecamatan wajib diisi"),
  village: Yup.string().required("Kelurahan/Desa wajib diisi"),
});
