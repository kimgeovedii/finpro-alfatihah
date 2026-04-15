import { Prisma } from "@prisma/client";
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
          id: true, orderNumber: true, createdAt: true, status: true, totalPrice: true, finalPrice: true, shippingCost: true, paymentDeadline: true, items: {
            select: {
              quantity: true, product: {                 
                select: {
                  product: {          
                    select: { productName: true }
                  }
                }
              }
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
      select: { id: true, orderNumber: true }
    })
  } 

  deleteOrder = async (id: string) => prisma.orders.delete({ where: { id } })
}
