import cron from "node-cron"
import { OrderService } from "../services/order.service"
import { cronTimezone } from "../../../constants/feature.const"

export class OrderCron {
    private orderService = new OrderService()

    public start() {
        // Every day at 7 AM and 8 PM
        cron.schedule("0 7,20 * * *", async () => {
        // cron.schedule("* * * * *", async () => {
            console.log("Running order reminder cron...")

            try {
                // Service : get order that the status still waiting for confirmation or processing
                await this.orderService.getUnprocessedOrdersToRemind()
                console.log("Order reminder finished")
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: cronTimezone })

        // Every hour
        cron.schedule("0 * * * *", async () => {
        // cron.schedule("* * * * *", async () => {
            try {
                // Service : check order's payment deadline
                console.log("Running order reminder cron...")
                await this.orderService.getExpiredOrder()
                console.log("Order expired has been updated")

                // Service : auto confirm for order that has been shipped for more than 7 days
                console.log("Running order auto confirm cron...")
                await this.orderService.getOldShippedOrder()
                console.log("Order status has been updated")
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: cronTimezone })
    }
}