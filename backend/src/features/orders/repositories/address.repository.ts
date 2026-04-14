import { prisma } from "../../../config/prisma";

export class AddressRepository {
    async findById(addressId: string) {
        return await prisma.address.findFirst({
            where: { id: addressId },
            select: {
                userId: true, address: true, lat: true, long: true,
            }
        })
    }
}