import { AddressRepository } from "../repositories/address.repository";
import { CreateAddressSchema } from "../validation/address.dto";
import { z } from "zod";

export class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  async createAddress(userId: string, data: z.infer<typeof CreateAddressSchema>) {
    const addressCount = await this.addressRepository.countByUserId(userId);
    
    // If it's the first address, or isPrimary is true, handle primary switch
    let isPrimary = data.isPrimary;
    if (addressCount === 0 || isPrimary) {
      await this.addressRepository.unsetPrimary(userId);
      isPrimary = true;
    }

    return this.addressRepository.create({
      ...data,
      isPrimary,
      userId,
    });
  }

  async getUserAddresses(userId: string) {
    return this.addressRepository.findManyByUserId(userId);
  }

  async updateAddress(id: string, userId: string, data: Partial<z.infer<typeof CreateAddressSchema>>) {
    const address = await this.addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new Error("Alamat tidak ditemukan");
    }

    if (data.isPrimary) {
      await this.addressRepository.unsetPrimary(userId);
    }

    return this.addressRepository.update(id, data);
  }

  async deleteAddress(id: string, userId: string) {
    const address = await this.addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new Error("Alamat tidak ditemukan");
    }

    return this.addressRepository.delete(id);
  }

  async setPrimaryAddress(id: string, userId: string) {
    const address = await this.addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new Error("Alamat tidak ditemukan");
    }

    await this.addressRepository.unsetPrimary(userId);
    return this.addressRepository.setPrimary(id);
  }
}
