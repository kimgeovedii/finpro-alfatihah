import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { AddressService } from "../services/address.service";
import { AddressRepository } from "../repositories/address.repository";
import { authMiddleware } from "../../../middleware/auth.middleware";

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.router = Router();
    const addressRepository = new AddressRepository();
    const addressService = new AddressService(addressRepository);
    this.addressController = new AddressController(addressService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/regions/:type", this.addressController.getRegions);
    this.router.get("/regions/:type/:code", this.addressController.getRegions);
    this.router.get("/geocoding/search", this.addressController.searchAddress);
    this.router.get("/geocoding/reverse", this.addressController.reverseGeocode);

    this.router.use(authMiddleware);


    this.router.post("/", this.addressController.createAddress);
    this.router.get("/", this.addressController.getUserAddresses);
    this.router.patch("/:id", this.addressController.updateAddress);
    this.router.delete("/:id", this.addressController.deleteAddress);
    this.router.patch("/:id/primary", this.addressController.setPrimaryAddress);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AddressRouter().getRouter();
