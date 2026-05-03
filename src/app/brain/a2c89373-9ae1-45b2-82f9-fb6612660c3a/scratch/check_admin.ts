import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany();
  console.log('Current Admins:', admins.map(a => ({ username: a.username, role: a.role })));
  
  const adminAccount = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });
  
  if (adminAccount && adminAccount.role !== 'SUPER_ADMIN') {
    await prisma.admin.update({
      where: { username: 'admin' },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log('Updated "admin" to SUPER_ADMIN');
  } else if (!adminAccount) {
    console.log('"admin" account not found.');
  } else {
    console.log('"admin" is already SUPER_ADMIN');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
