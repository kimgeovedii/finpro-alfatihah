import { PrismaClient, UserRole, EmployeeRole, DayName } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import CartFactory from './factories/carts.factory';
import CartItemsFactory from './factories/cart_items.factory';
import OrderFactory from './factories/orders.factory';
import OrderItemsFactory from './factories/order_items.factory';
import PaymentFactory from './factories/payments.factory';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding...\n');

  // --- Hash password ---
  const defaultPassword = await bcrypt.hash('password123', 10);

  // ============================================================
  // 1. USERS
  // ============================================================
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

  // ============================================================
  // 2. BRANCHES
  // ============================================================
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

  // ============================================================
  // 3. BRANCH SCHEDULES
  // ============================================================
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

  // ============================================================
  // 4. EMPLOYEES
  // ============================================================
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

  // ============================================================
  // 5. ADDRESSES
  // ============================================================
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

  // ============================================================
  // DONE
  // ============================================================
  console.log('========================================');
  console.log('🎉 Seeding finished successfully!');
  console.log('========================================');
  console.log('\n📋 Summary:');
  console.log(`  Users:            5`);
  console.log(`  Branches:         3`);
  console.log(`  Branch Schedules: ${5 + 2 + 5 + 1 + 7}`);
  console.log(`  Employees:        4`);
  console.log(`  Addresses:        3`);

  // Cleanup
  await prisma.order_items.deleteMany()
  await prisma.orders.deleteMany()
  await prisma.cart_items.deleteMany()
  await prisma.carts.deleteMany()

  // Cart Seeders
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
