import { prisma } from "../../../config/prisma";

export class EmployeeRepository {
    async findEmployeeByBranchId(branchId: string) {
        return await prisma.employee.findFirst({
            where: { 
                branchId, role: 'STORE_ADMIN'
            },
            select: {
                id: true, fullName: true, user: {
                    select: { email: true }
                }
            }
        })
    }
}