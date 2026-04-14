import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { MutationStatus } from "@prisma/client"

class MutationJournalsFactory {
    private async findRandomProduct() {
        const count = await prisma.products.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.products.findFirst({
            skip,
            select: { id: true }
        })
    }

    private async findRandomEmployee() {
        const count = await prisma.employee.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.employee.findFirst({
            skip,
            select: { id: true }
        })
    }

    private async findRandomBranches() {
        const branches = await prisma.branch.findMany({
            select: { id: true }
        })

        if (branches.length < 2) return null

        // Get two different branches
        const source = faker.helpers.arrayElement(branches)
        let destination = faker.helpers.arrayElement(branches)
        
        while (destination.id === source.id && branches.length > 1) {
            destination = faker.helpers.arrayElement(branches)
        }

        return { source, destination }
    }

    private getRandomMutationStatus = (): MutationStatus => {
        const statuses = [MutationStatus.PENDING, MutationStatus.PROCESSING, MutationStatus.SHIPPED, MutationStatus.RECEIVED, MutationStatus.CANCELLED]
        return faker.helpers.arrayElement(statuses)
    }

    public create = async () => {
        // Get random product
        const product = await this.findRandomProduct()
        if (!product) throw new Error('Cannot create mutation journal without product')

        // Get random employee
        const employee = await this.findRandomEmployee()
        if (!employee) throw new Error('Cannot create mutation journal without employee')

        // Get two different branches
        const branches = await this.findRandomBranches()
        if (!branches) throw new Error('Cannot create mutation journal without at least 2 branches')

        const status = this.getRandomMutationStatus()

        // Generate quantity (5-200 units)
        const quantity = faker.number.int({ min: 5, max: 200 })

        // Optional notes
        const noteOptions = [
            'Inter-branch transfer',
            'Stock redistribution',
            'Branch optimization',
            'Inventory balance',
            'Stock level adjustment'
        ]
        const notes = Math.random() < 0.5 ? faker.helpers.arrayElement(noteOptions) : null

        const today = new Date()
        const createdAt = faker.date.past({ years: 1 })
        const updatedAt = status === MutationStatus.RECEIVED || status === MutationStatus.CANCELLED
            ? new Date(createdAt.getTime() + faker.number.int({ min: 1000 * 60 * 60, max: 1000 * 60 * 60 * 24 * 7 }))
            : createdAt

        return prisma.mutation_journals.create({
            data: {
                id: faker.string.uuid(),
                productId: product.id,
                quantity,
                status,
                notes,
                createdBy: employee.id,
                sourceBranchId: branches.source.id,
                destinationBranchId: branches.destination.id,
                createdAt,
                updatedAt,
            },
        })
    }

    public createMany = async (count: number) => {
        const createdMutations = []
        for (let i = 0; i < count; i++) {
            const mutation = await this.create()
            createdMutations.push(mutation)
        }
        return createdMutations
    }
}

export default MutationJournalsFactory
