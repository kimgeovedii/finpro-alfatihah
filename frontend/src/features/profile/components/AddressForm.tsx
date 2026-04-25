"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useAddress } from "../hooks/useAddress";
import { useRegions } from "../hooks/useRegions";
import { AddressValidationSchema } from "../validation/address.schema";
import { regionService } from "../service/region.service";
import { toast } from "sonner";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "leaflet/dist/leaflet.css";

const AddressMap = dynamic(
  () => import("./AddressMap"),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50 animate-pulse rounded-[32px] flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">Memuat Peta...</div>
  }
);

interface AddressFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  address?: any;
}


const Combobox = ({ options, value, onValueChange, placeholder, disabled }: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700 text-left overflow-hidden"
          disabled={disabled}
        >
          <span className="truncate">
            {value
              ? options.find((option: any) => option.label === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[1000]">
        <Command>
          <CommandInput placeholder={`Cari ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((option: any) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const AddressForm = ({ onClose, onSuccess, address }: AddressFormProps) => {
  const { createAddress, updateAddress, isLoading } = useAddress();
  const [position, setPosition] = useState<[number, number]>([-6.2088, 106.8456]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const formik = useFormik({
    initialValues: {
      label: "",
      type: "Rumah",
      receiptName: "",
      phone: "",
      address: "",
      province: "",
      city: "",
      district: "",
      village: "",
      notes: "",
      isPrimary: false,
    },
    validationSchema: AddressValidationSchema,
    onSubmit: async (values) => {
      try {
        const payload = { ...values, lat: position[0], long: position[1] };
        if (address) {
          await updateAddress(address.id, payload);
          toast.success("Alamat berhasil diperbarui");
        } else {
          await createAddress(payload);
          toast.success("Alamat berhasil ditambahkan");
        }
        if (onSuccess) onSuccess();
        onClose();
        formik.resetForm();
      } catch (err: any) {

        toast.error(err.message || "Gagal menyimpan alamat");
      }
    },
  });

  const { provinces, regencies, districts, villages } = useRegions(formik);

  useEffect(() => {
    if (address) {
      formik.setValues({
        label: address.label,
        type: address.type,
        receiptName: address.receiptName,
        phone: address.phone,
        address: address.address,
        province: address.province || "",
        city: address.city || "",
        district: address.district || "",
        village: address.village || "",
        notes: address.notes || "",
        isPrimary: address.isPrimary,
      });
      setPosition([address.lat, address.long]);
    } else {
      formik.resetForm();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        });
      }
    }
  }, [address]);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length > 3) {
      setIsSearching(true);
      try {
        const results = await regionService.searchAddress(val);
        setSuggestions(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setPosition([lat, lon]);
    formik.setFieldValue("address", suggestion.display_name);
    setSuggestions([]);
    setSearchQuery("");
    toast.success("Lokasi ditemukan!");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Button>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">
            {address ? "Edit Alamat" : "Tambah Alamat Baru"}
          </h3>
          <p className="text-slate-400 mt-1 font-medium">Lengkapi detail alamat pengiriman Anda.</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Label Alamat</Label>
                  <Input 
                    {...formik.getFieldProps("label")} 
                    className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                    placeholder="Contoh: Rumah Saya" 
                  />
                  {formik.touched.label && formik.errors.label && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.label as string}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Tipe Alamat</Label>
                  <Input 
                    {...formik.getFieldProps("type")} 
                    className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                    placeholder="Contoh: Rumah" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-500 ml-1">Nama Penerima</Label>
                <Input 
                  {...formik.getFieldProps("receiptName")} 
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                />
                {formik.touched.receiptName && formik.errors.receiptName && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.receiptName as string}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-500 ml-1">Nomor Telepon</Label>
                <Input 
                  {...formik.getFieldProps("phone")} 
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                />
                {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.phone as string}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Provinsi</Label>
                  <Combobox 
                    options={provinces.map(p => ({ value: p.code, label: p.name }))}
                    value={formik.values.province}
                    onValueChange={(val: string) => {
                      formik.setFieldValue("province", val);
                      formik.setFieldValue("city", "");
                      formik.setFieldValue("district", "");
                      formik.setFieldValue("village", "");
                    }}
                    placeholder="Pilih Provinsi"
                  />
                  {formik.touched.province && formik.errors.province && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.province as string}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Kota / Kabupaten</Label>
                  <Combobox 
                    options={regencies.map(r => ({ value: r.code, label: r.name }))}
                    value={formik.values.city}
                    onValueChange={(val: string) => {
                      formik.setFieldValue("city", val);
                      formik.setFieldValue("district", "");
                      formik.setFieldValue("village", "");
                    }}
                    placeholder="Pilih Kota"
                    disabled={!formik.values.province}
                  />
                  {formik.touched.city && formik.errors.city && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.city as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Kecamatan</Label>
                  <Combobox 
                    options={districts.map(d => ({ value: d.code, label: d.name }))}
                    value={formik.values.district}
                    onValueChange={(val: string) => {
                      formik.setFieldValue("district", val);
                      formik.setFieldValue("village", "");
                    }}
                    placeholder="Pilih Kecamatan"
                    disabled={!formik.values.city}
                  />
                  {formik.touched.district && formik.errors.district && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.district as string}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 ml-1">Kelurahan / Desa</Label>
                  <Combobox 
                    options={villages.map(v => ({ value: v.code, label: v.name }))}
                    value={formik.values.village}
                    onValueChange={(val: string) => formik.setFieldValue("village", val)}
                    placeholder="Pilih Kelurahan"
                    disabled={!formik.values.district}
                  />
                  {formik.touched.village && formik.errors.village && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.village as string}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-500 ml-1">Alamat Lengkap</Label>
                <Input 
                  {...formik.getFieldProps("address")} 
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                  placeholder="Nama jalan, nomor rumah, blok, dll"
                />
                {formik.touched.address && formik.errors.address && <p className="text-red-500 text-xs ml-1 font-bold">{formik.errors.address as string}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-500 ml-1">Catatan (Opsional)</Label>
                <Input 
                  {...formik.getFieldProps("notes")} 
                  className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-teal-500/20 font-bold text-slate-700" 
                  placeholder="Contoh: Warna pagar hijau" 
                />
              </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between ml-1">
              <Label className="text-sm font-bold text-slate-500">Pilih Lokasi di Peta</Label>
            </div>
            
            <div className="relative group">
              <div className="absolute top-4 left-4 right-4 z-[1001] space-y-2 pointer-events-none">
                <div className="relative pointer-events-auto">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Cari lokasi atau alamat..."
                    className="h-14 w-full pl-12 pr-6 bg-white/90 backdrop-blur-md border-none rounded-2xl shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-4">
                      <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto pointer-events-auto">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-5 py-4 hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-none"
                      >
                        <MapPin className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-tight">{s.display_name.split(',')[0]}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1 line-clamp-1">{s.display_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-[450px] w-full rounded-[40px] overflow-hidden border-2 border-slate-50 relative z-10">
                <AddressMap 
                  position={position} 
                  onPositionChange={setPosition} 
                  addressLabel={formik.values.address}
                />
              </div>


            </div>

            <div className="flex items-center justify-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Klik pada peta atau gunakan kolom pencarian</p>
            </div>
            
            <div className="bg-slate-50 rounded-[32px] p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="isPrimary" className="text-sm font-bold text-slate-700 cursor-pointer">Alamat Utama</Label>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Gunakan sebagai alamat pengiriman default</p>
              </div>
              <input 
                type="checkbox" 
                id="isPrimary" 
                checked={formik.values.isPrimary}
                onChange={(e) => formik.setFieldValue("isPrimary", e.target.checked)}
                className="h-6 w-6 rounded-lg border-slate-200 text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50 flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="h-16 px-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-xl shadow-teal-100 transition-all duration-300"
          >
            {isLoading ? "Menyimpan..." : (address ? "Simpan Perubahan" : "Simpan Alamat")}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose} 
            className="h-16 px-12 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
};
