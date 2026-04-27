import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class CartRepository {
  async getCartSummary(userId: string, branchId: string | null) {
    const carts = await prisma.carts.findMany({
      where: {
        userId,
        ...(branchId && { branchId })
      },
      select: {
        items: {
          select: {
            quantity: true
          }
        }
      }
    })

    // Sum qty from all cart items
    const allItems = carts.flatMap(cart => cart.items)
    const totalItems = allItems.length
    const totalQty = allItems.reduce((sum, item) => sum + item.quantity, 0)

    return { totalItems, totalQty }
  }

  async findCartById(userId: string, cartId: string) {
    const cart = await prisma.carts.findFirst({
      where: { id: cartId, userId},
      select: {
        branch: {
          select: {
            storeName: true, latitude: true, longitude: true, address: true, maxDeliveryDistance: true, schedules: {
              select: {
                startTime: true, endTime: true, dayName: true
              }
            }
          }
        },
        items: {
          orderBy: {
            product: {
              product: { productName: 'asc' }
            }
          },
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                product: {
                  select: {
                    productName: true, description: true, category: true, basePrice: true, productImages: {
                      select: { imageUrl: true },
                      where: { isPrimary: true }
                    }
                  }
                }
              }
            }
          }
        },
        user: {
          select: {
            addresses: {
              select: {
                id: true, address: true, lat: true, type: true, label: true, receiptName: true, phone: true, long: true, isPrimary: true
              }
            }
          }
        }
      }
    })

    if (!cart) return null

    // Count summary for total price & qty
    const { totalBasePrice, totalQty  } = cart.items.reduce((acc, item) => {
      const price = item.product.product.basePrice || 0
      const qty = item.quantity || 0

      acc.totalBasePrice += price * qty
      acc.totalQty += qty
      
      return acc
    }, { totalBasePrice: 0, totalQty: 0 })

    return { ...cart, totalBasePrice, totalQty }
  }

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
                      productName: true, slugName: true, basePrice: true, description: true, category: {
                        select: {
                          name: true, slugName: true,
                        }
                      },
                      productImages: {
                        select: { imageUrl: true },
                        where: { isPrimary: true },
                        take: 1
                      }
                    }
                  }
                }
              }
            }
          },
          branch: {
            select: {
              id: true, storeName: true, city: true
            }
          }
        }
      }),
      prisma.carts.count({ where })
    ])

    const data = branchId ? (rawData[0] ?? null) : rawData

    return { data, total }
  }

  async findAllCartsCron(maxDays: number) {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() - maxDays)
  
    return await prisma.carts.findMany({
      where: {
        createdAt: { lte: maxDate },
        items: { some: {} }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true, items: {
          orderBy: { createdAt: 'desc' },
          select: {
            quantity: true, product: {
              select: {
                product: {
                  select: {
                    productName: true, basePrice: true,
                  }
                }
              }
            }
          }
        },
        branch: {
          select: { storeName: true }
        },
        user: {
          select: {
            username: true, email: true
          }
        }
      }
    })
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

  async findByIdAndUser(cartId: string, userId: string) {
    return await prisma.carts.findFirst({
      where: { id: cartId, userId },
      select: {
        items: true
      }
    })
  }

  deleteCartById = async (id: string) => prisma.carts.delete({ where: { id } })
}
