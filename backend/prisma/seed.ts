import { PrismaClient, UserRole, EmployeeRole, DayName } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import CartFactory from './factories/carts.factory';
import CartItemsFactory from './factories/cart_items.factory';
import OrderFactory from './factories/orders.factory';
import OrderItemsFactory from './factories/order_items.factory';
import PaymentFactory from './factories/payments.factory';
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

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding...\n');

  // --- Hash password ---
  const defaultPassword = await bcrypt.hash('password123', 10);

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
  console.log('  ✅ Cleanup completed.\n');

  // Users Seeders
  console.log('👤 Seeding Users...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'kimgeovedi@gmail.com' },
    update: {},
    create: {
      email: 'kimgeovedi@gmail.com',
      username: 'kimgeovedi',
      password: defaultPassword,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const customerUser1 = await prisma.user.upsert({
    where: { email: 'akimmustofa18@gmail.com' },
    update: {},
    create: {
      email: 'akimmustofa18@gmail.com',
      username: 'akimmustofa',
      password: defaultPassword,
      role: UserRole.CUSTOMER,
      emailVerifiedAt: new Date(),
    },
  });

  const customerUser2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      username: 'customer2',
      password: defaultPassword,
      role: UserRole.CUSTOMER,
      emailVerifiedAt: new Date(),
    },
  });

  const storeAdminUser = await prisma.user.upsert({
    where: { email: 'storeadmin@example.com' },
    update: {},
    create: {
      email: 'storeadmin@example.com',
      username: 'storeadmin',
      password: defaultPassword,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      username: 'superadmin',
      password: defaultPassword,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('  ✅ Users seeded.\n');

  // Branches seeders
  console.log('🏪 Seeding Branches...');

  const branchJakarta = await prisma.branch.create({
    data: {
      storeName: 'Toko Pusat Jakarta',
      address: 'Jl. Sudirman No. 1, Senayan',
      latitude: -6.2088,
      longitude: 106.8456,
      maxDeliveryDistance: 15.0,
      isActive: true,
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
    },
  });

  const branchBandung = await prisma.branch.create({
    data: {
      storeName: 'Toko Cabang Bandung',
      address: 'Jl. Braga No. 45, Sumur Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
      maxDeliveryDistance: 10.0,
      isActive: true,
      city: 'Bandung',
      province: 'Jawa Barat',
    },
  });

  const branchSurabaya = await prisma.branch.create({
    data: {
      storeName: 'Toko Cabang Surabaya',
      address: 'Jl. Tunjungan No. 88, Genteng',
      latitude: -7.2575,
      longitude: 112.7521,
      maxDeliveryDistance: 12.0,
      isActive: true,
      city: 'Surabaya',
      province: 'Jawa Timur',
    },
  });

  console.log('  ✅ Branches seeded.\n');

  // Branch Schedules Seeders
  console.log('📅 Seeding Branch Schedules...');

  const weekdays: DayName[] = [DayName.MON, DayName.TUE, DayName.WED, DayName.THU, DayName.FRI];
  const weekends: DayName[] = [DayName.SAT, DayName.SUN];

  // Jakarta: Full week (weekdays 08:00-21:00, weekends 09:00-18:00)
  for (const day of weekdays) {
    await prisma.branchSchedule.create({
      data: {
        branchId: branchJakarta.id,
        startTime: '08:00',
        endTime: '21:00',
        dayName: day,
      },
    });
  }
  for (const day of weekends) {
    await prisma.branchSchedule.create({
      data: {
        branchId: branchJakarta.id,
        startTime: '09:00',
        endTime: '18:00',
        dayName: day,
      },
    });
  }

  // Bandung: Weekdays only (09:00-20:00)
  for (const day of weekdays) {
    await prisma.branchSchedule.create({
      data: {
        branchId: branchBandung.id,
        startTime: '09:00',
        endTime: '20:00',
        dayName: day,
      },
    });
  }
  // Bandung: Saturday only
  await prisma.branchSchedule.create({
    data: {
      branchId: branchBandung.id,
      startTime: '10:00',
      endTime: '17:00',
      dayName: DayName.SAT,
    },
  });

  // Surabaya: Full week (08:30-21:30)
  for (const day of [...weekdays, ...weekends]) {
    await prisma.branchSchedule.create({
      data: {
        branchId: branchSurabaya.id,
        startTime: '08:30',
        endTime: '21:30',
        dayName: day,
      },
    });
  }

  console.log('  ✅ Branch Schedules seeded.\n');

  // Employees Seeders
  console.log('👷 Seeding Employees...');

  await prisma.employee.create({
    data: {
      fullName: 'Super Admin',
      role: EmployeeRole.SUPER_ADMIN,
      branchId: branchJakarta.id,
      userId: superAdminUser.id,
    },
  });

  await prisma.employee.create({
    data: {
      fullName: 'Store Admin Jakarta',
      role: EmployeeRole.STORE_ADMIN,
      branchId: branchJakarta.id,
      userId: storeAdminUser.id,
    },
  });

  await prisma.employee.create({
    data: {
      fullName: 'Store Admin Bandung',
      role: EmployeeRole.STORE_ADMIN,
      branchId: branchBandung.id,
      userId: null,
    },
  });

  await prisma.employee.create({
    data: {
      fullName: 'Store Admin Surabaya',
      role: EmployeeRole.STORE_ADMIN,
      branchId: branchSurabaya.id,
      userId: null,
    },
  });

  console.log('  ✅ Employees seeded.\n');

  // Addresses Seeders
  console.log('📍 Seeding Addresses...');

  await prisma.address.create({
    data: {
      userId: customerUser1.id,
      label: 'Rumah',
      type: 'Rumah',
      receiptName: 'Akim Mustofa',
      notes: 'Pagar warna hitam',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 10, Bandung',
      lat: -6.9175,
      long: 107.6191,
      isPrimary: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customerUser1.id,
      label: 'Kantor',
      type: 'Kantor',
      receiptName: 'Akim Mustofa',
      notes: 'Lantai 5',
      phone: '081234567891',
      address: 'Jl. Asia Afrika No. 1, Bandung',
      lat: -6.9211,
      long: 107.6108,
      isPrimary: false,
    },
  });

  await prisma.address.create({
    data: {
      userId: customerUser2.id,
      label: 'Apartemen',
      type: 'Rumah',
      receiptName: 'Customer 2',
      notes: 'Unit 12A',
      phone: '089876543210',
      address: 'Apartemen Mediterania, Jakarta',
      lat: -6.1751,
      long: 106.8650,
      isPrimary: true,
    },
  });

  console.log('  ✅ Addresses seeded.\n');

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
  console.log(`  Employees:        4`);
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

  console.log(`\n🔑 Default password: password123`);
  const totalCart = 5
  const cartFactory = new CartFactory()
  await cartFactory.createMany(totalCart, UserRole.CUSTOMER)
  console.log(`  Carts:        ${totalCart}`)

  // Cart Items Seeders
  const totalCartItems = 20
  const cartItemsFactory = new CartItemsFactory()
  await cartItemsFactory.createMany(totalCartItems)
  console.log(`  Cart Item:    ${totalCartItems}`)

  // Cart Orders Seeders
  const totalOrder = 10
  const orderFactory = new OrderFactory()
  await orderFactory.createMany(totalOrder)
  console.log(`  Order:    ${totalOrder}`)

  // Cart Orders Seeders
  const totalOrderItems = 10
  const orderItemsFactory = new OrderItemsFactory()
  await orderItemsFactory.createMany(totalOrderItems)
  console.log(`  Order Items:    ${totalOrderItems}`)

  // Cart Payments Seeders
  const totalPayments = 10
  const paymentFactory = new PaymentFactory()
  await paymentFactory.createMany(totalPayments)
  console.log(`  Payments:    ${totalPayments}`)

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
