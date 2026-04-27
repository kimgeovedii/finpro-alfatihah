import { faker } from "@faker-js/faker"
import { ProductService } from "../../src/features/products/services/product.service"
import { DiscountService } from "../../src/features/discounts/services/discount.service"
import { ProductDiscountService } from "../../src/features/discounts/services/productDiscount.service"

class ProductDiscountsFactory {
    private productService: ProductService;
    private discountService: DiscountService;
    private productDiscountService: ProductDiscountService;

    constructor() {
        this.productService = new ProductService();
        this.discountService = new DiscountService();
        this.productDiscountService = new ProductDiscountService();
    }
    private async findRandomProduct() {
        const { meta } = await this.productService.findAllProducts({}, 1, 1);
        if (meta.total === 0) return null;

        const skip = Math.floor(Math.random() * meta.total);
        const { data } = await this.productService.findAllProducts({}, skip + 1, 1);
        
        return data[0];
    }

    private async findRandomDiscount() {
        const { meta } = await this.discountService.findAllDiscounts({}, 1, 1);
        if (meta.total === 0) return null;

        const skip = Math.floor(Math.random() * meta.total);
        const { data } = await this.discountService.findAllDiscounts({}, skip + 1, 1);
        
        return data[0];
    }

    public create = async (productId?: string, discountId?: string) => {
        // Use provided IDs or get random ones
        let targetProductId = productId
        let targetDiscountId = discountId

        if (!targetProductId) {
            const product = await this.findRandomProduct()
            if (!product) throw new Error('Cannot create product discount without product')
            targetProductId = product.id
        }

        if (!targetDiscountId) {
            const discount = await this.findRandomDiscount()
            if (!discount) throw new Error('Cannot create product discount without discount')
            targetDiscountId = discount.id
        }

        // The service automatically handles avoiding duplicate assignments natively thanks to its generic repository skipDuplicates strategy
        await this.productDiscountService.assignProducts(targetDiscountId!, [targetProductId]); // check this again

        return { productId: targetProductId, discountId: targetDiscountId };
    }

    public createMany = async (count: number) => {
        const createdProductDiscounts = []
        for (let i = 0; i < count; i++) {
            const productDiscount = await this.create()
            createdProductDiscounts.push(productDiscount)
        }
        return createdProductDiscounts
    }

    // Link each discount to 5-15 random products
    public createForAllDiscounts = async () => {
        let discounts: any[] = [];
        let page = 1;
        let hasMore = true;

        while(hasMore) {
           const { data, meta } = await this.discountService.findAllDiscounts({}, page, 50);
           discounts.push(...data);
           if (page >= meta.totalPages || data.length === 0) hasMore = false;
           page++;
        }

        if (discounts.length === 0) {
            throw new Error('Cannot create product discounts without discounts')
        }

        const allProductDiscounts = []

        for (const discount of discounts) {
            // Each discount applies to 5-15 products
            const productCount = faker.number.int({ min: 5, max: 15 })

            for (let i = 0; i < productCount; i++) {
                const productDiscount = await this.create(undefined, discount.id)
                allProductDiscounts.push(productDiscount)
            }
        }

        return allProductDiscounts
    }
}

export default ProductDiscountsFactory
