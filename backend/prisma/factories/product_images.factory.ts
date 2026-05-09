import { faker } from "@faker-js/faker"
import { ProductService } from "../../src/features/products/services/product.service"
import { ProductImageService } from "../../src/features/products/services/productImage.service"

class ProductImagesFactory {
    private productService: ProductService;
    private productImageService: ProductImageService;

    constructor() {
        this.productService = new ProductService();
        this.productImageService = new ProductImageService();
    }
    private async findRandomProduct() {
        const { meta } = await this.productService.findAllProducts({}, 1, 1);
        if (meta.total === 0) return null;

        const skip = Math.floor(Math.random() * meta.total);
        const { data } = await this.productService.findAllProducts({}, skip + 1, 1);
        
        return data[0];
    }

    public create = async (productId?: string) => {
        // Use provided productId or get random product
        let targetProduct: any;
        if (productId) {
            targetProduct = await this.productService.getProductById(productId);
        } else {
            targetProduct = await this.findRandomProduct();
        }
        
        if (!targetProduct) throw new Error('Cannot create product image without product or valid productId')

        // Generate placeholder image URL
        const keyword = encodeURIComponent(targetProduct.productName);
        const imageUrl = `https://placehold.co/800x600?text=${keyword}`;

        // For simplicity, set first image as primary, others as secondary
        // In a real scenario, you'd check existing images for the product
        const isPrimary = Math.random() < 0.3 // 30% chance of being primary

        return this.productImageService.createImage({
            id: faker.string.uuid(),
            productId: targetProduct.id,
            imageUrl,
            isPrimary,
            createdAt: faker.date.past({ years: 1 }),
        })
    }

    public createMany = async (count: number) => {
        const createdImages = []
        for (let i = 0; i < count; i++) {
            const image = await this.create()
            createdImages.push(image)
        }
        return createdImages
    }

    // Create multiple images for a specific product
    public createForProduct = async (productId: string, count: number = 3) => {
        const createdImages = []
        let hasPrimary = false

        const targetProduct = await this.productService.getProductById(productId);
        if (!targetProduct) throw new Error(`Product not found for id ${productId}`);

        for (let i = 0; i < count; i++) {
            // Ensure at least one primary image per product
            const forcePrimary = !hasPrimary && i === count - 1
            const isPrimary = forcePrimary || Math.random() < 0.4

            if (isPrimary) hasPrimary = true

            const keyword = encodeURIComponent(targetProduct.productName);
            const imageUrl = `https://placehold.co/800x600?text=${keyword}`;

            const image = await this.productImageService.createImage({
                id: faker.string.uuid(),
                productId,
                imageUrl,
                isPrimary,
                createdAt: faker.date.past({ years: 1 }),
            })
            createdImages.push(image)
        }
        return createdImages
    }

    // Create images for all products (1-4 images per product)
    public createForAllProducts = async () => {
        let products: any[] = [];
        let page = 1;
        let hasMore = true;

        while(hasMore) {
           const { data, meta } = await this.productService.findAllProducts({}, page, 50);
           products.push(...data);
           if (page >= meta.totalPages || data.length === 0) hasMore = false;
           page++;
        }

        const allImages = []
        for (const product of products) {
            // Each product gets 1-4 random images
            const imageCount = faker.number.int({ min: 1, max: 4 })
            const productImages = await this.createForProduct(product.id, imageCount)
            allImages.push(...productImages)
        }
        return allImages
    }
    // Create images using specific URLs
    public createWithCustomUrls = async (productId: string, urls: string[]) => {
        const createdImages = []
        
        for (let i = 0; i < urls.length; i++) {
            // First image in the array is usually primary
            const isPrimary = i === 0

            const image = await this.productImageService.createImage({
                id: faker.string.uuid(),
                productId,
                imageUrl: urls[i],
                isPrimary,
                createdAt: faker.date.past({ years: 1 }),
            })
            createdImages.push(image)
        }
        return createdImages
    }
}

export default ProductImagesFactory
