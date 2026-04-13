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

  async createOrder(userId: string, branchId: string, addressId: string, totalPrice: number, finalPrice: number, shippingCost: number,
    items: Array<{ product: { id: string; product: { basePrice: number } }; quantity: number; discountId?: string | null }>) {
    
    const paymentDeadlineTime = new Date(Date.now() + paymentDeadline) // 1 hour from now
    const orderNumber = `${orderCode}-${Date.now()}`

    return await prisma.orders.create({
      data: {
        orderNumber,
        userId: userId,
        branchId: branchId,
        addressId: addressId,
        status: 'WAITING_PAYMENT',
        totalPrice: totalPrice,
        finalPrice: finalPrice,
        shippingCost: shippingCost,
        paymentDeadline: paymentDeadlineTime,
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
