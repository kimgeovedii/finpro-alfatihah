import { prisma } from "../../../config/prisma";

export class CartRepository {
  async findRandomCart() {
    const count = await prisma.carts.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return await prisma.carts.findFirst({ 
      skip, 
      select: { id: true, branchId: true }
    })
  }

  async findByUserAndBranch(userId: string, branchId: string) {
    return await prisma.carts.findFirst({
      where: { userId, branchId }
    })
  }

  async createCart(userId: string, branchId: string) {
    return await prisma.carts.create({
      data: { userId, branchId }
    })
  }
}
