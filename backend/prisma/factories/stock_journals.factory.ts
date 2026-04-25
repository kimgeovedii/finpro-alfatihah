import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { TransactionType, ReferenceType } from "@prisma/client"
import { BranchInventoryService } from "../../src/features/inventories/services/branchInventory.service"

class StockJournalsFactory {
    private branchInventoryService: BranchInventoryService;

    constructor() {
        this.branchInventoryService = new BranchInventoryService();
    }

    private async findRandomBranchInventory() {
        const { meta } = await this.branchInventoryService.findAllBranchInventories({}, 1, 1);
        if (meta.total === 0) return null;

        const skip = Math.floor(Math.random() * meta.total);
        const { data } = await this.branchInventoryService.findAllBranchInventories({}, skip + 1, 1);
        
        return data[0];
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

    private getRandomTransactionType = (): TransactionType => {
        const types = [TransactionType.IN, TransactionType.OUT]
        return faker.helpers.arrayElement(types)
    }

    private getRandomReferenceType = (): ReferenceType => {
        const types = [ReferenceType.ORDER, ReferenceType.MANUAL, ReferenceType.MUTATION]
        return faker.helpers.arrayElement(types)
    }

    public create = async () => {
        // Get random branch inventory
        const branchInventory = await this.findRandomBranchInventory()
        if (!branchInventory) throw new Error('Cannot create stock journal without branch inventory')

        // Get random employee
        const employee = await this.findRandomEmployee()
        if (!employee) throw new Error('Cannot create stock journal without employee')

        const transactionType = this.getRandomTransactionType()
        const referenceType = this.getRandomReferenceType()

        // Generate quantity change based on transaction type
        const quantityChange = transactionType === TransactionType.IN
            ? faker.number.int({ min: 5, max: 100 })
            : -faker.number.int({ min: 1, max: 50 })

        // Generate stock before and after
        const stockBefore = branchInventory.currentStock
        const stockAfter = Math.max(0, stockBefore + quantityChange)

        // Optional notes
        const noteOptions = [
            'Incoming shipment',
            'Manual adjustment',
            'Stock take discrepancy',
            'Transfer adjustment',
            'Damage adjustment',
            'Expiry adjustment',
            'System correction'
        ]
        const notes = Math.random() < 0.6 ? faker.helpers.arrayElement(noteOptions) : null

        return prisma.stock_journals.create({
            data: {
                id: faker.string.uuid(),
                branchInventoryId: branchInventory.id,
                productId: branchInventory.productId,
                transactionType,
                quantityChange,
                stockBefore,
                stockAfter,
                referenceType,
                orderId: referenceType === ReferenceType.ORDER ? null : undefined,
                mutationId: referenceType === ReferenceType.MUTATION ? null : undefined,
                notes,
                createdBy: employee.id,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdJournals = []
        for (let i = 0; i < count; i++) {
            const journal = await this.create()
            createdJournals.push(journal)
        }
        return createdJournals
    }
}

export default StockJournalsFactory
