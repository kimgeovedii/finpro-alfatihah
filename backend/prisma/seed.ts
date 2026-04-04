import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // --- Roles ---
  const roles = ['USER', 'ADMIN', 'SUPERADMIN'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
  console.log('Seeded Roles.');

  // --- Users ---
  const defaultPassword = await bcrypt.hash('password123', 10);

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });

  if (adminRole && userRole) {
    await prisma.user.upsert({
      where: { email: 'kimgeovedi@gmail.com' },
      update: {},
      create: {
        email: 'kimgeovedi@gmail.com',
        password: defaultPassword,
        name: 'Admin',
        roleId: adminRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'akimmustofa18@gmail.com' },
      update: {},
      create: {
        email: 'akimmustofa18@gmail.com',
        password: defaultPassword,
        name: 'User',
        roleId: userRole.id,
      },
    });

    console.log('Seeded Users (password: password123).');
  }

  console.log('Seeding finished.');
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
