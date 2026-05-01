import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../../src/config/prisma'
import { branchSeedData, userSeedData } from '../../src/constants/seed.const'
import { randomCoordinateNear } from '../../src/utils/generator'

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

            // Resolve branch coordinate for this user's city (customers only)
            if (userData.role === 'CUSTOMER' && userData.addresses && userData.addressCity) {
                const branchRef = branchSeedData.find((b) => b.city.toLowerCase().includes(userData.addressCity!.toLowerCase()))

                if (!branchRef) throw new Error(`No branch seed data found for city "${userData.addressCity}"`)

                // Create addresses with coordinates near the branch
                await prisma.address.createMany({
                    data: userData.addresses.map((addr) => {
                        const { lat, long } = randomCoordinateNear(branchRef.latitude, branchRef.longitude, 5)
                        return {
                            userId: user.id,
                            lat,
                            long,
                            ...addr,
                        }
                    }),
                    skipDuplicates: true,
                })
            }

            // Create employee record if admin
            if (userData.role === 'EMPLOYEE' && userData.employee) {
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