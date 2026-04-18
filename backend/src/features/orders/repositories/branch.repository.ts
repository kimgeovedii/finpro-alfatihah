import { EmployeeRole, OrderStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class BranchRepository {
    async findById(branchId: string) {
        return await prisma.branch.findFirst({
            where: { id: branchId },
            select: {
                address: true, latitude: true, longitude: true, maxDeliveryDistance: true, city: true
            }
        })
    }

    async findBranchsOrders() {
        return await prisma.branch.findMany({
            select: {
                storeName: true, schedules: {
                    select: {
                        startTime: true, endTime: true, dayName: true
                    }
                },
                orders: {
                    where: {
                        status: {
                            in: [ OrderStatus.WAITING_PAYMENT_CONFIRMATION, OrderStatus.PROCESSING ]
                        }
                    },
                    orderBy: [
                        { status: 'asc' }, { confirmedAt: 'asc' }, { createdAt: 'asc' }
                    ],
                    select: {
                        orderNumber: true, createdAt: true, confirmedAt: true, status: true, user: {
                            select: {
                                email: true, username: true
                            }
                        }
                    }
                },
                employees: {
                    where: {
                        role: EmployeeRole.STORE_ADMIN
                    },
                    select: {
                        fullName: true, user: {
                            select: { username: true, email: true }
                        }
                    }
                }
            }
        })
    }
}