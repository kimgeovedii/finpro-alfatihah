import { BranchRepository } from "../repositories/branch.repository"
import { OrderRepository } from "../repositories/order.repository"
import { Mailer } from "../../../config/mailer";
import { getBranchOrderBroadcastTemplate } from "../views/order.view"

export class OrderCronService {
    private orderRepo = new OrderRepository()
    private branchRepo = new BranchRepository()

    // For Task Scheduling / Cron
    async getUnprocessedOrdersToRemind() {
        // Repo : get processing branch order
        const branchs = await this.branchRepo.findBranchsOrders()
    
        for (const dt of branchs) {
            if (!dt.orders.length) continue
    
            // Remind every employee
            for (const emp of dt.employees) {
                if (!emp.user?.username) continue
    
                const emailHtml = getBranchOrderBroadcastTemplate({
                    username: emp.user.username,
                    storeName: dt.storeName,
                    schedules: dt.schedules,
                    orders: dt.orders
                })
    
                await Mailer.client.sendMail({
                    from: `"Alfatihah Online Grocery" <${process.env.SMTP_USER}>`,
                    to: emp.user.email,
                    subject: `Branch Orders - ${dt.storeName}`,
                    html: emailHtml,
                })
            }
        }
    }

    async getExpiredOrder() {
        // Repo : get expired order
        await this.orderRepo.cancelExpiredUnpaidOrders()
    }

    async getOldShippedOrder() {
        // Repo : get order that has been shipped for more than n hours
        await this.orderRepo.confirmOldShippedOrder()
    }
}