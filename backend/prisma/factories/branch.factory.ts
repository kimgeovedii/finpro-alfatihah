import { prisma } from "../../src/config/prisma"
import { branchSeedData } from "../../src/constants/seed.const"
import { randomSchedule } from "../../src/utils/generator"

class BranchFactory {
    public createAll = async () => {
        const createdBranches = []

        for (const branchData of branchSeedData) {
            // Create branch
            const storeName = branchData.storeName
            const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

            const branch = await prisma.branch.create({
                data: {
                    storeName,
                    slug, 
                    address: branchData.address,
                    latitude: branchData.latitude,
                    longitude: branchData.longitude,
                    maxDeliveryDistance: branchData.maxDeliveryDistance,
                    isActive: true,
                    city: branchData.city,
                    province: branchData.province,
                },
            })

            // Create 6-day schedule (one random day off)
            const { activeDays, startTime, endTime } = randomSchedule()

            await prisma.branchSchedule.createMany({
                data: activeDays.map((dayName) => ({
                    branchId: branch.id,
                    startTime,
                    endTime,
                    dayName,
                })),
            })

            createdBranches.push(branch)
        }

        return createdBranches
    }
}

export default BranchFactory