import { prisma } from "../../../config/prisma";

export class EmployeeRepository {
    async findEmployeeByBranchId(branchId: string) {
        return await prisma.employee.findMany({
            where: { 
                branchId, role: 'STORE_ADMIN'
            },
            select: {
                user: {
                    select: { email: true, username: true }
                }
            }
        })
    }
}