import { PrismaClient } from '@prisma/client';
import { uploadOptimizedImage } from '../src/lib/storage';

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('🚀 Starting Image Migration to Supabase Storage...');

  // 1. 제품 이미지 마이그레이션
  const products = await prisma.product.findMany({
    where: {
      imageUrl: {
        contains: 'unsplash.com'
      }
    }
  });

  console.log(`Found ${products.length} products to migrate.`);
  for (const product of products) {
    try {
      console.log(`Migrating product: ${product.name}...`);
      const response = await fetch(product.imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      
      const newUrl = await uploadOptimizedImage(
        buffer,
        'products',
        `${product.id}.jpg`
      );

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newUrl }
      });
      console.log(`✅ Success: ${newUrl}`);
    } catch (err) {
      console.error(`❌ Failed to migrate product ${product.id}:`, err.message);
    }
  }

  // 2. 시공사례 이미지 마이그레이션
  const projects = await prisma.project.findMany({
    where: {
      imageUrl: {
        contains: 'unsplash.com'
      }
    }
  });

  console.log(`Found ${projects.length} projects to migrate.`);
  for (const project of projects) {
    try {
      console.log(`Migrating project: ${project.title}...`);
      const response = await fetch(project.imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      
      const newUrl = await uploadOptimizedImage(
        buffer,
        'projects',
        `${project.id}.jpg`
      );

      await prisma.project.update({
        where: { id: project.id },
        data: { imageUrl: newUrl }
      });
      console.log(`✅ Success: ${newUrl}`);
    } catch (err) {
      console.error(`❌ Failed to migrate project ${project.id}:`, err.message);
    }
  }

  console.log('🎉 All assets migrated successfully!');
}

migrateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
