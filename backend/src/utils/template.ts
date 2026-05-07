export const mailTemplateStyle = () => {
    return `
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f6f8;
                font-family: Arial, Helvetica, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            .header {
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 22px;
            }
            .content {
                padding: 24px;
                color: #333333;
                line-height: 1.6;
            }
            .content p {
                margin: 0 0 16px;
            }
            .context-box {
                background-color: #f1f5f9;
                border-left: 4px solid #008B8B;
                padding: 16px;
                border-radius: 4px;
                margin: 20px 0;
            }
            .header, .footer {
                background-color: #008B8B;
                color: #ffffff;
                text-align: center;
            }
            .footer {
                padding: 16px;
                font-size: 12px;
            }
        </style>
    `
}

export const getMailBodyTemplate = (heading: string, username: string, content: string) => {
    return `
        <div class="container">
            <div class="header">
                <h1>${heading}</h1>
            </div>
            <div class="content">
                <p>Hello <strong>${username}</strong>,</p>
                ${content}
                <p>Best regards,<br/><strong>Alfatihah</strong></p>
            </div>
            <div class="footer">
                © ${new Date().getFullYear()} Alfatihah. All rights reserved.
            </div>
        </div>
    `
}

type EmailOrderPayload = {
    username: string | null
    orderNumber: string
    title: string
    content: string
}

export const getOrderMailTemplate = (data: EmailOrderPayload) => {
    const body = getMailBodyTemplate(data.title, data.username ?? 'Unknown User', `
        <p>${data.content}</p>
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