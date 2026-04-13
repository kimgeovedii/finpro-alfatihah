/**
 * @openapi
 * /api/carts/items/update-qty/{cartItemId}:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a cart item by decreasing it. And if the resulting quantity is zero, the item will be deleted.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 7d2a37c0-9adc-4267-85f1-29aa04ab3223
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qty
 *             properties:
 *               qty:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product item updated! }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: string
 *                       format: uuid
 *                       example: ccd9da4c-447f-4d00-8e07-ddf423b4e240
 *                     cartItem:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: 7d2a37c0-9adc-4267-85f1-29aa04ab3223
 *                         cartId:
 *                           type: string
 *                           format: uuid
 *                           example: ccd9da4c-447f-4d00-8e07-ddf423b4e240
 *                         productId:
 *                           type: string
 *                           format: uuid
 *                           example: e4d4d386-2b89-47bf-8162-c74e44c0f908
 *                         discountId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         quantity:
 *                           type: integer
 *                           example: 1
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2026-04-09T09:44:47.455Z
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
 *       403:
 *         description: Forbidden access to cart item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Forbidden access to this cart item }
 *
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Cart item not found }
 *
 *       422:
 *         description: Invalid quantity update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Invalid quantity update }
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
 * /api/carts/items/delete/{cartItemId}:
 *   delete:
 *     summary: Delete cart item by id
 *     description: Delete a cart item by its ID, ensuring the item exists and belongs to the authenticated user.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 33b9ae21-3c71-4266-8cfc-ba32b334e723
 *     responses:
 *       200:
 *         description: Product item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Success }
 *                 data: { type: string, example: Product item deleted! }
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
 *         description: Forbidden access to cart item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Forbidden access to this cart item }
 *
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Cart item not found }
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