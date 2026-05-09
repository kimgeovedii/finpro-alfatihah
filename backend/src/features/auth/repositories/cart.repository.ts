import { prisma } from "../../../config/prisma";

export class CartRepository {
  async getCartSummary(userId: string) {
    const carts = await prisma.carts.findMany({
      where: { userId },
      select: {
        items: {
          select: { quantity: true }
        }
      }
    })

    // Sum qty from all cart items
    const allItems = carts.flatMap(cart => cart.items)
    const totalQty = allItems.reduce((sum, item) => sum + item.quantity, 0)

    return totalQty
  }
}
