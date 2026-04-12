/**
 * @openapi
 * /api/carts/add-to-cart:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the cart by validating branch inventory and stock, creating a cart if needed, and either inserting a new item or updating its quantity if it already exists.   
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - branchId
 *               - qty
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: cdf12984-6813-4835-8ae7-db88f4be8150
 *               branchId:
 *                 type: string
 *                 format: uuid
 *                 example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *               qty:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product added to cart! }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: string
 *                       format: uuid
 *                       example: 8a7c8c6d-1234-4a9c-b123-123456789abc
 *                     cartItem:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         cartId:
 *                           type: string
 *                           format: uuid
 *                         productId:
 *                           type: string
 *                           format: uuid
 *                         quantity:
 *                           type: integer
 *                           example: 1
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
 *                       example: "qty: Invalid input: expected number, received undefined"
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: qty
 *                           message:
 *                             type: string
 *                             example: "Invalid input: expected number, received undefined"
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
 *         description: Product not found in branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Product not found in this branch }
 *
 *       422:
 *         description: Invalid stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Invalid stock }
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
 * /api/carts:
 *   get:
 *     summary: Get all carts
 *     description: Retrieve all carts for the authenticated user with pagination. Optionally filter by branchId to return a single cart object instead of an array.
 *     tags: [Cart]
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
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart fetched }
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
 *                             example: ccd9da4c-447f-4d00-8e07-ddf423b4e240
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2026-04-09T09:16:49.198Z
 *                           branchId:
 *                             type: string
 *                             format: uuid
 *                             example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                   example: 7d2a37c0-9adc-4267-85f1-29aa04ab3223
 *                                 quantity:
 *                                   type: integer
 *                                   example: 3
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: 2026-04-09T09:44:47.455Z
 *                                 product:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       format: uuid
 *                                       example: e4d4d386-2b89-47bf-8162-c74e44c0f908
 *                                     currentStock:
 *                                       type: integer
 *                                       example: 50
 *                                     product:
 *                                       type: object
 *                                       properties:
 *                                         productName:
 *                                           type: string
 *                                           example: Coca Cola
 *                                         basePrice:
 *                                           type: number
 *                                           example: 10000
 *                                         category:
 *                                           type: object
 *                                           properties:
 *                                             name:
 *                                               type: string
 *                                               example: Beverages
 *                                             slugName:
 *                                               type: string
 *                                               example: beverages
 *                           branch:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *                               storeName:
 *                                 type: string
 *                                 example: Toko Pusat Jakarta
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