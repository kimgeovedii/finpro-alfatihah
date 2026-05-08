import { OrderRepository } from "../repositories/order.repository"
import { UserRole } from "@prisma/client"
import PDFDocument from "pdfkit"
import ExcelJS from "exceljs"
import { currencyFormat } from "../../../constants/business.const"

export class OrderExportService {
    private orderRepo = new OrderRepository()

    async generateInvoicePdf(role: UserRole, userId: string, orderNumber: string) {
        console.log(role)
        // Repo : get detail order invoice by order number
        const order = await this.orderRepo.findOrderDetailByOrderNumber(role, userId, orderNumber)
        if (!order) throw { code: 404, message: "Order not found" }
    
        const doc = new PDFDocument({ margin: 40 })
    
        // Buffer stream 
        const buffers: Buffer[] = []
        doc.on("data", buffers.push.bind(buffers))
    
        return new Promise<Buffer>((resolve, reject) => {
            doc.on("end", () => resolve(Buffer.concat(buffers)))
            doc.on("error", reject)
        
            const pageWidth = doc.page.width
        
            // Background bar
            doc.rect(0, 0, pageWidth, 80).fill("#2d766f")
        
            // App name
            doc.fillColor("white").fontSize(22).font("Helvetica-Bold").text("Alfatihah", 40, 25)
        
            // Invoice title 
            doc.fontSize(16).text("INVOICE", 0, 30, { align: "right" })
            doc.moveDown(3)
        
            // Reset color
            doc.fillColor("black")
            doc.fontSize(10)

            const leftSpace = 40 
            doc.text(`Order Number: ${order.orderNumber}`, leftSpace)
            doc.text(`Status: ${order.status}`, leftSpace)
            doc.text(`Created At: ${new Date(order.createdAt).toLocaleString(currencyFormat)}`, leftSpace)
            doc.moveDown()
        
            // Customer section
            doc.font("Helvetica-Bold").text("Customer Info", leftSpace, undefined, { underline: true })
            doc.font("Helvetica")
            doc.text(`Name: ${order.address.receiptName}`, leftSpace)
            doc.text(`Phone: ${order.address.phone}`, leftSpace)
            doc.text(`Address: ${order.address.address}`, leftSpace)
            doc.moveDown()
        
            // Branch section
            doc.font("Helvetica-Bold").text("Store Info", { underline: true })
            doc.font("Helvetica")
            doc.text(`Store: ${order.branch.storeName}`)
            doc.text(`City: ${order.branch.city}`)
            doc.moveDown()
        
            // Card container
            const cardTop = doc.y
            const cardHeight = 400
            const cardPadding = 20
        
            // Background
            doc.roundedRect(40, cardTop, pageWidth - 80, cardHeight, 8).fill("#f5f7f7")
        
            // Left accent border
            doc.rect(40, cardTop, 6, cardHeight).fill("#2d766f")
        
            // Reset color
            doc.fillColor("black")
        
            // Order item
            const col = {
                no: 50,
                name: 80,
                qty: 360,
                price: 430,
                total: 500, 
            }
            let y = cardTop + cardPadding

            // Store name 
            doc.font("Helvetica-Bold").fontSize(14).text(order.branch.storeName, col.name, y)
            y += 25

            // Table header
            doc.fontSize(10).font("Helvetica-Bold")
            doc.text("Product", col.name, y)
            doc.text("Qty", col.qty, y)
            doc.text("Price", col.price, y)
            doc.text("Total", col.total, y) 
            y += 10

            doc.moveTo(col.name, y).lineTo(pageWidth - 40, y).strokeColor("#cccccc").stroke()
            y += 10

            // Order item
            doc.font("Helvetica")

            order.items.forEach(dt => {
                const product = dt.product.product
                const total = dt.quantity * dt.price

                doc.text(product.productName, col.name, y, { width: 250 })
                doc.text(`${dt.quantity}`, col.qty, y)
                doc.text(`Rp ${dt.price.toLocaleString(currencyFormat)}`, col.price, y)
                doc.text(`Rp ${total.toLocaleString(currencyFormat)}`, col.total, y)

                y += 20
            })
        
            // Divider
            y += 5
            doc.moveTo(col.name, y).lineTo(pageWidth - 40, y).dash(3, { space: 3 }).strokeColor("#cccccc").stroke().undash()
            y += 15
        
            // Summary
            const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0)
        
            doc.font("Helvetica-Bold").fontSize(11).text(`Total Items: ${totalItems}`, col.name, y)
            y += 18
        
            doc.fillColor("#2d766f").fontSize(12).text(`Total Price: Rp ${order.finalPrice.toLocaleString(currencyFormat)}`, col.name, y)
            doc.fillColor("black")
        
            // Payment
            doc.moveDown(2)
            doc.font("Helvetica-Bold").text("Payment Info", { underline: true })
        
            const payment = order.payments?.[0]
            if (payment) {
                doc.font("Helvetica")
                doc.text(`Method: ${payment.method}`)
                doc.text(`Status: ${payment.status}`)
            }
            doc.moveDown()
        
            // Footer
            doc.text(`Total Price: Rp ${order.totalPrice.toLocaleString(currencyFormat)}`)
            doc.text(`Final Price: Rp ${order.finalPrice.toLocaleString(currencyFormat)}`)
            doc.text(`Shipping: Rp ${order.shippingCost.toLocaleString(currencyFormat)}`)
        
            doc.end()
        })
    }

    async generateTransactionHistoryExcel(userId: string): Promise<Buffer> {
        // Repo : get all transaction by user id
        const data = await this.orderRepo.getTransactionHistory(userId)

        // Flatten data
        const rows = data.flatMap(order =>
            order.items.map(dt => {
                const product = dt.product.product

                return {
                    createdAt: order.createdAt,
                    orderNumber: order.orderNumber,
                    category: product.category.name,
                    productName: product.productName,
                    qty: dt.quantity,
                    total: product.basePrice * dt.quantity,
                    storeName: order.branch.storeName
                }
            })
        )

        // Sort 
        rows.sort((a, b) => {
            if (b.createdAt.getTime() !== a.createdAt.getTime()) return b.createdAt.getTime() - a.createdAt.getTime()
            return a.productName.localeCompare(b.productName)
        })

        // Create workbook
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet("Orders Report")

        // Header
        sheet.columns = [
            { header: "Created At", key: "createdAt", width: 20 },
            { header: "Order Number", key: "orderNumber", width: 25 },
            { header: "Category", key: "category", width: 20 },
            { header: "Product Name", key: "productName", width: 30 },
            { header: "Qty", key: "qty", width: 10 },
            { header: "Total Price", key: "total", width: 20 },
            { header: "Store Name", key: "storeName", width: 25 },
        ]

        // Insert rows
        rows.forEach(row => {
            sheet.addRow({
                ...row,
                createdAt: new Date(row.createdAt).toLocaleString(currencyFormat)
            })
        })

        // Currency format
        sheet.getColumn("total").numFmt = '"Rp" #,##0'

        // Border 
        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                }
            })
        })

        // Export buffer
        const buffer = await workbook.xlsx.writeBuffer()
        return Buffer.from(buffer)
    }
}