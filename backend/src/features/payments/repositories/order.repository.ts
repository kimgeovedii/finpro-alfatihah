import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class OrderRepository {
  async findById(id: string, status: OrderStatus) {
    return await prisma.orders.findFirst({
      where: { id, status, 
        payments: {
          every: { method: "MANUAL" }
        } 
      },
      select: {
        orderNumber: true, paymentDeadline: true, branchId: true, finalPrice: true, payments: {
          select: { id: true }
        }, 
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

  async updateOrderStatusById(id: string, status: OrderStatus) {
    return await prisma.orders.update({
      where: { id },
      data: { status, ...(status === "CANCELLED" && { rejectedAt: new Date() }) }
    })
  }
}
