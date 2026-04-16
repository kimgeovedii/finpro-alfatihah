import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class OrderRepository {
  async findById(id: string, status: OrderStatus) {
    return await prisma.orders.findFirst({
      where: { id, status, 
        payments: {
          every: {
            status: PaymentStatus.PENDING
          }
        } 
      },
      select: {
        paymentDeadline: true, branchId: true
      }
    })
  }
}
