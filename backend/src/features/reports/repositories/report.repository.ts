import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class ReportRepository {
  public async getMonthlySalesSummary(startDate: Date, endDate: Date, branchId?: string) {
    const result = await prisma.orders.aggregate({
      _sum: {
        finalPrice: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          in: ["CONFIRMED", "SHIPPED"],
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(branchId ? { branchId } : {}),
      },
    });

    return {
      totalRevenue: result._sum.finalPrice || 0,
      totalOrders: result._count.id || 0,
    };
  }

  public async getSalesByCategory(startDate: Date, endDate: Date, branchId?: string) {
    const rawData = await prisma.$queryRaw`
      SELECT 
        c.id as "categoryId",
        c.name as "categoryName",
        CAST(COALESCE(SUM(oi.price * oi.quantity), 0) AS BIGINT) as "revenue",
        CAST(COALESCE(SUM(oi.quantity), 0) AS INTEGER) as "quantitySold"
      FROM product_categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN branch_inventories bi ON bi.product_id = p.id
      LEFT JOIN order_items oi ON oi.product_id = bi.id
      LEFT JOIN orders o ON oi.order_id = o.id 
        AND o.status IN ('CONFIRMED', 'SHIPPED') 
        AND o.created_at >= ${startDate} 
        AND o.created_at <= ${endDate}
        AND (${branchId}::text IS NULL OR o.branch_id = ${branchId})
      GROUP BY c.id, c.name
      ORDER BY "revenue" DESC
    `;
    return rawData as any[];
  }

  public async getSalesByProduct(startDate: Date, endDate: Date, branchId?: string) {
    const rawData = await prisma.$queryRaw`
      SELECT 
        p.id as "productId",
        p.product_name as "productName",
        CAST(COALESCE(SUM(oi.price * oi.quantity), 0) AS BIGINT) as "revenue",
        CAST(COALESCE(SUM(oi.quantity), 0) AS INTEGER) as "quantitySold"
      FROM products p
      LEFT JOIN branch_inventories bi ON bi.product_id = p.id
      LEFT JOIN order_items oi ON oi.product_id = bi.id
      LEFT JOIN orders o ON oi.order_id = o.id 
        AND o.status IN ('CONFIRMED', 'SHIPPED') 
        AND o.created_at >= ${startDate} 
        AND o.created_at <= ${endDate}
        AND (${branchId}::text IS NULL OR o.branch_id = ${branchId})
      GROUP BY p.id, p.product_name
      ORDER BY "revenue" DESC
    `;
    return rawData as any[];
  }

  public async getStockSummary(startDate: Date, endDate: Date, branchId?: string) {
    const rawData = await prisma.$queryRaw`
      SELECT 
        p.id as "productId",
        p.product_name as "productName",
        CAST(COALESCE(SUM(CASE WHEN sj.transaction_type = 'IN' THEN sj.quantity_change ELSE 0 END), 0) as INTEGER) as "totalAdditions",
        CAST(COALESCE(SUM(CASE WHEN sj.transaction_type = 'OUT' THEN sj.quantity_change ELSE 0 END), 0) as INTEGER) as "totalDeductions",
        CAST(COALESCE((SELECT SUM(current_stock) FROM branch_inventories WHERE product_id = p.id AND (${branchId}::text IS NULL OR branch_id = ${branchId})), 0) as INTEGER) as "endingStock"
      FROM products p
      LEFT JOIN stock_journals sj ON p.id = sj.product_id 
        AND sj.created_at >= ${startDate} 
        AND sj.created_at <= ${endDate}
      LEFT JOIN branch_inventories bi ON sj.branch_inventory_id = bi.id
      WHERE (${branchId}::text IS NULL OR bi.branch_id = ${branchId})
      GROUP BY p.id, p.product_name
      ORDER BY p.product_name ASC
    `;
    return rawData as any[];
  }

  public async getDetailedStock(productId: string, startDate: Date, endDate: Date, branchId?: string) {
    return prisma.stock_journals.findMany({
      where: {
        productId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(branchId ? { branchInventory: { branchId } } : {}),
      },
      include: {
        product: true,
        branchInventory: {
          include: {
            branch: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
  public async getYearlySalesTrend(year: number, branchId?: string) {
    const rawData = await prisma.$queryRaw`
      SELECT 
        CAST(EXTRACT(MONTH FROM o.created_at + INTERVAL '7 hours') AS INTEGER) as "month",
        CAST(COALESCE(SUM(o.final_price), 0) AS BIGINT) as "revenue"
      FROM orders o
      WHERE o.status IN ('CONFIRMED', 'SHIPPED') 
        AND EXTRACT(YEAR FROM o.created_at + INTERVAL '7 hours') = ${year}
        AND (${branchId}::text IS NULL OR o.branch_id = ${branchId})
      GROUP BY EXTRACT(MONTH FROM o.created_at + INTERVAL '7 hours')
      ORDER BY "month" ASC
    `;
    return rawData as any[];
  }
}
