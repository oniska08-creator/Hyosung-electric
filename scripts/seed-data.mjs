import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // await prisma.product.deleteMany();
  // await prisma.project.deleteMany();

  console.log('Seeding products...');
  const products = [
    {
      name: "LS METASOL MCCB 배선차단기",
      description: "고성능 차단 기술이 적용된 산업용 배선용 차단기. 신뢰성 높은 전력 계통 보호 솔루션.",
      category: "차단기 및 분전반",
      spec: "630AF / 4P / 65kA",
      price: 150000,
      imageUrl: "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1200", // Placeholder
    },
    {
      name: "HIV 고압 전력 케이블",
      description: "KS C 3341 규격의 고내열성 전원 배선용 케이블. 공장 및 빌딩 전력 간선용.",
      category: "케이블 및 배선기구",
      spec: "35sq / 0.6/1kV",
      price: 4500,
      imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fa662b5?q=80&w=1200", 
    },
    {
      name: "방폭형 LED 투광등",
      description: "화학 공장 및 가스 시설용 특수 방폭 인증 조명. IP66 등급의 강력한 내구성.",
      category: "산업용 조명 및 변압기",
      spec: "150W / 5000K / IP66",
      price: 280000,
      imageUrl: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=1200",
    },
    {
      name: "V-Check 서지보호기(SPD)",
      description: "낙뢰 및 과전압으로부터 전자기기를 보호하는 핵심 안전 장치.",
      category: "차단기 및 분전반",
      spec: "Class II / 40kA",
      price: 85000,
      imageUrl: "https://images.unsplash.com/photo-1581092334651-ddf26d9a194a?q=80&w=1200",
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seeding projects...');
  const projects = [
    {
      title: "현대 모비스 물류센터 전력 증설",
      description: "고압 수변전 설비 교체 및 메인 배전반 설치 공사.",
      capacity: "2,500kVA",
      location: "울산광역시",
      tags: ["전력증설", "수변전", "LS산전"],
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200",
    },
    {
      title: "세종 스마트 시티 공공 조명 구축",
      description: "지능형 가로등 제어 시스템 및 태양광 연계 전력망 구축.",
      capacity: "500kW",
      location: "세종특별자치시",
      tags: ["스마트시티", "LED", "태양광"],
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200",
    }
  ];

  for (const pr of projects) {
    await prisma.project.create({ data: pr });
  }

  console.log('Sync Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
