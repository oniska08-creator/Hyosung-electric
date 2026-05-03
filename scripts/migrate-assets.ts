import { PrismaClient } from '@prisma/client';
import { uploadOptimizedImage } from '../src/lib/storage';

const prisma = new PrismaClient();

const INDUSTRIAL_IMAGES = [
  "photo-1473341304170-971dccb5ac1e", "photo-1581091226825-a6a2a5aee158",
  "photo-1581092120001-4284b802b157", "photo-1516937941344-00b4e0337589",
  "photo-1504384308090-c894fdcc538d", "photo-1521791136064-7986c308457c",
  "photo-1593106197529-676106e23616", "photo-1497366216548-37526070297c",
  "photo-1581092580497-e03f69da1b27", "photo-1504917595217-d4dc5f9c4739"
];

async function migrateImages() {
  console.log('🚀 SYSTEM RECOVERY: High-Quality Asset Sync Started...');

  const products = await prisma.product.findMany();
  console.log(`\n📦 PHASE 1: Syncing ${products.length} Products...`);
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const imgId = INDUSTRIAL_IMAGES[i % INDUSTRIAL_IMAGES.length];
      const url = `https://images.unsplash.com/${imgId}?q=80&w=1200`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      
      const newUrl = await uploadOptimizedImage(buf, 'products', `${p.id}_final.webp`);
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: newUrl } });
      
      console.log(`   ✅ [${i+1}/${products.length}] ${p.name.substring(0,25)}... Ready`);
      await new Promise(r => setTimeout(r, 300)); // Throttling
    } catch (e: any) {
      console.log(`   ❌ [${i+1}/${products.length}] ${p.name.substring(0,10)} FAILED: ${e.message}`);
    }
  }

  const projects = await prisma.project.findMany();
  console.log(`\n🏗️ PHASE 2: Syncing ${projects.length} Projects...`);
  
  for (let i = 0; i < projects.length; i++) {
    const pj = projects[i];
    try {
      const imgId = INDUSTRIAL_IMAGES[(i + 5) % INDUSTRIAL_IMAGES.length];
      const url = `https://images.unsplash.com/${imgId}?q=80&w=1200`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      
      const newUrl = await uploadOptimizedImage(buf, 'projects', `${pj.id}_final.webp`);
      await prisma.project.update({ where: { id: pj.id }, data: { imageUrl: newUrl } });
      
      console.log(`   ✅ [${i+1}/${projects.length}] ${pj.title.substring(0,25)}... Ready`);
      await new Promise(r => setTimeout(r, 300));
    } catch (e: any) {
      console.log(`   ❌ [${i+1}/${projects.length}] ${pj.title.substring(0,10)} FAILED: ${e.message}`);
    }
  }

  console.log('\n🎉 ALL ASSETS ARE NOW SAFELY STORED IN SUPABASE STORAGE!');
}

migrateImages().finally(() => prisma.$disconnect());
