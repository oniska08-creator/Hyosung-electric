import { prisma } from './src/lib/prisma.ts';
import { uploadBase64Image } from './src/lib/storage.ts';
import * as dotenv from 'dotenv';
dotenv.config();

async function testSave() {
  console.log('Testing Product save with imageUrls...');
  try {
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Product ' + Date.now(),
        category: '기타',
        imageUrls: ['https://example.com/test.jpg'],
        price: 100,
        isPublic: true
      }
    });
    console.log('Successfully saved product:', testProduct.id);
    await prisma.product.delete({ where: { id: testProduct.id } });
    console.log('Successfully deleted test product.');
  } catch (error) {
    console.error('Prisma Save Error:', error);
  }
}

testSave();
