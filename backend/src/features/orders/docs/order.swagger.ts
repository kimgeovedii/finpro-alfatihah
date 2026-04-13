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

/**
 * @openapi
 * /api/orders/{orderId}:
 *   delete:
 *     summary: Delete order by id
 *     description: Delete an order by its ID, restoring branch inventory stock for each item. Order items and payments are removed automatically via cascade.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 87a93344-826f-4913-97b5-056b98d1de51
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Success }
 *                 data: { type: string, example: Order deleted! }
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
 *         description: Forbidden access to order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Forbidden access to this order }
 *
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Order not found }
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

/**
 * @openapi
 * /api/orders/transaction:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders for the authenticated user with pagination. Optionally filter by branchId to scope the results to a specific branch.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 14
 *       - in: query
 *         name: branchId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order fetched }
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 8bab6859-0372-4a5f-8d53-c39023288ba3
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-13T01:54:05.249Z
 *                           status:
 *                             type: string
 *                             enum: [WAITING_PAYMENT, WAITING_PAYMENT_CONFIRMATION, PROCESSING, SHIPPED, CONFIRMED, CANCELLED]
 *                             example: WAITING_PAYMENT
 *                           totalPrice:
 *                             type: number
 *                             example: 20000
 *                           finalPrice:
 *                             type: number
 *                             example: 20000
 *                           shippingCost:
 *                             type: number
 *                             example: 6000
 *                           paymentDeadline:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-13T02:54:05.229Z
 *                           totalItems:
 *                             type: integer
 *                             example: 2
 *                           productList:
 *                             type: string
 *                             example: Coca Cola
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 14 }
 *                         total: { type: integer, example: 1 }
 *                         total_page: { type: integer, example: 1 }
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: branchId is not valid UUID }
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