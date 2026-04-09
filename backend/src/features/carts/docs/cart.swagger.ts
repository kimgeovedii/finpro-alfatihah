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