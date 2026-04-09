import { prisma } from "../../../config/prisma";

export class ProductRepository {
  async findRandomProduct(branchId: string) {
    const where = {
      branchInventories: {
        some: { branchId: branchId }
      }
    }

    const count = await prisma.products.count({ where })
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return prisma.products.findFirst({
      where,
      skip,
      select: { id: true }
    })
  }
}
