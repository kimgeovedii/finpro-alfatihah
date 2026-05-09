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
 *           example: 3212d7e9-0dd0-4558-8ae8-813fd063970a
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
 *                             example: 96c69d82-a91e-4ded-bc3a-7088236918ae
 *                           branchId:
 *                             type: string
 *                             format: uuid
 *                             example: 3212d7e9-0dd0-4558-8ae8-813fd063970a
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                   example: 54295d89-c211-455f-928d-d9b7631be94a
 *                                 quantity:
 *                                   type: integer
 *                                   example: 3
 *                                 product:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       format: uuid
 *                                       example: 38401a75-286e-4cdb-8624-30a5ff12aad9
 *                                     currentStock:
 *                                       type: integer
 *                                       example: 249
 *                                     product:
 *                                       type: object
 *                                       properties:
 *                                         productName:
 *                                           type: string
 *                                           example: Sunpride Cavendish Banana 1kg
 *                                         slugName:
 *                                           type: string
 *                                           example: sunpride-cavendish-banana-1kg-5a2lp
 *                                         basePrice:
 *                                           type: number
 *                                           example: 48660
 *                                         productImages:
 *                                           type: array
 *                                           items:
 *                                             type: object
 *                                             properties:
 *                                               imageUrl: { type: string, example: https://loremflickr.com/800/600/1kg?lock=3983 }
 *                           branch:
 *                             type: object
 *                             properties:
 *                               id: { type: string, format: uuid, example: 3212d7e9-0dd0-4558-8ae8-813fd063970a }
 *                               storeName: { type: string, example: Pasar Segar Monas }
 *                               city: { type: string, example: Jakarta Pusat }
 *                               slug: { type: string, example: pasar-segar-monas }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 14 }
 *                         total: { type: integer, example: 2 }
 *                         totalPages: { type: integer, example: 1 }
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
 * /api/carts/summary:
 *   get:
 *     summary: Get cart summary
 *     description: Returns total cart items and total quantity across all carts for the authenticated user. Optionally filter by branchId to scope the summary to a specific branch.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: fb6359b6-7841-4145-b7fc-eb08c660a3b3
 *     responses:
 *       200:
 *         description: Cart summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart summary fetched }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: Total distinct cart items
 *                       example: 3
 *                     totalQty:
 *                       type: integer
 *                       description: Sum of all item quantities
 *                       example: 10
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
 * /api/carts/delete/{cartId}:
 *   delete:
 *     summary: Delete cart by id
 *     description: Delete a cart and all its items by cartId. Only the owner of the cart can delete it.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: ccd9da4c-447f-4d00-8e07-ddf423b4e240
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart deleted }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: string
 *                       format: uuid
 *                       example: ccd9da4c-447f-4d00-8e07-ddf423b4e240
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: cartId is not valid UUID }
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
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Cart not found }
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
 * /api/carts/{cartId}:
 *   get:
 *     summary: Get cart detail by cartId
 *     description: Return detailed cart information including branch info, items, user addresses, summary (total price & qty), and calculated shipping cost based on selected or nearest valid address.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: f4b8160a-a0d2-4e3e-a6f0-b1995f6ffc32
 *       - in: query
 *         name: addressId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 08e65cdc-e5a9-4665-a0a4-64ad3aae64f5
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
 *                     branch:
 *                       type: object
 *                       properties:
 *                         storeName: { type: string, example: Pasar Segar Monas }
 *                         latitude: { type: number, example: -6.1944 }
 *                         longitude: { type: number, example: 106.8229 }
 *                         address: { type: string, example: Jl. Medan Merdeka Barat No. 5, Gambir }
 *                         maxDeliveryDistance: { type: number, example: 15 }
 *                         openStatus: { type: string, example: Open }
 *                         schedules:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               startTime: { type: string, example: "07:00" }
 *                               endTime: { type: string, example: "23:00" }
 *                               dayName: { type: string, example: FRI }
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid, example: 80ff660a-ed22-4d5f-94d0-b117f691452d }
 *                           quantity: { type: integer, example: 1 }
 *                           product:
 *                             type: object
 *                             properties:
 *                               currentStock: { type: integer, example: 386 }
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   productName: { type: string, example: Alpukat Mentega Avocado 500g }
 *                                   slugName: { type: string, example: alpukat-mentega-avocado-500g }
 *                                   basePrice: { type: number, example: 15239 }
 *                                   weight: { type: number, example: 500 }
 *                                   discountAmount: { type: number, example: 0 }
 *                                   finalTotalPrice: { type: number, example: 15239 }
 *                                   finalPricePerItem: { type: number, example: 15239 }
 *                                   productDiscounts:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         discount:
 *                                           type: object
 *                                           properties:
 *                                             discountType: { type: string, example: MINIMUM_PURCHASE }
 *                                             discountValue: { type: number, example: 45000 }
 *                                             discountValueType: { type: string, example: NOMINAL }
 *                                             maxDiscountAmount: { type: number, example: 375000 }
 *                                             minPurchaseAmount: { type: number, example: 75000 }
 *                                             startDate: { type: string, format: date-time, example: 2026-05-04T00:11:06.259Z }
 *                                             endDate: { type: string, format: date-time, example: 2026-06-03T00:11:06.259Z }
 *                                   productImages:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         imageUrl: { type: string, example: https://loremflickr.com/800/600/500g?lock=5858 }
 *                                   category:
 *                                     type: object
 *                                     properties:
 *                                       slugName: { type: string, example: fruits }
 *                                       name: { type: string, example: Fruits }
 *                     user:
 *                       type: object
 *                       properties:
 *                         addresses:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id: { type: string, format: uuid, example: ab93fb62-1e41-4df2-9eaf-65a4642057ac }
 *                               address: { type: string, example: Universitas Indonesia, Depok }
 *                               lat: { type: number, example: -6.271348 }
 *                               long: { type: number, example: 106.764486 }
 *                               type: { type: string, example: Rumah }
 *                               label: { type: string, example: Kampus }
 *                               receiptName: { type: string, example: Flazen Edu }
 *                               phone: { type: string, example: "081200000011" }
 *                               isPrimary: { type: boolean, example: false }
 *                               distance: { type: number, example: 10.719195944945607 }
 *                               isWithinRange: { type: boolean, example: true }
 *                     totalBasePrice: { type: number, example: 15239 }
 *                     totalQty: { type: integer, example: 1 }
 *                     totalWeight: { type: number, example: 500 }
 *                     totalDiscountProduct: { type: number, example: 0 }
 *                     finalTotalPrice: { type: number, example: 15239 }
 *                     shipping:
 *                       type: object
 *                       properties:
 *                         shippingCost: { type: number, example: 18000 }
 *                         distance: { type: number, example: 10.719195944945607 }
 *                         courier: { type: string, example: jne }
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
 *         description: Cart or Address not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Cart not found }
 *
 *       422:
 *         description: Address outside delivery range or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: None of your address in shipping range }
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