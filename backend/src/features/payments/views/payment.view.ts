import { mailTemplateStyle } from "../../../utils/template"

type Payment = {
    orderNumber: string
    amount: number
    evidence: string
}

type Payload = {
    username: string | null
    payment: Payment
}

export const getPaymentConfirmationTemplate = (data: Payload) => {
    const paymentsHtml = `
        <div class="context-box" style="margin-bottom:16px;">
            <p style="margin:0 0 6px 0;"><strong>Order ID:</strong> ${data.payment.orderNumber}</p>
            <p style="margin:0 0 10px 0; color:#059669; font-weight:600;">Amount: Rp ${data.payment.amount.toLocaleString("id-ID")}</p>
            <a href="${data.payment.evidence}" target="_blank">
                <img src="${data.payment.evidence}" alt="Payment Evidence" style="max-width:200px; border-radius:8px; border:1px solid #eee;"/>
            </a>
        </div>
    `

    return `
        <!DOCTYPE html>
        <html>
        <head>
            ${mailTemplateStyle()}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Confirmation Needed</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${data.username}</strong>, A customer has just uploaded payment evidence. Please review and confirm the payment.</p>
                    ${paymentsHtml}
                    <p style="margin-top:20px;">Please verify the payment to proceed with the order.</p>
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