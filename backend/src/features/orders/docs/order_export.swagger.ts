/**
 * @openapi
 * /api/orders/export/invoice/{orderNumber}:
 *   get:
 *     summary: Export invoice PDF by order number
 *     description: Generate and download a PDF invoice file for a specific order using its orderNumber. The PDF contains order details, customer info, store info, item list, and payment summary.
 *     tags: [Order Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *           example: ORD-1777300597813
 *     responses:
 *       200:
 *         description: Invoice PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       400:
 *         description: Validation error - invalid order number
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
 *                 message: { type: string, example: Failed to generate invoice }
 */

/**
 * @openapi
 * /api/orders/export/history:
 *   get:
 *     summary: Export transaction history to Excel
 *     description: Generate and download an Excel file containing transaction history. The data includes order creation date, order number, product name, quantity, total price (basePrice * quantity), and store name. Only orders with CONFIRMED or SHIPPED status are included.
 *     tags: [Order Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
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
 *                 message: { type: string, example: Failed to export transaction history }
 */