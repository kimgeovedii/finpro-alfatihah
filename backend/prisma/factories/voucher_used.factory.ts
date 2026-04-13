import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

class VoucherUsedFactory {
    private async findRandomVoucher() {
        const count = await prisma.vouchers.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.vouchers.findFirst({
            skip,
            select: { id: true }
        })
    }

    private async findRandomOrder() {
        const count = await prisma.orders.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.orders.findFirst({
            skip,
            select: { id: true }
        })
    }

    public create = async (voucherId?: string, orderId?: string) => {
        // Use provided IDs or get random ones
        let targetVoucherId = voucherId
        let targetOrderId = orderId

        if (!targetVoucherId) {
            const voucher = await this.findRandomVoucher()
            if (!voucher) throw new Error('Cannot create voucher used without voucher')
            targetVoucherId = voucher.id
        }

        if (!targetOrderId) {
            const order = await this.findRandomOrder()
            if (!order) throw new Error('Cannot create voucher used without order')
            targetOrderId = order.id
        }

        // Check if this voucher-order combination already exists
        const existing = await prisma.voucher_useds.findFirst({
            where: {
                voucherId: targetVoucherId,
                orderId: targetOrderId
            }
        })

        if (existing) {
            return existing
        }

        return prisma.voucher_useds.create({
            data: {
                id: faker.string.uuid(),
                voucherId: targetVoucherId,
                orderId: targetOrderId,
            },
        })
    }

    public createMany = async (count: number) => {
        const createdVoucherUseds = []
        for (let i = 0; i < count; i++) {
            const voucherUsed = await this.create()
            createdVoucherUseds.push(voucherUsed)
        }
        return createdVoucherUseds
    }

    // Link each existing order to a random voucher (if any vouchers exist)
    public linkVouchersToOrders = async () => {
        const orders = await prisma.orders.findMany({
            select: { id: true }
        })

        const vouchers = await prisma.vouchers.findMany({
            select: { id: true }
        })

        if (orders.length === 0 || vouchers.length === 0) {
            return []
        }

        const allVoucherUseds = []

        // Link about 30% of orders to random vouchers
        const ordersToLink = Math.floor(orders.length * 0.3)

        for (let i = 0; i < ordersToLink; i++) {
            const order = faker.helpers.arrayElement(orders)
            const voucher = faker.helpers.arrayElement(vouchers)

            const voucherUsed = await this.create(voucher.id, order.id)
            allVoucherUseds.push(voucherUsed)
        }

        return allVoucherUseds
    }
}

export default VoucherUsedFactory
