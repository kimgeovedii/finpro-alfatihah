import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class OrderRepository {
  async findById(id: string, status: OrderStatus) {
    return await prisma.orders.findFirst({
      where: { id, status, 
        payments: {
          every: {
            status: PaymentStatus.PENDING, method: "MANUAL"
          }
        } 
      },
      select: {
        paymentDeadline: true, branchId: true, finalPrice: true, payments: {
          select: { id: true }
        }
      }
    })
  }

  async updateOrderStatusById(id: string, status: OrderStatus) {
    return await prisma.orders.update({
      where: { id },
      data: { status }
    })
  }
}
