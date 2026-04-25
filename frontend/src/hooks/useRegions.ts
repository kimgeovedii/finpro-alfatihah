import { useState, useEffect } from "react";
import { regionService, Region } from "@/services/region.service";

export const useRegions = (formik: any) => {
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  useEffect(() => {
    regionService.getProvinces().then(setProvinces).catch(console.error);
  }, []);

  useEffect(() => {
    if (formik.values.province) {
      const prov = provinces.find(p => p.name === formik.values.province);
      if (prov) {
        regionService.getRegencies(prov.code).then(setRegencies).catch(console.error);
      }
    } else {
      setRegencies([]);
    }
  }, [formik.values.province, provinces]);

  useEffect(() => {
    if (formik.values.city) {
      const reg = regencies.find(r => r.name === formik.values.city);
      if (reg) {
        regionService.getDistricts(reg.code).then(setDistricts).catch(console.error);
      }
    } else {
      setDistricts([]);
    }
  }, [formik.values.city, regencies]);

  useEffect(() => {
    if (formik.values.district) {
      const dist = districts.find(d => d.name === formik.values.district);
      if (dist) {
        regionService.getVillages(dist.code).then(setVillages).catch(console.error);
      }
    } else {
      setVillages([]);
    }
  }, [formik.values.district, districts]);

  return { provinces, regencies, districts, villages };
};
