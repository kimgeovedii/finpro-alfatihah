import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../../src/config/prisma'
import { userSeedData } from '../../src/constants/seed.const'

class UsersFactory {
    public createAll = async () => {
        const defaultPassword = await bcrypt.hash('password123', 10)
        const createdUsers = []
    
        for (const userData of userSeedData) {
            // Upsert user
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    username: userData.username,
                    password: defaultPassword,
                    role: UserRole[userData.role],
                    emailVerifiedAt: new Date(),
                },
            })
    
            // Create addresses
            await prisma.address.createMany({
                data: userData.addresses.map((addr) => ({
                    userId: user.id,
                    ...addr,
                })),
                skipDuplicates: true,
            })
    
            // Create employee record if admin
            if (userData.role === 'ADMIN' && userData.employee) {
                const branch = await prisma.branch.findFirst({
                    where: {
                        city: { contains: userData.employee.branchCity, mode: 'insensitive' },
                    },
                })
        
                if (!branch) throw new Error(`Branch not found for city "${userData.employee.branchCity}" — make sure branches are seeded before users`)
        
                await prisma.employee.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        fullName: userData.employee.fullName,
                        role: userData.employee.role,
                        branchId: branch.id,
                        userId: user.id,
                    },
                })
            }
    
            createdUsers.push(user)
        }
    
        return createdUsers
    }
}
  
export default UsersFactory