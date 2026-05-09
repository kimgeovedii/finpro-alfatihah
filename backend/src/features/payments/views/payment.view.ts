import { currencyFormat } from "../../../constants/business.const"
import { getMailBodyTemplate, mailTemplateStyle } from "../../../utils/template"

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
            <p style="margin:0 0 10px 0; color:#059669; font-weight:600;">Amount: Rp ${data.payment.amount.toLocaleString(currencyFormat)}</p>
            <a href="${data.payment.evidence}" target="_blank">
                <img src="${data.payment.evidence}" alt="Payment Evidence" style="max-width:200px; border-radius:8px; border:1px solid #eee;"/>
            </a>
        </div>
    `

    const body = getMailBodyTemplate('Payment Confirmation Needed', data.username ?? 'Unknown User', `
        <p>A customer has just uploaded payment evidence. Please review and confirm the payment.</p>
        ${paymentsHtml}
        <p style="margin-top:20px;">Please verify the payment to proceed with the order.</p>
    `)

    return `
        <!DOCTYPE html>
        <html>
            <head>
                ${mailTemplateStyle()}
            </head>
            <body>
                ${body}
            </body>
        </html>
    `
}

type PaymentConfirmedPayload = {
    username: string | null
    orderNumber: string
}

export const getPaymentConfirmedTemplate = (data: PaymentConfirmedPayload) => {
    const body = getMailBodyTemplate('Payment Confirmed! 🎉🎉🎉', data.username ?? 'Unknown User', `
        <p>your payment evidence has been confirmed. Please wait while we process your order, and it will be shipped to your address as soon as possible.</p>
        <div class="context-box" style="margin-bottom:16px;">
            <p style="margin:0 0 6px 0;"><strong>Order ID:</strong> ${data.orderNumber}</p>
        </div>
    `)


    return `
        <!DOCTYPE html>
        <html>
            <head>
                ${mailTemplateStyle()}
            </head>
            <body>
                ${body}
            </body>
        </html>
    `
}