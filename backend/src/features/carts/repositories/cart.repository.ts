import { prisma } from "../../../config/prisma";

export class CartRepository {
  async findRandomCart() {
    const count = await prisma.carts.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return prisma.carts.findFirst({ 
      skip, 
      select: { id: true }
    })
  }
}
