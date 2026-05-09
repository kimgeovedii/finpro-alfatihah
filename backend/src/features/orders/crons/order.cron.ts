import cron from "node-cron"
import { cronTimezone } from "../../../constants/feature.const"
import { OrderCronService } from "../services/order_cron.service"

export class OrderCron {
    private orderCronService = new OrderCronService()

    public start() {
        // Every day at 7 AM and 8 PM
        cron.schedule("0 7,20 * * *", async () => {
        // cron.schedule("* * * * *", async () => {
            try {
                // Service : get order that the status still waiting for confirmation or processing
                await this.orderCronService.getUnprocessedOrdersToRemind()
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: cronTimezone })

        // Every hour
        cron.schedule("0 * * * *", async () => {
        // cron.schedule("* * * * *", async () => {
            try {
                // Service : check order's payment deadline
                await this.orderCronService.getExpiredOrder()

                // Service : auto confirm for order that has been shipped for more than 7 days
                await this.orderCronService.getOldShippedOrder()
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: cronTimezone })
    }
}