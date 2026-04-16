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
                </div>
                <div class="footer">
                    © ${new Date().getFullYear()} Alfatihah. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
}