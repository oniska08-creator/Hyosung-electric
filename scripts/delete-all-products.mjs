import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 데이터베이스에서 모든 제품 정보를 삭제합니다...");
  const result = await prisma.product.deleteMany({});
  console.log(`✅ 삭제 완료: 총 ${result.count}개의 제품 레코드가 성공적으로 제거되었습니다.`);
}

main()
  .catch((e) => {
    console.error("❌ 삭제 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
