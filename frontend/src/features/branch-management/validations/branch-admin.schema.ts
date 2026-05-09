import * as Yup from "yup";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const branchValidationSchema = Yup.object().shape({
  storeName: Yup.string()
    .required("Store name is required")
    .min(3, "Too short")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
  address: Yup.string().required("Address is required").min(5, "Too short"),
  latitude: Yup.number().required("Latitude is required"),
  longitude: Yup.number().required("Longitude is required"),
  maxDeliveryDistance: Yup.number().required("Distance is required").min(0),
  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province is required"),
  district: Yup.string().required("District is required"),
  village: Yup.string().required("Village is required"),
});

export const scheduleValidationSchema = Yup.object().shape({
  dayName: Yup.string().required("Day is required"),
  startTime: Yup.string()
    .required("Start time is required")
    .matches(timeRegex, "Format must be HH:mm"),
  endTime: Yup.string()
    .required("End time is required")
    .matches(timeRegex, "Format must be HH:mm"),
});
