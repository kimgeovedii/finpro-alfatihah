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
 * /api/orders/cancelling/{orderNumber}:
 *   post:
 *     summary: Cancel order by order number
 *     description: Cancel an order by its ID, restoring branch inventory stock for each item.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
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
 *       - in: query
 *         name: dateStart
 *         required: false
 *         schema:
 *           type: string
 *           example: 2026-04-01
 *       - in: query
 *         name: dateEnd
 *         required: false
 *         schema:
 *           type: string
 *           example: 2026-04-02
 *       - in: query
 *         name: orderNumber
 *         required: false
 *         schema:
 *           type: string
 *           example: ORD-1776295220556-163
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
 *                           orderNumber:
 *                             type: string
 *                             example: ORD-1776058988781
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
 *                           payments:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 evidence:
 *                                   type: string
 *                                   format: uri
 *                                   example: https://res.cloudinary.com/dcpasygag/image/upload/v1776123123/123123123.png
 *                                 method:
 *                                   type: string
 *                                   enum: [MANUAL, AUTOMATIC]
 *                                   example: MANUAL
 *                                 status:
 *                                   type: string
 *                                   enum: [PENDING, CONFIRMED, REJECTED]
 *                                   example: PENDING
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

/**
 * @openapi
 * /api/orders/summary:
 *   get:
 *     summary: Get order summary
 *     description: Returns total order count grouped by status, and total finalPrice and totalPrice for confirmed orders only.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order summary fetched successfully
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
 *                     ordersByStatus:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         WAITING_PAYMENT: 2
 *                         CONFIRMED: 1
 *                     totalFinalPrice:
 *                       type: number
 *                       example: 30000
 *                     totalPrice:
 *                       type: number
 *                       example: 30000
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

/**
 * @openapi
 * /api/orders/transaction/{orderNumber}:
 *   get:
 *     summary: Get order detail by order number
 *     description: Retrieve detailed information of a specific order using its orderNumber for the authenticated user.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ORD-1776295220552-150
 *     responses:
 *       200:
 *         description: Order fetched successfully
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
 *                     orderNumber:
 *                       type: string
 *                       example: ORD-1776295220552-150
 *                     status:
 *                       type: string
 *                       enum: [WAITING_PAYMENT, WAITING_PAYMENT_CONFIRMATION, PROCESSING, SHIPPED, CONFIRMED, CANCELLED]
 *                       example: WAITING_PAYMENT_CONFIRMATION
 *                     totalPrice:
 *                       type: number
 *                       example: 224322
 *                     totalWeight:
 *                       type: number
 *                       example: 1400
 *                     finalPrice:
 *                       type: number
 *                       example: 248580
 *                     shippingCost:
 *                       type: number
 *                       example: 24258
 *                     paymentDeadline:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-16T10:18:42.420Z
 *                     shippedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     confirmedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     rejectedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-25T15:29:08.364Z
 *                     branch:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: 61904921-d090-4196-87b5-27aac626154c
 *                         storeName:
 *                           type: string
 *                           example: Toko Cabang Surabaya
 *                         address:
 *                           type: string
 *                           example: Jl. Tunjungan No. 88, Genteng
 *                         city:
 *                           type: string
 *                           example: Surabaya
 *                         schedules:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               startTime:
 *                                 type: string
 *                                 example: "08:30"
 *                               endTime:
 *                                 type: string
 *                                 example: "21:30"
 *                               dayName:
 *                                 type: string
 *                                 example: MON
 *                     address:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                           example: Rumah
 *                         type:
 *                           type: string
 *                           example: Rumah
 *                         receiptName:
 *                           type: string
 *                           example: Akim Mustofa
 *                         notes:
 *                           type: string
 *                           example: Pagar warna hitam
 *                         phone:
 *                           type: string
 *                           example: 081234567890
 *                         address:
 *                           type: string
 *                           example: Jl. Merdeka No. 10, Bandung
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 2f7002fc-216b-4cee-9efc-8c252bb8b5fb
 *                           quantity:
 *                             type: integer
 *                             example: 243
 *                           product:
 *                             type: object
 *                             properties:
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   productName:
 *                                     type: string
 *                                     example: Carrots
 *                                   description:
 *                                     type: string
 *                                     example: Fresh crunchy carrots, perfect for salads or cooking
 *                                   basePrice:
 *                                     type: number
 *                                     example: 14328
 *                                   weight:
 *                                     type: number
 *                                     example: 120
 *                                   productImages:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         imageUrl:
 *                                           type: string
 *                                           format: uri
 *                                           example: https://picsum.photos/seed/UYwqDr3/800/600
 *                     payments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           evidence:
 *                             type: string
 *                             format: uri
 *                             example: https://res.cloudinary.com/dcpasygag/image/upload/v1776123123/123123123.png
 *                           method:
 *                             type: string
 *                             enum: [MANUAL, AUTOMATIC]
 *                             example: MANUAL
 *                           status:
 *                             type: string
 *                             enum: [PENDING, CONFIRMED, REJECTED]
 *                             example: PENDING
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Invalid order number format }
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
 * /api/orders/summary/{branchId}:
 *   get:
 *     summary: Get order summary by branch id  
 *     description: Returns revenue statistics and order counts for the authenticated user, including monthly revenue, revenue change percentage, active shipments, processing orders, finished orders, and last month's finished orders.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *           example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order summary fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 1500000
 *                     revenueChangePercent:
 *                       type: number
 *                       example: 12.5
 *                     activeShipments:
 *                       type: integer
 *                       example: 4
 *                     processingOrder:
 *                       type: integer
 *                       example: 3
 *                     finishedOrder:
 *                       type: integer
 *                       example: 10
 *                     finishedOrderLastMonth:
 *                       type: integer
 *                       example: 7
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

/**
 * @openapi
 * /api/orders/transaction/management/{branchId}:
 *   get:
 *     summary: Get all transactions by branch id
 *     description: Retrieve all orders for a specific branch, optionally filtered by status. Supports pagination and returns user information with each order.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 61904921-d090-4196-87b5-27aac626154c
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ALL, WAITING_PAYMENT, WAITING_PAYMENT_CONFIRMATION, PROCESSING, SHIPPED, CONFIRMED, CANCELLED]
 *           example: ALL
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
 *     security:
 *       - bearerAuth: []
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
 *                           id: { type: string, format: uuid, example: ba33cfd5-10ad-4cfc-b36f-0b3d5655da2c }
 *                           orderNumber: { type: string, example: ORD-1776299113950 }
 *                           createdAt: { type: string, format: date-time, example: 2026-04-16T00:25:13.979Z }
 *                           status: { type: string, example: CANCELLED }
 *                           finalPrice: { type: number, example: 51375639 }
 *                           payments:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 evidence: { type: string, format: uri, nullable: true, example: null }
 *                                 method: { type: string, enum: [MANUAL, AUTOMATIC], example: MANUAL }
 *                                 status: { type: string, enum: [PENDING, CONFIRMED, REJECTED], example: PENDING }
 *                           user:
 *                             type: object
 *                             properties:
 *                               username: { type: string, example: akimmustofa }
 *                               email: { type: string, example: flazen.edu@gmail.com }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 14 }
 *                         total: { type: integer, example: 5 }
 *                         total_page: { type: integer, example: 1 }
 *
 *       400:
 *         description: Validation error - branchId is not valid UUID
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

/**
 * @openapi
 * /api/orders/shipping/{orderNumber}:
 *   post:
 *     summary: Ship order by order number
 *     description: Mark an order as shipped if the stock is ready. This will update the order status to SHIPPED and set the shippedAt timestamp.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ORD-1776295220552-150
 *     responses:
 *       200:
 *         description: Order shipped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order is on the way! }
 *
 *       400:
 *         description: Validation error - invalid order number format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: "Invalid order number format. Must start with 'ORD-'"
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
 *       422:
 *         description: Stock is not ready to be shipped
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: Your stock is not ready yet to be shipped
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
 * /api/orders/cancelling/{orderNumber}:
 *   post:
 *     summary: Cancel order by order number
 *     description: Cancel an order if it is still in store (not shipped). This will update the order status to CANCELLED and restore inventory stock.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ORD-1776295220552-150
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order is cancelled! }
 *
 *       400:
 *         description: Validation error - invalid order number format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: "Invalid order number format. Must start with 'ORD-'"
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
 *       422:
 *         description: Order cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: Only order who still in store can be cancelled
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
 * /api/orders/confirming/{orderNumber}:
 *   post:
 *     summary: Confirm delivered order by order number
 *     description: Confirm that an order has been delivered. This will update the order status to CONFIRMED and set the confirmedAt timestamp. Only orders with SHIPPED status can be confirmed.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ORD-1776295220552-150
 *     responses:
 *       200:
 *         description: Order confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order is confirmed! }
 *
 *       400:
 *         description: Validation error - invalid order number format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: "Invalid order number format. Must start with 'ORD-'"
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
 *       422:
 *         description: Order cannot be confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message:
 *                   type: string
 *                   example: Only order who still in shipped can be confirmed
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