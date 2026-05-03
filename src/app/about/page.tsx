import SubHero from "@/components/common/SubHero";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import AboutContent from "./AboutContent";

export default async function AboutPage() {
  const [history, about] = await Promise.all([
    prisma.history.findMany({
      orderBy: { order: 'asc' }
    }),
    prisma.about.findUnique({
      where: { id: "singleton" }
    })
  ]);

  // Sort history primarily by order, then year/month
  const sortedHistory = [...history].sort((a, b) => {
    const orderDiff = (a.order || 0) - (b.order || 0);
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

      {/* Philosophy Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="aspect-square rounded-[3rem] bg-slate-50 border border-slate-100 relative overflow-hidden shadow-2xl shadow-slate-200/50 flex items-center justify-center">
            {about?.mainImage ? (
              <Image 
                src={about.mainImage} 
                alt="Hyosung Electric Philosophy" 
                fill 
                className="object-cover"
              />
            ) : (
              <span className="text-slate-200 font-black text-4xl tracking-tighter">[ INDUSTRIAL RELIABILITY ]</span>
            )}
          </div>

          <div className="space-y-10">
            <div className="text-sm font-black text-primary uppercase tracking-[0.3em]">Our Philosophy</div>
            <h2 className="text-3xl md:text-7xl font-black leading-tight text-slate-950 tracking-tight">
              품질이 만드는<br />
              <span className="gradient-text">전력의 가치</span>
            </h2>
            <div className="w-24 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
            <div className="space-y-8">
              <p className="text-2xl text-slate-600 leading-relaxed font-bold">
                {about?.philosophy || "우리는 단순한 자재 유통을 넘어, 고객의 비즈니스가 멈추지 않도록 가장 안전하고 효율적인 전력 인프라를 지탱합니다."}
              </p>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                {about?.vision || "국가 공인 기술 자격이 증명하는 완벽한 디테일. 스마트 팩토리부터 상업 빌딩까지, 어떤 환경에서도 끊김 없는 최적의 시스템을 구축합니다."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-6 bg-slate-50 bg-grid-pattern border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">효성이 걸어온 <span className="gradient-text">신뢰의 역사</span></h2>
          </div>

          <AboutContent milestones={JSON.parse(JSON.stringify(milestones))} />
        </div>
      </section>
    </div>
  );
}
