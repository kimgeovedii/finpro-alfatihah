import { mailTemplateStyle } from "../../../utils/template"

type Schedule = {
    dayName: string
    startTime: string
    endTime: string
}

type Order = {
    orderNumber: string
    createdAt: Date
    confirmedAt?: Date | null
    status: string
    user: {
        username: string | null, 
        email: string
    }
}

type Payload = {
    username: string
    storeName: string
    schedules: Schedule[]
    orders: Order[]
}

export const getBranchOrderBroadcastTemplate = (data: Payload) => {
    const scheduleHtml = data.schedules.map(sc => `${sc.dayName} (${sc.startTime} - ${sc.endTime})`).join(", ")

    const ordersHtml = data.orders.map(or => {
        const date = or.confirmedAt ?? or.createdAt

        return `
            <tr>
                <td>${or.orderNumber}</td>
                <td>${or.status.replace("_"," ")}</td>
                <td>${new Date(date).toLocaleString("id-ID")}</td>
            </tr>
        `
    }).join("")

    return `
        <!DOCTYPE html>
        <html>
        <head>
            ${mailTemplateStyle()}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Branch Order Report</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${data.username}</strong>, looks like your store has some transaction need to be process</p>
                    <h3>${data.storeName}</h3>
                    <h4>Opening Hours</h4>
                    <p>${scheduleHtml}</p>
                    <div class="context-box" style="margin-top:20px;">
                        <h4>Orders (Need Attention)</h4>
                        <table style="width:100%; font-size:11px;">
                            <thead>
                                <tr>
                                    <th align="left">Order</th>
                                    <th align="left">Status</th>
                                    <th align="right">Last Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ordersHtml}
                            </tbody>
                        </table>
                    </div>
                    <p style="margin-top:20px;">
                        Please review and process these orders.
                    </p>
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


type OrderCreated = {
    username: string
    orderNumber: string
    amount: number
    paymentDeadline: Date
}

export const getOrderCreatedPaymentTemplate = (data: OrderCreated, isManual: boolean) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            ${mailTemplateStyle()}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Complete Your Payment</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${data.username}</strong>,</p>
                    <p>Your order has been successfully created. Please complete your payment before the deadline to avoid cancellation.</p>
                    <div class="context-box" style="margin-top:16px;">
                        <p style="margin:0 0 6px 0;"><strong>Order ID:</strong> ${data.orderNumber}</p>
                        <p style="margin:0 0 6px 0; color:#059669; font-weight:600;">Payment Amount: Rp ${data.amount.toLocaleString("id-ID")}</p>
                        <p style="margin:0;">
                            Payment Deadline: <strong>${new Date(data.paymentDeadline).toLocaleString("id-ID")}</strong>
                        </p>
                    </div>
                    ${
                        isManual ? `
                        <p style="margin-top:16px;">
                            After completing the payment, please upload your payment evidence from the <strong>Order Menu</strong> in the application.
                            Make sure to upload the evidence before the deadline so your order can be processed.
                        </p>` : ''
                    }
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