import * as Yup from "yup";

export const locationSchema = Yup.object({
  lat: Yup.number().min(-90).max(90).required("Latitude is required"),
  lng: Yup.number().min(-180).max(180).required("Longitude is required"),
});
