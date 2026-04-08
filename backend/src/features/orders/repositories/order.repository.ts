import { prisma } from "../../../config/prisma";

export class OrderRepository {
  async findRandomOrder() {
    const count = await prisma.orders.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return prisma.orders.findFirst({ 
      skip, 
      select: { id: true, status: true, branchId: true }
    })
  }
}
