import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class CartRepository {
  async findAllCarts(page: number, limit: number, userId: string, branchId: string | null) {
    const skip = (page - 1) * limit

    const where: Prisma.cartsWhereInput = {
      userId,
      ...(branchId && { branchId })
    }

    const [rawData, total] = await Promise.all([
      prisma.carts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, createdAt: true, branchId: true, 
          items: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true, quantity: true, createdAt: true,
              product: {                         
                select: {
                  id: true, currentStock: true, product: {                 
                    select: {
                      productName: true, basePrice: true, category: {
                        select: {
                          name: true, slugName: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          branch: {
            select: {
              id: true, storeName: true
            }
          }
        }
      }),
      prisma.carts.count({ where })
    ])

    const data = branchId ? (rawData[0] ?? null) : rawData

    return { data, total }
  }

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
