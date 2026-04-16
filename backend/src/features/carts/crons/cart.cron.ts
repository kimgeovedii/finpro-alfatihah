import cron from "node-cron"
import { CartService } from "../services/cart.service"

export class CartCron {
    private cartService = new CartService()

    public start() {
        // Every day at 6 AM
        cron.schedule("0 6 * * *", async () => {
        // cron.schedule("* * * * *", async () => {
            console.log("Running cart reminder cron...")

            try {
                // Service : get cart that has been exist for more than 3 days and remind customer to checkout
                await this.cartService.getAllCartsToRemind()
                console.log("Cart reminder finished")
            } catch (error) {
                console.error("Cron error:", error)
            }
        }, { timezone: "Asia/Jakarta" })
    }
}