import { DiscountType, OrderStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { orderAutoConfirmLimitHour, orderCode, paymentDeadline } from "../../../constants/business.const";
import { getDistanceInKm } from "../../../utils/location";
import { calculateDiscount, getStoreOpenStatus } from "../../../utils/business";

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

  async getOrderSummarByBranchId(branchId: string | null) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [ currentRevenueAgg, lastRevenueAgg, activeShipments, processingOrder, finishedOrder, finishedOrderLastMonth ] = await Promise.all([
      prisma.orders.aggregate({
        where: {
          ...(branchId && { branchId }),
          status: 'CONFIRMED',
          createdAt: { gte: startOfMonth }
        },
        _sum: { finalPrice: true }
      }),
      prisma.orders.aggregate({
        where: {
          ...(branchId && { branchId }),
          status: 'CONFIRMED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { finalPrice: true }
      }),
      prisma.orders.count({
        where: { status: 'SHIPPED', ...(branchId && { branchId }), } 
      }),
      prisma.orders.count({
        where: { status: 'PROCESSING', ...(branchId && { branchId }), }
      }),
      prisma.orders.count({
        where: { status: 'CONFIRMED', ...(branchId && { branchId }), }
      }),
      prisma.orders.count({
        where: {
          ...(branchId && { branchId }),
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

  async findOrderById(contextId: string, contextTarget: "orderId" | "orderNumber") {
    const where = contextTarget === "orderId" ? { id: contextId } : { orderNumber: contextId }

    return await prisma.orders.findFirst({
      where,
      select: {
        id: true, userId: true, status: true, branchId: true,
        items: {
          select: {
            productId: true, quantity: true, product: {
              select: { id: true }
            }
          }
        }
      }
    })
  }

  async findOrderDetailByOrderNumber(role: UserRole, userId: string, orderNumber: string) {
    if (role === "CUSTOMER") {
      const order = await prisma.orders.findFirst({
        where: { orderNumber, userId },
        select: {
          id: true, orderNumber: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, paymentDeadline: true, shippedAt: true, confirmedAt: true, rejectedAt: true, createdAt: true,
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
              id: true, quantity: true, price: true, product: {
                select: {
                  currentStock: true, product: {
                    select: {
                      productName: true, weight: true, slugName: true,
                      category: {
                        select: { name: true }
                      },
                      productImages: {
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

      if (!order) return null

      // Count summary for total price & qty
      const { totalWeight } = order.items.reduce((ord, item) => {
        const weight = item.product.product.weight || 0
        const qty = item.quantity || 0

        ord.totalWeight += weight * qty
        
        return ord
      }, { totalBasePrice: 0, totalQty: 0, totalWeight: 0 })

      const openStatus = getStoreOpenStatus(order.branch.schedules)

      return { ...order, totalWeight, branch: { ...order.branch, openStatus } }
    } else {
      const order = await prisma.orders.findFirst({
        where: { orderNumber },
        select: {
          orderNumber: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, shippedAt: true, confirmedAt: true, rejectedAt: true, createdAt: true,
          branch: {
            select: { id: true, storeName: true, address: true, city: true, latitude: true, longitude: true }
          },
          address: {
            select: {
              label: true, type: true, receiptName: true, notes: true, phone: true, address: true, lat: true, long: true
            }
          },
          items: {
            select: {
              id: true, quantity: true, product: {
                select: {
                  currentStock: true, product: {
                    select: {
                      productName: true, description: true, basePrice: true, weight: true, productImages: {
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

      if (!order) return null

      let distance = 0
      if (order.branch?.latitude && order.branch?.longitude && order.address?.lat && order.address?.long) {
        distance = getDistanceInKm(order.branch.latitude, order.branch.longitude, order.address.lat, order.address.long)
      }

      return { ...order, distance }
    }
  }

  async isMatchingQuantityStock(orderNumber: string) {
    const items = await prisma.orders.findFirst({
      where: { orderNumber },
      select: {
        items: {
          select: {
            quantity: true, product: {
              select: { currentStock: true }
            }
          }
        }
      }
    })

    if (!items) return false

    return items.items.every(dt => dt.quantity <= (dt.product?.currentStock ?? 0))
  }

  async updateOrderStatusById(orderNumber: string, status: OrderStatus) {
    return await prisma.$transaction(async (tx) => {
      await tx.orders.updateMany({
        where: { orderNumber },
        data: { status, 
          ...(status === "CANCELLED" && { rejectedAt: new Date() }), 
          ...(status === "SHIPPED" && { shippedAt: new Date() }) ,
          ...(status === "CONFIRMED" && { confirmedAt: new Date() })} 
      })
  
      const order = await tx.orders.findFirst({
        where: { orderNumber },
        orderBy: { createdAt: 'desc' }, 
        select: {
          id: true, user: {
            select: {
              id: true, username: true, email: true
            }
          }
        }
      })
  
      return order
    })
  }

  async findAllOrders(page: number, limit: number, userId: string, branchId: string | null, orderNumber: string | null, dateStart: string | null, dateEnd: string | null) {
    const skip = (page - 1) * limit

    const where: Prisma.ordersWhereInput = {
      userId,
      ...(branchId && { branchId }),
      ...(orderNumber && {
        orderNumber: {
          contains: orderNumber, mode: "insensitive"
        }
      }),
      ...(dateStart && dateEnd && {
        createdAt: {
          gte: new Date(dateStart), lte: new Date(dateEnd)
        }
      })
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
      const productList = order.items.map(dt => dt.product.product.productName).join(', ')
      const { items, ...rest } = order

      return { ...rest, totalItems, productList }
    })

    const data = branchId ? (mapped[0] ?? null) : mapped

    return { data, total }
  }

  async findAllOrdersByBranchId(page: number, limit: number, branchId: string | null, status: OrderStatus | null, search: string | null) {
    const skip = (page - 1) * limit

    // Filter by branch & status
    const filters: Prisma.ordersWhereInput[] = []
    if (branchId) filters.push({ branchId })
    if (status) filters.push({ status })
    if (search) {
      filters.push({
        OR: [
          {
            orderNumber: {
              contains: search, mode: 'insensitive'
            }
          },
          {
            user: {
              email: {
                contains: search, mode: 'insensitive'
              }
            }
          },
          {
            user: {
              username: {
                contains: search, mode: 'insensitive'
              }
            }
          },
          {
            branch: {
              storeName: {
                contains: search, mode: 'insensitive'
              }
            }
          }
        ]
      })
    }

    const where: Prisma.ordersWhereInput = {
      AND: filters
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
          },
          branch: {
            select: { storeName: true }
          }
        }
      }),
      prisma.orders.count({ where })
    ])

    return { data, total }
  }

  async createOrder(userId: string, branchId: string, addressId: string, totalPrice: number, finalPrice: number, shippingCost: number,
    items: Array<{ 
      product: { 
        id: string; product: { 
          basePrice: number; productDiscounts?: { 
          discount: { 
            discountType: string; discountValue: number; discountValueType: string; maxDiscountAmount?: number | null; minPurchaseAmount?: number | null 
          } }[] 
        } }; 
      quantity: number; }>) {
    
    const paymentDeadlineTime = new Date(Date.now() + paymentDeadline) // 1 hour from now
    const orderNumber = `${orderCode}-${Date.now()}`

    return await prisma.orders.create({
      data: {
          orderNumber, userId, branchId, addressId, totalPrice, finalPrice, shippingCost,
          status: 'WAITING_PAYMENT', paymentDeadline: paymentDeadlineTime,
          items: {
            create: items.flatMap(dt => {
              const basePrice = dt.product.product.basePrice
              const quantity = dt.quantity
              const discount = dt.product.product.productDiscounts?.[0]?.discount

              // Discount calculation
              const discountAmount = discount ? calculateDiscount(discount.discountType, discount.discountValueType, discount.discountValue, quantity, basePrice, discount.minPurchaseAmount, discount.maxDiscountAmount) : 0
              const discountPerItem = quantity > 0 ? Math.floor(discountAmount / quantity) : 0
              const finalPricePerItem = Math.max(0, basePrice - discountPerItem)

              const result = [
                {
                  productId: dt.product.id,
                  price: finalPricePerItem,
                  quantity: quantity
                }
              ]

              // Extra one
              if (discount?.discountType === DiscountType.BUY_ONE_GET_ONE_FREE) {
                result.push({
                  productId: dt.product.id,
                  price: 0,
                  quantity: 1
                })
              }

              return result
            })
          }
      },
      select: { id: true, orderNumber: true, paymentDeadline: true }
    })
  }

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

      const orderIds = orders.map(dt => dt.id)

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

  async confirmOldShippedOrder() {
    const cutoffDate = new Date(Date.now() - orderAutoConfirmLimitHour)
  
    return await prisma.orders.updateMany({
      where: {
        status: "SHIPPED",
        shippedAt: {
          not: null, lt: cutoffDate,
        },
      },
      data: {
        status: "CONFIRMED", confirmedAt: new Date(),
      },
    })
  }

  async getTransactionHistory(userId: string) {
    return await prisma.orders.findMany({
      orderBy: [
        { createdAt: "desc" },
      ],
      where: {
        userId,
        status: {
          in: ["CONFIRMED","SHIPPED"]
        }
      },
      select: {
        createdAt: true, orderNumber: true,
        branch: {
          select: { storeName: true }
        },
        items: {
          select: {
            quantity: true, product: {
              select: {
                product: {
                  select: {
                    productName: true, basePrice: true, category: {
                      select: { name: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}
