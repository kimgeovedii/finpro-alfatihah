import { Response, Request } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { AddressService } from "../services/address.service";
import { CreateAddressSchema, UpdateAddressSchema } from "../validation/address.dto";
import { sendSuccess, sendError } from "../../../utils/apiResponse";
import axios from "axios";

export class AddressController {
  constructor(private addressService: AddressService) {}

  getRegions = async (req: Request, res: Response) => {
    try {
      const { type, code } = req.params;
      let url = "";
      if (type === "provinces") {
        url = "https://wilayah.id/api/provinces.json";
      } else if (type === "regencies") {
        url = `https://wilayah.id/api/regencies/${code}.json`;
      } else if (type === "districts") {
        url = `https://wilayah.id/api/districts/${code}.json`;
      } else if (type === "villages") {
        url = `https://wilayah.id/api/villages/${code}.json`;
      } else {
        return sendError(res, "Tipe wilayah tidak valid", 400);
      }

      const response = await axios.get(url);
      return res.json(response.data);
    } catch (error: any) {
      return sendError(res, "Gagal mengambil data wilayah dari sumber eksternal", 502);
    }
  };

  createAddress = async (req: AuthRequest, res: Response) => {

    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const validation = CreateAddressSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const address = await this.addressService.createAddress(userId, validation.data);
      return sendSuccess(res, address, "Alamat berhasil ditambahkan", 201);
    } catch (error: any) {
      return sendError(res, error.message || "Gagal menambahkan alamat", 500);
    }
  };

  getUserAddresses = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const addresses = await this.addressService.getUserAddresses(userId);
      return sendSuccess(res, addresses, "Berhasil mengambil daftar alamat");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengambil daftar alamat", 500);
    }
  };

  updateAddress = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const id = req.params.id as string;
      const validation = UpdateAddressSchema.safeParse(req.body);
      if (!validation.success) {
        return sendError(res, "Validasi gagal", 400, validation.error.flatten());
      }

      const address = await this.addressService.updateAddress(id, userId, validation.data);
      return sendSuccess(res, address, "Alamat berhasil diperbarui");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal memperbarui alamat", 500);
    }
  };

  deleteAddress = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const id = req.params.id as string;
      await this.addressService.deleteAddress(id, userId);
      return sendSuccess(res, null, "Alamat berhasil dihapus");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal menghapus alamat", 500);
    }
  };

  setPrimaryAddress = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const id = req.params.id as string;
      await this.addressService.setPrimaryAddress(id, userId);
      return sendSuccess(res, null, "Alamat utama berhasil diubah");
    } catch (error: any) {
      return sendError(res, error.message || "Gagal mengubah alamat utama", 500);
    }
  };

  searchAddress = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) return sendError(res, "Query is required", 400);

      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q,
          format: "json",
          addressdetails: 1,
          countrycodes: "id",
          limit: 5,
        },
        headers: {
          "User-Agent": "Alfatihah-Grocery-App/1.0",
        }
      });
      return res.json(response.data);
    } catch (error: any) {
      console.error("Geocoding proxy error:", error.message);
      return sendError(res, "Gagal mencari alamat", 502);
    }
  };

  reverseGeocode = async (req: Request, res: Response) => {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) return sendError(res, "Lat and Lon are required", 400);

      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon,
          format: "json",
        },
        headers: {
          "User-Agent": "Alfatihah-Grocery-App/1.0",
        }
      });
      return res.json(response.data);
    } catch (error: any) {
      console.error("Reverse geocoding proxy error:", error.message);
      return sendError(res, "Gagal mendapatkan alamat dari koordinat", 502);
    }
  };
}
