import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin1234';

  console.log('Seeding superadmin...');

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log(`Admin with username "${username}" already exists. Updating password...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword, role: 'SUPERADMIN' },
    });
    console.log('Password updated successfully.');
  } else {
    console.log(`Creating new superadmin: ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
    console.log('Superadmin created successfully.');
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
