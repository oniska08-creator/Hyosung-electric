import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating 20 industrial products...');
  const categories = ["차단기 및 분전반", "케이블 및 배선기구", "산업용 조명 및 변압기", "전력 제어 시스템"];
  
  const productTemplates = [
    { name: "LS산전 Metasol MCCB", specs: ["125AF", "250AF", "400AF", "630AF", "800AF"] },
    { name: "HIV 고내열성 전력 케이블", specs: ["2.5sq", "4sq", "6sq", "10sq", "16sq", "25sq", "35sq"] },
    { name: "산업용 고효율 LED 투광등", specs: ["50W", "100W", "150W", "200W"] },
    { name: "몰드형 건식 변압기", specs: ["100kVA", "300kVA", "500kVA", "1000kVA"] }
  ];

  for (let i = 1; i <= 20; i++) {
    const template = productTemplates[i % productTemplates.length];
    const spec = template.specs[i % template.specs.length];
    const category = categories[i % categories.length];
    
    await prisma.product.create({
      data: {
        name: `${template.name} Series-0${i}`,
        description: `국가 공인 인증을 획득한 고성능 ${category} 솔루션. 정밀한 전력 제어와 안전성을 보장합니다.`,
        category: category,
        spec: spec,
        price: 50000 + (i * 12000),
        imageUrl: `https://images.unsplash.com/photo-${1581092120000 + i}?q=80&w=1200`,
      }
    });
  }

  console.log('Generating 20 engineering projects...');
  const locations = ["서울", "인천", "수원", "안산", "화성", "천안", "청주", "대전", "대구", "울산", "부산", "광주", "창원", "구미"];
  const capacityTypes = ["500kVA", "1,000kVA", "2,500kVA", "5,000kVA", "10,000kVA", "22.9kV"];

  for (let i = 1; i <= 20; i++) {
    const location = locations[i % locations.length];
    const capacity = capacityTypes[i % capacityTypes.length];
    
    await prisma.project.create({
      data: {
        title: `${location} ${i % 2 === 0 ? '스마트 단지' : '지식산업센터'} 전력망 구축 0${i}`,
        description: `대규모 전력 수급 안정화를 위한 수변전 설비 및 배전반 통합 공사 프로젝트.`,
        capacity: capacity,
        location: `${location}광역시 공단 지역`,
        tags: ["신규공사", "증설", "전력인프라", "효성전기 전문시공"],
        imageUrl: `https://images.unsplash.com/photo-${1581093000000 + i}?q=80&w=1200`,
      }
    });
  }

  console.log('🎉 Bulk Seeding (40 items) Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
