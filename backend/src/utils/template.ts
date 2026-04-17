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