import { faker } from "@faker-js/faker"
import { prisma } from "../../src/config/prisma"

class ProductsFactory {
    private productsByCategory = {
        'Fruits': [
            { name: 'Fresh Apples', description: 'Crisp and juicy red apples, perfect for snacking' },
            { name: 'Bananas', description: 'Sweet and ripe bananas, great for smoothies or breakfast' },
            { name: 'Oranges', description: 'Fresh oranges packed with vitamin C' },
            { name: 'Strawberries', description: 'Sweet and juicy strawberries, perfect for desserts' },
            { name: 'Grapes', description: 'Seedless green grapes, refreshing and healthy' },
            { name: 'Pineapple', description: 'Sweet tropical pineapple, great for fruit salads' },
            { name: 'Mangoes', description: 'Ripe and sweet mangoes, perfect for smoothies' },
            { name: 'Avocados', description: 'Creamy avocados, ideal for guacamole or toast' }
        ],
        'Vegetables': [
            { name: 'Carrots', description: 'Fresh crunchy carrots, perfect for salads or cooking' },
            { name: 'Broccoli', description: 'Green broccoli florets, rich in vitamins' },
            { name: 'Spinach', description: 'Fresh leafy spinach, great for salads and smoothies' },
            { name: 'Tomatoes', description: 'Ripe red tomatoes, essential for cooking' },
            { name: 'Cucumbers', description: 'Cool and refreshing cucumbers' },
            { name: 'Bell Peppers', description: 'Colorful bell peppers, sweet and crunchy' },
            { name: 'Onions', description: 'Yellow onions, perfect for cooking and seasoning' },
            { name: 'Potatoes', description: 'Fresh potatoes, versatile for many dishes' }
        ],
        'Dairy': [
            { name: 'Whole Milk', description: 'Fresh whole milk, perfect for drinking or cooking' },
            { name: 'Cheddar Cheese', description: 'Sharp cheddar cheese, great for sandwiches' },
            { name: 'Greek Yogurt', description: 'Creamy Greek yogurt, high in protein' },
            { name: 'Butter', description: 'Fresh butter, perfect for baking and cooking' },
            { name: 'Eggs', description: 'Farm fresh eggs, dozen pack' },
            { name: 'Mozzarella Cheese', description: 'Fresh mozzarella, perfect for pizza' },
            { name: 'Sour Cream', description: 'Creamy sour cream, great for dips' },
            { name: 'Cottage Cheese', description: 'Low-fat cottage cheese, healthy snack' }
        ],
        'Meat & Poultry': [
            { name: 'Chicken Breast', description: 'Boneless chicken breast, perfect for grilling' },
            { name: 'Ground Beef', description: 'Lean ground beef, ideal for burgers and meatballs' },
            { name: 'Pork Chops', description: 'Tender pork chops, great for dinner' },
            { name: 'Turkey Bacon', description: 'Low-fat turkey bacon, healthier alternative' },
            { name: 'Salmon Fillet', description: 'Fresh salmon fillet, rich in omega-3' },
            { name: 'Beef Steak', description: 'Premium beef steak, perfect for grilling' },
            { name: 'Chicken Thighs', description: 'Juicy chicken thighs, flavorful and tender' },
            { name: 'Lamb Chops', description: 'Tender lamb chops, gourmet choice' }
        ],
        'Bakery': [
            { name: 'White Bread', description: 'Soft white bread loaf, perfect for sandwiches' },
            { name: 'Croissants', description: 'Buttery croissants, fresh from the oven' },
            { name: 'Chocolate Chip Cookies', description: 'Chewy chocolate chip cookies, homemade taste' },
            { name: 'Bagels', description: 'Fresh bagels, perfect for breakfast' },
            { name: 'Muffins', description: 'Assorted muffins, blueberry and chocolate' },
            { name: 'Sourdough Bread', description: 'Artisan sourdough bread, crusty and delicious' },
            { name: 'Donuts', description: 'Glazed donuts, sweet morning treat' },
            { name: 'Brownies', description: 'Fudgy chocolate brownies, decadent dessert' }
        ],
        'Beverages': [
            { name: 'Orange Juice', description: 'Fresh squeezed orange juice, no pulp' },
            { name: 'Coffee', description: 'Premium ground coffee, rich and bold' },
            { name: 'Green Tea', description: 'Organic green tea bags, refreshing and healthy' },
            { name: 'Soda', description: 'Assorted soda flavors, classic refreshment' },
            { name: 'Mineral Water', description: 'Sparkling mineral water, naturally sourced' },
            { name: 'Milk', description: 'Fresh whole milk, perfect for drinking' },
            { name: 'Energy Drink', description: 'Caffeinated energy drink, boost your day' },
            { name: 'Iced Tea', description: 'Sweetened iced tea, refreshing drink' }
        ],
        'Snacks': [
            { name: 'Potato Chips', description: 'Crispy potato chips, classic snack' },
            { name: 'Chocolate Bar', description: 'Milk chocolate bar, smooth and creamy' },
            { name: 'Popcorn', description: 'Butter popcorn, movie night favorite' },
            { name: 'Trail Mix', description: 'Mixed nuts and dried fruits, healthy snack' },
            { name: 'Granola Bars', description: 'Chewy granola bars, perfect for on-the-go' },
            { name: 'Pretzels', description: 'Salted pretzels, crunchy and delicious' },
            { name: 'Candy', description: 'Assorted hard candies, sweet treats' },
            { name: 'Rice Cakes', description: 'Plain rice cakes, light and crispy' }
        ],
        'Frozen Foods': [
            { name: 'Frozen Pizza', description: 'Cheese frozen pizza, quick and easy meal' },
            { name: 'Ice Cream', description: 'Vanilla ice cream, creamy and delicious' },
            { name: 'Frozen Vegetables', description: 'Mixed frozen vegetables, convenient and healthy' },
            { name: 'Frozen Berries', description: 'Mixed frozen berries, perfect for smoothies' },
            { name: 'Frozen Meals', description: 'Ready-to-eat frozen meals, time-saving' },
            { name: 'Frozen Fish', description: 'Frozen salmon fillets, convenient seafood' },
            { name: 'Frozen Waffles', description: 'Buttermilk frozen waffles, quick breakfast' },
            { name: 'Frozen Fries', description: 'Crispy frozen fries, perfect side dish' }
        ],
        'Canned Goods': [
            { name: 'Canned Tomatoes', description: 'Diced canned tomatoes, perfect for sauces' },
            { name: 'Canned Beans', description: 'Black beans, ready to use' },
            { name: 'Canned Soup', description: 'Chicken noodle soup, comforting meal' },
            { name: 'Canned Tuna', description: 'Chunk light tuna, protein-rich' },
            { name: 'Canned Corn', description: 'Sweet corn kernels, versatile ingredient' },
            { name: 'Canned Peas', description: 'Green peas, healthy and convenient' },
            { name: 'Canned Fruit', description: 'Peach slices in syrup, sweet dessert' },
            { name: 'Canned Olives', description: 'Black olives, perfect for pizza' }
        ],
        'Spices & Herbs': [
            { name: 'Black Pepper', description: 'Ground black pepper, essential seasoning' },
            { name: 'Garlic Powder', description: 'Garlic powder, convenient flavor enhancer' },
            { name: 'Cinnamon', description: 'Ground cinnamon, sweet and aromatic' },
            { name: 'Basil', description: 'Dried basil leaves, Italian herb' },
            { name: 'Oregano', description: 'Dried oregano, Mediterranean herb' },
            { name: 'Paprika', description: 'Smoked paprika, adds color and flavor' },
            { name: 'Cumin', description: 'Ground cumin, earthy spice' },
            { name: 'Thyme', description: 'Dried thyme, versatile herb' }
        ],
        'Breakfast': [
            { name: 'Cereal', description: 'Corn flakes cereal, classic breakfast' },
            { name: 'Oatmeal', description: 'Quick oats, healthy morning meal' },
            { name: 'Pancake Mix', description: 'Complete pancake mix, easy breakfast' },
            { name: 'Breakfast Bars', description: 'Nutritious breakfast bars, grab-and-go' },
            { name: 'Jam', description: 'Strawberry jam, perfect for toast' },
            { name: 'Honey', description: 'Pure honey, natural sweetener' },
            { name: 'Instant Oatmeal', description: 'Flavored instant oatmeal packets' },
            { name: 'Breakfast Sausage', description: 'Pork breakfast sausage, savory start' }
        ],
        'Household': [
            { name: 'Dish Soap', description: 'Lemon scented dish soap, cuts grease' },
            { name: 'Laundry Detergent', description: 'Liquid laundry detergent, clean clothes' },
            { name: 'Paper Towels', description: 'Absorbent paper towels, multipurpose' },
            { name: 'Toilet Paper', description: 'Soft toilet paper, comfortable and reliable' },
            { name: 'Trash Bags', description: 'Heavy duty trash bags, durable' },
            { name: 'All-Purpose Cleaner', description: 'Multi-surface cleaner, streak-free shine' },
            { name: 'Sponges', description: 'Kitchen sponges, scrub and clean' },
            { name: 'Facial Tissues', description: 'Soft facial tissues, gentle on skin' }
        ],
        'Personal Care': [
            { name: 'Shampoo', description: 'Moisturizing shampoo, healthy hair' },
            { name: 'Toothpaste', description: 'Fluoride toothpaste, fresh breath' },
            { name: 'Body Wash', description: 'Refreshing body wash, clean and fresh' },
            { name: 'Deodorant', description: 'Antiperspirant deodorant, long-lasting protection' },
            { name: 'Facial Cleanser', description: 'Gentle facial cleanser, clear skin' },
            { name: 'Hand Soap', description: 'Antibacterial hand soap, germ protection' },
            { name: 'Shaving Cream', description: 'Smooth shaving cream, comfortable shave' },
            { name: 'Moisturizer', description: 'Daily moisturizer, hydrated skin' }
        ]
    }

    private async findRandomCategory() {
        const count = await prisma.product_categories.count()
        if (count === 0) return null

        const skip = Math.floor(Math.random() * count)

        return prisma.product_categories.findFirst({
            skip,
            select: { id: true, name: true }
        })
    }

    public create = async () => {
        // Get random category
        const category = await this.findRandomCategory()
        if (!category) throw new Error('Cannot create product without category')

        // Get products for this category
        const categoryProducts = this.productsByCategory[category.name as keyof typeof this.productsByCategory]
        if (!categoryProducts) throw new Error(`No products defined for category: ${category.name}`)

        // Select random product from category
        const productData = faker.helpers.arrayElement(categoryProducts)

        // Generate slug
        const slugName = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        // Generate random price between 5,000 and 150,000 IDR
        const basePrice = faker.number.float({ min: 5000, max: 150000, fractionDigits: 0 })

        return prisma.products.create({
            data: {
                id: faker.string.uuid(),
                productName: productData.name,
                slugName,
                description: productData.description,
                categoryId: category.id,
                basePrice,
                createdAt: faker.date.past({ years: 1 }),
            },
        })
    }

    public createMany = async (count: number) => {
        const createdProducts = []
        for (let i = 0; i < count; i++) {
            const product = await this.create()
            createdProducts.push(product)
        }
        return createdProducts
    }
}

export default ProductsFactory
