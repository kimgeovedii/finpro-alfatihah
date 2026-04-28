import { PrismaClient, UserRole, EmployeeRole, DayName } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
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
import { userSeedData } from '../src/constants/seed.const';
import BranchFactory from './factories/branch.factory';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding...\n');

  // Cleanup existing data
  console.log('🧹 Cleaning up existing data...');
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
  console.log('  ✅ Cleanup completed.\n');

  // Branch seeders (Include Branch Schedule)
  console.log(' Seeding Branches & Branch Schedules...');
  const branchFactory = new BranchFactory()
  const seededBranches = await branchFactory.createAll()
  console.log(`  Branches seeded: ${seededBranches.length}`)
  console.log(`  Branch Schedules seeded: ${seededBranches.length * 6}\n`)

  // User seeders (Include Employee & Address)
  console.log(' Seeding Users, Addresses & Employees...')
  const usersFactory = new UsersFactory()
  const seededUsers = await usersFactory.createAll()
  console.log(` Users seeded: ${seededUsers.length}`)
  console.log(` Addresses seeded: ${seededUsers.length * 3}`)
  console.log(` Employees seeded: ${userSeedData.filter(u => u.role === 'EMPLOYEE').length}\n`)

  // Product Categories Seeders
  console.log('📦 Seeding Product Categories...');

  const totalProductCategories = 13;
  const productCategoriesFactory = new ProductCategoriesFactory();
  await productCategoriesFactory.createMany(totalProductCategories);

  console.log(`  ✅ Product Categories seeded: ${totalProductCategories}\n`);

  // Products Seeders
  console.log('🛒 Seeding Products...');

  const totalProducts = 50;
  const productsFactory = new ProductsFactory();
  await productsFactory.createMany(totalProducts);

  console.log(`  ✅ Products seeded: ${totalProducts}\n`);

  // Product Images Seeders
  console.log('🖼️ Seeding Product Images...');

  const productImagesFactory = new ProductImagesFactory();
  const productImages = await productImagesFactory.createForAllProducts();
  const totalProductImages = productImages.length;

  console.log(`  ✅ Product Images seeded: ${totalProductImages}\n`);

  // Branch Inventories Seeders
  console.log('📦 Seeding Branch Inventories...');

  const branchInventoriesFactory = new BranchInventoriesFactory();
  const branchInventories = await branchInventoriesFactory.createForAllBranchProducts();
  const totalBranchInventories = branchInventories.length;

  console.log(`  ✅ Branch Inventories seeded: ${totalBranchInventories}\n`);

  // Discounts Seeders
  console.log('💰 Seeding Discounts...');

  const totalDiscounts = 15;
  const discountsFactory = new DiscountsFactory();
  await discountsFactory.createMany(totalDiscounts);

  console.log(`  ✅ Discounts seeded: ${totalDiscounts}\n`);

  // Product Discounts Seeders
  console.log('🏷️ Seeding Product Discounts...');

  const productDiscountsFactory = new ProductDiscountsFactory();
  const productDiscounts = await productDiscountsFactory.createForAllDiscounts();
  const totalProductDiscounts = productDiscounts.length;

  console.log(`  ✅ Product Discounts seeded: ${totalProductDiscounts}\n`);

  // Vouchers Seeders
  console.log('🎟️ Seeding Vouchers...');

  const totalVouchers = 20;
  const vouchersFactory = new VouchersFactory();
  await vouchersFactory.createMany(totalVouchers);

  console.log(`  ✅ Vouchers seeded: ${totalVouchers}\n`);

  // Voucher Useds Seeders
  console.log('📌 Seeding Voucher Useds...');

  const voucherUsedFactory = new VoucherUsedFactory();
  const voucherUseds = await voucherUsedFactory.linkVouchersToOrders();
  const totalVoucherUseds = voucherUseds.length;

  console.log(`  ✅ Voucher Useds seeded: ${totalVoucherUseds}\n`);

  // Voucher Referrals Seeders
  console.log('👥 Seeding Voucher Referrals...');

  const voucherReferralFactory = new VoucherReferralFactory();
  const voucherReferrals = await voucherReferralFactory.createForAllCustomers();
  const totalVoucherReferrals = voucherReferrals.length;

  console.log(`  ✅ Voucher Referrals seeded: ${totalVoucherReferrals}\n`);

  // Mutation Journals Seeders
  console.log('🚀 Seeding Mutation Journals...');

  const totalMutations = 25;
  const mutationJournalsFactory = new MutationJournalsFactory();
  await mutationJournalsFactory.createMany(totalMutations);

  console.log(`  ✅ Mutation Journals seeded: ${totalMutations}\n`);

  // Stock Journals Seeders
  console.log('📄 Seeding Stock Journals...');

  const totalStockJournals = 100;
  const stockJournalsFactory = new StockJournalsFactory();
  await stockJournalsFactory.createMany(totalStockJournals);

  console.log(`  ✅ Stock Journals seeded: ${totalStockJournals}\n`);

  // DONE
  console.log('========================================');
  console.log('🎉 Seeding finished successfully!');
  console.log('========================================');
  console.log('\n📋 Summary:');
  console.log(`  Users:            5`);
  console.log(`  Branches:         3`);
  console.log(`  Branch Schedules: ${5 + 2 + 5 + 1 + 7}`);
  console.log(`  Employees:        5`);
  console.log(`  Addresses:        3`);
  console.log(`  Product Categories: ${totalProductCategories}`);
  console.log(`  Products:         ${totalProducts}`);
  console.log(`  Product Images:   ${totalProductImages}`);
  console.log(`  Branch Inventories: ${totalBranchInventories}`);
  console.log(`  Discounts:        ${totalDiscounts}`);
  console.log(`  Product Discounts: ${totalProductDiscounts}`);
  console.log(`  Vouchers:         ${totalVouchers}`);
  console.log(`  Voucher Useds:    ${totalVoucherUseds}`);
  console.log(`  Voucher Referrals: ${totalVoucherReferrals}`);
  console.log(`  Mutation Journals: ${totalMutations}`);
  console.log(`  Stock Journals:   ${totalStockJournals}`);

  // Cart Orders Seeders (Include Cart Items)
  const totalCart = 5
  const cartFactory = new CartFactory()
  await cartFactory.createMany(totalCart, UserRole.CUSTOMER)
  console.log(`  Carts:        ${totalCart}`)

  // Cart Orders Seeders (Include Order Items & Payments)
  const totalOrder = 20
  const orderFactory = new OrderFactory()
  await orderFactory.createMany(totalOrder)
  console.log(`  Order:    ${totalOrder}`)

  console.log(`\n🔑 Default password: password123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
