import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { VoucherType, DiscountValueType } from "@prisma/client"

class VouchersFactory {
    private getRandomVoucherType = (): VoucherType => {
        const types = [VoucherType.ORDER, VoucherType.SHIPPING_COST]
        return faker.helpers.arrayElement(types)
    }

    private getRandomDiscountValueType = (): DiscountValueType => {
        const types = [DiscountValueType.PERCENTAGE, DiscountValueType.NOMINAL]
        return faker.helpers.arrayElement(types)
    }

    private generateVoucherCode = (): string => {
        // Generate codes like: SAVE2024, GIFT50, SPRING2024, etc.
        const prefixes = ['SAVE', 'GIFT', 'SPRING', 'SUMMER', 'FALL', 'WELCOME', 'VIP', 'LUCKY']
        const prefix = faker.helpers.arrayElement(prefixes)
        const suffix = faker.number.int({ min: 1000, max: 9999 })
        return `${prefix}${suffix}`
    }

    public create = async () => {
        const voucherType = this.getRandomVoucherType()
        const discountValueType = this.getRandomDiscountValueType()

        // Generate discount value based on type
        let discountValue: number
        if (discountValueType === DiscountValueType.PERCENTAGE) {
            discountValue = faker.number.int({ min: 5, max: 40 }) // 5-40% off
        } else {
            discountValue = faker.number.int({ min: 5000, max: 100000 }) // 5k-100k nominal
        }

        // Generate max discount amount
        const maxDiscountAmount = faker.number.int({ min: 20000, max: 300000 })

        // Min purchase amount (optional)
        const minPurchaseAmount = Math.random() < 0.6 ? faker.number.int({ min: 100000, max: 500000 }) : null

        // Expiry date (valid for 3-12 months)
        const today = new Date()
        const monthsAhead = faker.number.int({ min: 3, max: 12 })
        const expiredDate = new Date(today.getFullYear(), today.getMonth() + monthsAhead, today.getDate())

        // Quota
        const quota = faker.number.int({ min: 50, max: 500 })

        const voucherNames = [
            'Welcome Voucher',
            'Birthday Discount',
            'Flash Sale',
            'Holiday Special',
            'Member Exclusive',
            'Limited Time Offer',
            'New User Welcome',
            'Seasonal Promotion',
            'Referral Reward',
            'Anniversary Celebration'
        ]

        const name = faker.helpers.arrayElement(voucherNames)

        return prisma.vouchers.create({
            data: {
                id: faker.string.uuid(),
                name,
                voucherCode: this.generateVoucherCode(),
                type: voucherType,
                discountValueType,
                discountValue,
                minPurchaseAmount,
                maxDiscountAmount,
                quota,
                expiredDate,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdVouchers = []
        for (let i = 0; i < count; i++) {
            const voucher = await this.create()
            createdVouchers.push(voucher)
        }
        return createdVouchers
    }
}

export default VouchersFactory
