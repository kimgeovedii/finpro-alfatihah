import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { orderCode, paymentDeadline } from "../../../constants/business.const";

export class OrderRepository {
  async findRandomOrder() {
    const count = await prisma.orders.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return await prisma.orders.findFirst({ 
      skip, 
      select: { id: true, status: true, branchId: true }
    })
  }

  async getOrderSummary(userId: string) {
    // Group orders by status
    const groupedOrders = await prisma.orders.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true }
    })

    // Sum all final price and total price 
    const priceAggregate = await prisma.orders.aggregate({
      where: { userId, status: 'CONFIRMED' },
      _sum: {
        finalPrice: true,
        totalPrice: true
      }
    })

    // Count total order per status
    const ordersByStatus = groupedOrders.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id
      return acc
    }, {} as Record<string, number>)

    return {
      ordersByStatus,
      totalFinalPrice: priceAggregate._sum.finalPrice ?? 0,
      totalPrice: priceAggregate._sum.totalPrice ?? 0,
    }
  }

  async getOrderSummarByBranchId(userId: string, branchId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [ currentRevenueAgg, lastRevenueAgg, activeShipments, processingOrder, finishedOrder, finishedOrderLastMonth ] = await Promise.all([
      prisma.orders.aggregate({
        where: {
          userId,
          branchId,
          status: 'CONFIRMED',
          createdAt: { gte: startOfMonth }
        },
        _sum: { finalPrice: true }
      }),
      prisma.orders.aggregate({
        where: {
          userId,
          branchId,
          status: 'CONFIRMED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { finalPrice: true }
      }),
      prisma.orders.count({
        where: { userId, status: 'SHIPPED', branchId } 
      }),
      prisma.orders.count({
        where: { userId, status: 'PROCESSING', branchId }
      }),
      prisma.orders.count({
        where: { userId, status: 'CONFIRMED', branchId }
      }),
      prisma.orders.count({
        where: {
          userId,
          branchId,
          status: 'CONFIRMED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
      })
    ])

    const totalRevenue = currentRevenueAgg._sum.finalPrice ?? 0
    const lastRevenue = lastRevenueAgg._sum.finalPrice ?? 0
    const revenueChangePercent = lastRevenue === 0 ? 100 : ((totalRevenue - lastRevenue) / lastRevenue) * 100

    return { totalRevenue, revenueChangePercent, activeShipments, processingOrder, finishedOrder, finishedOrderLastMonth }
  }  

  async findOrderById(orderId: string) {
    return await prisma.orders.findFirst({
      where: { id: orderId },
      select: {
        id: true, userId: true,
        items: {
          select: {
            productId: true, quantity: true,
          }
        }
      }
    })
  }

  async findOrderDetailByOrderNumber(userId: string | null, orderNumber: string) {
    if (userId) {
      return await prisma.orders.findFirst({
        where: { orderNumber, userId },
        select: {
          orderNumber: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, paymentDeadline: true, shippedAt: true, confirmedAt: true, rejectedAt: true, createdAt: true,
          branch: {
            select: {
              id: true, storeName: true, address: true, city: true, schedules: {
                select: {
                  startTime: true, endTime: true, dayName: true
                }
              }
            }
          },
          address: {
            select: {
              label: true, type: true, receiptName: true, notes: true, phone: true, address: true
            }
          },
          items: {
            select: {
              id: true, quantity: true, product: {
                select: {
                  product: {
                    select: {
                      productName: true, description: true, basePrice: true, productImages: {
                        select: { imageUrl: true },
                        where: { isPrimary: true }
                      }
                    }
                  }
                }
              }
            }
          },
          payments: {
            select: {
              method: true, status: true, approvedAt: true, evidence: true, rejectedAt: true
            }
          }
        }
      })
    } else {
      return await prisma.orders.findFirst({
        where: { orderNumber },
        select: {
          orderNumber: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, shippedAt: true, confirmedAt: true, rejectedAt: true, createdAt: true,
          branch: {
            select: { id: true, storeName: true, address: true }
          },
          address: {
            select: {
              label: true, type: true, receiptName: true, notes: true, phone: true, address: true
            }
          },
          items: {
            select: {
              id: true, quantity: true, product: {
                select: {
                  currentStock: true, product: {
                    select: {
                      productName: true, description: true, basePrice: true, productImages: {
                        select: { imageUrl: true },
                        where: { isPrimary: true }
                      }
                    }
                  }
                }
              }
            }
          },
          payments: {
            select: {
              method: true, status: true, approvedAt: true, evidence: true, rejectedAt: true
            }
          }
        }
      })
    }
  }

  async findAllOrders(page: number, limit: number, userId: string, branchId: string | null) {
    const skip = (page - 1) * limit

    const where: Prisma.ordersWhereInput = {
      userId,
      ...(branchId && { branchId })
    }

    const [rawData, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, orderNumber: true, createdAt: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, paymentDeadline: true, 
          items: {
            select: {
              quantity: true, product: {                 
                select: {
                  product: {          
                    select: { productName: true }
                  }
                }
              }
            }
          }, 
          payments: {
            select: { 
              evidence: true, method: true, status: true 
            }
          }
        }
      }),
      prisma.orders.count({ where })
    ])

    // Sum quantity & combine product name
    const mapped = rawData.map(order => {
      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
      const productList = order.items.map(item => item.product.product.productName).join(', ')
      const { items, ...rest } = order

      return { ...rest, totalItems, productList }
    })

    const data = branchId ? (mapped[0] ?? null) : mapped

    return { data, total }
  }

  async findAllOrdersByBranchId(page: number, limit: number, branchId: string, status: OrderStatus | null) {
    const skip = (page - 1) * limit
    const where: Prisma.ordersWhereInput = { 
      branchId,
      ...(status && { status })
    }

    const [data, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, orderNumber: true, createdAt: true, status: true, finalPrice: true, 
          payments: {
            select: { 
              id: true, evidence: true, method: true, status: true 
            }
          },
          user: {
            select: {
              username: true, email: true
            }
          }
        }
      }),
      prisma.orders.count({ where })
    ])

    return { data, total }
  }

  async createOrder(userId: string, branchId: string, addressId: string, totalPrice: number, finalPrice: number, shippingCost: number,
    items: Array<{ product: { id: string; product: { basePrice: number } }; quantity: number; discountId?: string | null }>) {
    
    const paymentDeadlineTime = new Date(Date.now() + paymentDeadline) // 1 hour from now
    const orderNumber = `${orderCode}-${Date.now()}`

    return await prisma.orders.create({
      data: {
        orderNumber, userId, branchId, addressId, totalPrice, finalPrice, shippingCost,
        status: 'WAITING_PAYMENT', paymentDeadline: paymentDeadlineTime,
        items: {
          create: items.map(item => ({
            productId: item.product.id,
            discountId: item.discountId ?? null,
            price: item.product.product.basePrice,
            quantity: item.quantity,
          }))
        }
      },
      select: { id: true, orderNumber: true, paymentDeadline: true }
    })
  } 

  deleteOrder = async (id: string) => prisma.orders.delete({ where: { id } })

  async cancelExpiredUnpaidOrders() {
    const now = new Date()

    return await prisma.$transaction(async (tx) => {
      const orders = await tx.orders.findMany({
        where: {
          status: 'WAITING_PAYMENT', paymentDeadline: { lt: now },
          payments: {
            some: {
              method: 'MANUAL', evidence: null
            }
          }
        },
        select: { id: true }
      })

      if (!orders.length) return 0

      const orderIds = orders.map(o => o.id)

      await tx.payments.updateMany({
        where: {
          orderId: { in: orderIds },
          method: 'MANUAL',
          evidence: null
        },
        data: {
          status: 'REJECTED', rejectedAt: now
        }
      })

      await tx.orders.updateMany({
        where: {
          id: { in: orderIds }
        },
        data: {
          status: 'CANCELLED', rejectedAt: now
        }
      })

      return orderIds.length
    })
  }
}
