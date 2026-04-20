import { faker } from "@faker-js/faker"
import { ProductCategoryService } from "../../src/features/products/services/productCategory.service"

class ProductCategoriesFactory {
    private productCategoryService: ProductCategoryService;

    constructor() {
        this.productCategoryService = new ProductCategoryService();
    }
    private categories = [
        'Fruits',
        'Vegetables',
        'Dairy',
        'Meat & Poultry',
        'Bakery',
        'Beverages',
        'Snacks',
        'Frozen Foods',
        'Canned Goods',
        'Spices & Herbs',
        'Breakfast',
        'Household',
        'Personal Care'
    ]

    private descriptions = [
        'Fresh and nutritious fruits for your daily needs',
        'Crisp and healthy vegetables straight from the farm',
        'Milk, cheese, yogurt and other dairy products',
        'High-quality meat and poultry products',
        'Freshly baked bread, cakes, and pastries',
        'Refreshing drinks and beverages for every occasion',
        'Delicious snacks and treats for munching',
        'Frozen foods to keep your meals convenient',
        'Canned goods for long-term storage',
        'Aromatic spices and herbs to enhance your cooking',
        'Start your day right with our breakfast selection',
        'Essential household items and cleaning supplies',
        'Personal care products for your daily routine'
    ]

    public create = async (index?: number) => {
        const idx = index !== undefined ? index : Math.floor(Math.random() * this.categories.length)
        const name = this.categories[idx]
        const description = this.descriptions[idx]

        // Simple slug generation
        const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        return this.productCategoryService.createCategory({
            id: faker.string.uuid(),
            name,
            slugName,
            description,
            createdAt: faker.date.past({ years: 1 }),
        })
    }

    public createMany = async (count: number) => {
        const createdCategories = []
        // If count equals the number of predefined categories, create all unique ones
        if (count === this.categories.length) {
            for (let i = 0; i < count; i++) {
                const category = await this.create(i)
                createdCategories.push(category)
            }
        } else {
            // Otherwise, create random ones (might have duplicates)
            for (let i = 0; i < count; i++) {
                const category = await this.create()
                createdCategories.push(category)
            }
        }
        return createdCategories
    }
}

export default ProductCategoriesFactory
