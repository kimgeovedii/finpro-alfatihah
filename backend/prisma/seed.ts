import { PrismaClient, UserRole } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import CartFactory from './factories/carts.factory';
import OrderFactory from './factories/orders.factory';
import ProductCategoriesFactory from './factories/product_categories.factory';
import ProductsFactory from './factories/products.factory';
import ProductImagesFactory from './factories/product_images.factory';
import BranchInventoriesFactory from './factories/branch_inventories.factory';
import DiscountsFactory from './factories/discounts.factory';
import ProductDiscountsFactory from './factories/product_discounts.factory';
import VouchersFactory from './factories/vouchers.factory';
import VoucherUsedFactory from './factories/voucher_used.factory';
import VoucherReferralFactory from './factories/voucher_referral.factory';
import StockJournalsFactory from './factories/stock_journals.factory';
import MutationJournalsFactory from './factories/mutation_journals.factory';
import UsersFactory from './factories/user.factory';
import BranchFactory from './factories/branch.factory';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Reset all table
  await prisma.stock_journals.deleteMany()
  await prisma.mutation_journals.deleteMany()
  await prisma.order_items.deleteMany()
  await prisma.orders.deleteMany()
  await prisma.voucher_useds.deleteMany()
  await prisma.voucher_referral.deleteMany()
  await prisma.vouchers.deleteMany()
  await prisma.cart_items.deleteMany()
  await prisma.carts.deleteMany()
  await prisma.product_discounts.deleteMany()
  await prisma.discounts.deleteMany()
  await prisma.branch_inventories.deleteMany()
  await prisma.product_categories.deleteMany()
  await prisma.product_images.deleteMany()
  await prisma.products.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.address.deleteMany()
  await prisma.branchSchedule.deleteMany()
  await prisma.user.deleteMany()
  await prisma.branch.deleteMany()

  // Branch seeders (Include Branch Schedule)
  const branchFactory = new BranchFactory()
  await branchFactory.createAll()

  // User seeders (Include Employee & Address)
  const usersFactory = new UsersFactory()
  await usersFactory.createAll()

  const totalProductCategories = 13;
  const productCategoriesFactory = new ProductCategoriesFactory();
  await productCategoriesFactory.createMany(totalProductCategories);

  const totalProducts = 50;
  const productsFactory = new ProductsFactory();
  await productsFactory.createMany(totalProducts);

  const productImagesFactory = new ProductImagesFactory();
  await productImagesFactory.createForAllProducts();

  const branchInventoriesFactory = new BranchInventoriesFactory();
  await branchInventoriesFactory.createForAllBranchProducts();

  const totalDiscounts = 15;
  const discountsFactory = new DiscountsFactory();
  await discountsFactory.createMany(totalDiscounts);

  const productDiscountsFactory = new ProductDiscountsFactory();
  await productDiscountsFactory.createForAllDiscounts();

  const totalVouchers = 20;
  const vouchersFactory = new VouchersFactory();
  await vouchersFactory.createMany(totalVouchers);

  const voucherUsedFactory = new VoucherUsedFactory();
  await voucherUsedFactory.linkVouchersToOrders();

  const voucherReferralFactory = new VoucherReferralFactory();
  await voucherReferralFactory.createForAllCustomers();

  const totalMutations = 25;
  const mutationJournalsFactory = new MutationJournalsFactory();
  await mutationJournalsFactory.createMany(totalMutations);

  const totalStockJournals = 100;
  const stockJournalsFactory = new StockJournalsFactory();
  await stockJournalsFactory.createMany(totalStockJournals);

  // Cart Orders Seeders (Include Cart Items)
  const totalCart = 5
  const cartFactory = new CartFactory()
  await cartFactory.createMany(totalCart, UserRole.CUSTOMER)

  // Cart Orders Seeders (Include Order Items & Payments)
  const totalOrder = 20
  const orderFactory = new OrderFactory()
  await orderFactory.createMany(totalOrder)
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
