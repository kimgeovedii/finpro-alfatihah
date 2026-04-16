import cron from "node-cron"
import { OrderService } from "../services/order.service"
import { cronTimezone } from "../../../constants/feature.const"

export class OrderCron {
    private orderService = new OrderService()

    public start() {
        // Every day at 7 AM and 8 PM
        // cron.schedule("0 7,20 * * *", async () => {
        cron.schedule("* * * * *", async () => {
            console.log("Running order reminder cron...")

            try {
                // Service : get order that the status still waiting for confirmation or processing
                await this.orderService.getUnprocessedOrdersToRemind()
                console.log("Order reminder finished")
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: cronTimezone })
    }
}