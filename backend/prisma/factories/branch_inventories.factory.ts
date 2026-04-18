import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"
import { BranchRepository } from "../../src/features/branch/repositories/branch.repository"
import { ProductService } from "../../src/features/products/services/product.service"

class BranchInventoriesFactory {
    private branchRepository: BranchRepository
    private productService: ProductService

    constructor(){
        this.branchRepository = new BranchRepository()
        this.productService = new ProductService()
    }

    public create = async (branchId?: string, productId?: string) => {
        // Use provided IDs or get random ones
        let targetBranchId = branchId
        let targetProductId = productId

        if (!targetBranchId) {
            const branch = await this.branchRepository.findRandomBranch()
            if (!branch) throw new Error('Cannot create branch inventory without branch')
            targetBranchId = branch.id
        }

        if (!targetProductId) {
            // Get random product
            const { meta } = await this.productService.findAllProducts({}, 1, 1);
            if (meta.total === 0) throw new Error('Cannot create branch inventory without products');

            const skip = Math.floor(Math.random() * meta.total);
            const { data } = await this.productService.findAllProducts({}, skip + 1, 1);
            
            const product = data[0];
            if (!product) throw new Error('Cannot create branch inventory without product')
            targetProductId = product.id
        }

        // Generate random stock between 10 and 500 units
        const currentStock = faker.number.int({ min: 10, max: 500 })

        // Check if this inventory already exists to avoid unique constraint violation
        const existing = await prisma.branch_inventories.findFirst({
            where: {
                branchId: targetBranchId,
                productId: targetProductId
            }
        })

        if (existing) {
            // Update existing inventory instead of creating duplicate
            return prisma.branch_inventories.update({
                where: { id: existing.id },
                data: { currentStock }
            })
        }

        return prisma.branch_inventories.create({
            data: {
                id: faker.string.uuid(),
                branchId: targetBranchId,
                productId: targetProductId,
                currentStock,
            },
        })
    }

    public createMany = async (count: number) => {
        const createdInventories = []
        for (let i = 0; i < count; i++) {
            const inventory = await this.create()
            createdInventories.push(inventory)
        }
        return createdInventories
    }

    public createForAllBranchProducts = async () => {
        const branches = await prisma.branch.findMany({
            select: { id: true, storeName: true }
        })

        let products: any[] = [];
        let page = 1;
        let hasMore = true;

        while(hasMore) {
           const { data, meta } = await this.productService.findAllProducts({}, page, 50);
           products.push(...data);
           if (page >= meta.totalPages || data.length === 0) hasMore = false;
           page++;
        }

        if (branches.length === 0 || products.length === 0) {
            throw new Error('Cannot create inventory without branches or products')
        }

        const allInventories = []

        // Create inventory for each branch-product combination
        for (const branch of branches) {
            for (const product of products) {
                // Generate random stock between 10 and 500 units
                const currentStock = faker.number.int({ min: 10, max: 500 })

                const inventory = await prisma.branch_inventories.create({
                    data: {
                        id: faker.string.uuid(),
                        branchId: branch.id,
                        productId: product.id,
                        currentStock,
                    },
                })
                allInventories.push(inventory)
            }
        }

        return allInventories
    }
}

export default BranchInventoriesFactory
