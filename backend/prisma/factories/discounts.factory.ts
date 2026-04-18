import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { DiscountType, DiscountValueType } from "@prisma/client"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { DiscountService } from "../../src/features/discounts/services/discount.service"

class DiscountsFactory {
    private branchRepository: BranchRepository;
    private discountService: DiscountService;

    constructor() {
        this.branchRepository = new BranchRepository();
        this.discountService = new DiscountService();
    }

    private async findRandomBranch() {
        return this.branchRepository.findRandomBranch()
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

    private getRandomDiscountType = (): DiscountType => {
        const types = [DiscountType.PRODUCT_DISCOUNT, DiscountType.BUY_ONE_GET_ONE_FREE, DiscountType.MINIMUM_PURCHASE]
        return faker.helpers.arrayElement(types)
    }

    private getRandomDiscountValueType = (): DiscountValueType => {
        const types = [DiscountValueType.PERCENTAGE, DiscountValueType.NOMINAL]
        return faker.helpers.arrayElement(types)
    }

    public create = async () => {
        // Get random branch and employee
        const branch = await this.findRandomBranch()
        if (!branch) throw new Error('Cannot create discount without branch')

        const employee = await this.findRandomEmployee()
        if (!employee) throw new Error('Cannot create discount without employee')

        const discountType = this.getRandomDiscountType()
        const discountValueType = this.getRandomDiscountValueType()

        // Generate discount value based on type
        let discountValue: number
        if (discountValueType === DiscountValueType.PERCENTAGE) {
            discountValue = faker.number.int({ min: 5, max: 50 }) // 5-50% off
        } else {
            discountValue = faker.number.int({ min: 5000, max: 50000 }) // 5k-50k nominal
        }

        // Generate max discount amount
        const maxDiscountAmount = faker.number.int({ min: 10000, max: 200000 })

        // Min purchase amount (optional)
        const minPurchaseAmount = Math.random() < 0.6 ? faker.number.int({ min: 50000, max: 200000 }) : null

        // Start and end dates (discount valid from last 3 days to 30 days in future)
        const today = new Date()
        const startDate = new Date(today.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000) // 0-3 days ago
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days after start

        // Quota
        const quota = faker.number.int({ min: 10, max: 100 })

        const discountNames = [
            'Spring Sale',
            'Weekend Special',
            'Flash Deal',
            'Member Discount',
            'New Customer Offer',
            'Bulk Purchase Discount',
            'Seasonal Promotion',
            'Bundle Deal',
            'Loyalty Reward',
            'Holiday Special',
            'Grand Sale',
            'Clearance Discount'
        ]

        const name = faker.helpers.arrayElement(discountNames)

        return this.discountService.createDiscount({
            id: faker.string.uuid(),
            name,
            discountType,
            discountValueType,
            discountValue,
            minPurchaseAmount,
            maxDiscountAmount,
            startDate,
            endDate,
            quota,
            branchId: branch.id,
            createdBy: employee.id,
            createdAt: faker.date.past({ years: 1 }),
        });
    }

    public createMany = async (count: number) => {
        const createdDiscounts = []
        for (let i = 0; i < count; i++) {
            const discount = await this.create()
            createdDiscounts.push(discount)
        }
        return createdDiscounts
    }
}

export default DiscountsFactory
