import { currencyFormat } from "../../../constants/business.const"
import { mailTemplateStyle } from "../../../utils/template"

type CartItem = {
    productName: string
    quantity: number
    price: number
}

export type CartGroup = {
    storeName: string
    items: CartItem[]
}

export const getCartReminderEmailTemplate = (username: string, carts: CartGroup[]) => {
    const cartHtml = carts.map(dt => {
        let totalQty = 0
        let totalPrice = 0

        const itemsHtml = dt.items.map(it => {
            totalQty += it.quantity
            totalPrice += it.quantity * it.price

            return `
                <tr>
                    <td style="padding:6px 0;">${it.productName}</td>
                    <td style="padding:6px 0; text-align:center;">${it.quantity}</td>
                    <td style="padding:6px 0; text-align:right;">Rp ${it.price.toLocaleString(currencyFormat)}</td>
                </tr>
            `
        }).join("")

        return `
            <div class="context-box" style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;">${dt.storeName}</h3>
                <table style="width:100%; border-collapse:collapse; font-size:14px;">
                    <thead>
                        <tr style="border-bottom:1px solid #eee;">
                            <th align="left">Product</th>
                            <th align="center">Qty</th>
                            <th align="right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #ddd;">
                    <p style="margin:0; font-weight:600;">Total Items: ${totalQty}</p>
                    <p style="margin:0; font-weight:700; color:#059669;">
                        Total Price: Rp ${totalPrice.toLocaleString(currencyFormat)}
                    </p>
                </div>
            </div>
        `
    }).join("")

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Cart Reminder</title>
            ${mailTemplateStyle()}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Your Cart is Waiting</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${username}</strong>,</p>
                    <p>You still have items in your cart from the last few days. Complete your purchase before they run out!.</p>
                    ${cartHtml}
                    <p>It's been more than <strong>2 days</strong> since you added these items.</p>
                    <p>Don't miss out, checkout now while they're still available.</p>
                    <p>
                        Best regards,<br/>
                        <strong>Alfatihah</strong>
                    </p>
                </div>
                <div class="footer">
                    © ${new Date().getFullYear()} Alfatihah. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
}