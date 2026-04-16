/**
 * @openapi
 * /api/payments/manual/evidence/{orderId}:
 *   post:
 *     summary: Upload manual payment evidence
 *     description: Upload a payment evidence image for a manual payment. Validates that the order exists, belongs to the user, and is within the payment deadline before updating the payment record.
 *     tags: [Payment]
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - img
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: Payment evidence image (JPG, JPEG, PNG only, max 2MB)
 *     responses:
 *       200:
 *         description: Payment evidence uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment checkout! }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: abefafc8-fdce-40d7-a8d3-ff6008eb4474
 *                     orderId:
 *                       type: string
 *                       format: uuid
 *                       example: 87a93344-826f-4913-97b5-056b98d1de51
 *                     method:
 *                       type: string
 *                       enum: [MANUAL, GATEWAY]
 *                       example: MANUAL
 *                     status:
 *                       type: string
 *                       enum: [SUCCESS, PENDING, REJECTED]
 *                       example: PENDING
 *                     evidence:
 *                       type: string
 *                       example: https://res.cloudinary.com/example/image/upload/v1/evidence.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-04-13T01:54:05.249Z
 *
 *       400:
 *         description: No evidence image provided or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Please select your payment evidence }
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
 *         description: Order or payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Order not found }
 *
 *       422:
 *         description: Payment deadline has passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Payment deadline has passed }
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