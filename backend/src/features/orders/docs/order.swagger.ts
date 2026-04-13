/**
 * @openapi
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout cart
 *     description: Checkout a cart by validating the address, branch delivery range, calculating shipping cost, creating an order with its items, initializing a pending payment, decrementing stock, and deleting the cart.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - addressId
 *             properties:
 *               cartId:
 *                 type: string
 *                 format: uuid
 *                 example: 7c0b2008-fc2e-4da9-ab4d-688e52454c24
 *               addressId:
 *                 type: string
 *                 format: uuid
 *                 example: a9c08924-e3b2-4b79-a441-2fc5fcacfe88
 *               voucherId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Order checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order checkout! }
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       format: uuid
 *                       example: 87a93344-826f-4913-97b5-056b98d1de51
 *                     paymentId:
 *                       type: string
 *                       format: uuid
 *                       example: abefafc8-fdce-40d7-a8d3-ff6008eb4474
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "cartId: Invalid cart ID"
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: cartId
 *                           message:
 *                             type: string
 *                             example: Invalid cart ID
 *
 *       401:
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: No token provided }
 *
 *       403:
 *         description: Forbidden access to address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Forbidden access to this address }
 *
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Branch not found }
 *
 *       422:
 *         description: Unprocessable request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Cart is empty }
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Internal server error }
 */