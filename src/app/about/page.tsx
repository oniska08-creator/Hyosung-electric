import SubHero from "@/components/common/SubHero";
import { prisma } from "@/lib/prisma";
import AboutTabs from "./AboutTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "기업소개 | 효성전기",
  description: "효성전기의 CEO 인사말, 경영 철학, 신뢰의 연혁 및 본사/물류센터 위치를 안내합니다.",
};

export default async function AboutPage() {
  const [history, about] = await Promise.all([
    prisma.history.findMany({
      orderBy: { order: 'desc' }
    }),
    prisma.about.findUnique({
      where: { id: "singleton" }
    })
  ]);

  // Sort history primarily by order (desc), then year/month
  const sortedHistory = [...history].sort((a, b) => {
    const orderDiff = (b.order || 0) - (a.order || 0);
    if (orderDiff !== 0) return orderDiff;
    
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    
    return (parseInt(b.month || "0")) - (parseInt(a.month || "0"));
  });

  // Fallback data if DB is empty
  const milestones = sortedHistory.length > 0 ? sortedHistory : [
    { year: "2024", title: "스마트 그리드 솔루션 런칭", content: "차세대 지능형 전력망 자재 공급 및 시공 서비스 시작" },
    { year: "2020", title: "정부 공인 우수 기술 기업", content: "고성능 차단기 및 전력 제어반 기술 연구소 설립" },
    { year: "2015", title: "효성전기 주식회사 설립", content: "산업용 전기자재 전문 유통 법인 전환" },
    { year: "2005", title: "전기 엔지니어링 그룹 결성", content: "전기 시공 및 자재 유통을 위한 핵심 인력 확보" },
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      <SubHero 
        title={about?.title || "에너지를 잇는 확실한 선택"} 
        subtitle={about?.subtitle || "효성전기는 20년의 세월 동안 대한민국 산업 현장의 전력 인프라를 지탱해왔습니다."} 
      />

      {/* Interactive Tabs Section (인사말, 연혁, 회사위치) */}
      <AboutTabs 
        about={about} 
        milestones={JSON.parse(JSON.stringify(milestones))} 
      />
    </div>
  );
}
