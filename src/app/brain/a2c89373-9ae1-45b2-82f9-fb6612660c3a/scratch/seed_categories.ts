import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productCats = ['차단기', '전선', '조명', '수배전반', '기타'];
  const projectCats = ['변압기', '배전반', '공장설비', '인프라', '신재생'];

  console.log('Seeding Product Categories...');
  for (let i = 0; i < productCats.length; i++) {
    await prisma.productCategory.upsert({
      where: { name: productCats[i] },
      update: {},
      create: { name: productCats[i], order: (i + 1) * 10 }
    });
  }

  console.log('Seeding Project Categories...');
  for (let i = 0; i < projectCats.length; i++) {
    await prisma.projectCategory.upsert({
      where: { name: projectCats[i] },
      update: {},
      create: { name: projectCats[i], order: (i + 1) * 10 }
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
