import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Zap, Activity, Calendar, ShieldCheck, MessageSquare } from "lucide-react";
import SubHero from "@/components/common/SubHero";
import ImageGallery from "@/components/common/ImageGallery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <SubHero 
        title={project.title} 
        subtitle="산업 설비 엔지니어링 및 시공" 
      />

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/portfolio" 
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-950 transition-all no-underline"
          >
            <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">전체 시공 사례 탐색</span>
          </Link>
          
          <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-xs font-black tracking-widest text-slate-400 uppercase">
             품질 검증 프로젝트
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Project Image & Narrative */}
          <div className="lg:col-span-8 space-y-16">
            <ImageGallery images={project.imageUrls} alt={project.title} />

            <section className="space-y-10">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-sm font-black text-primary uppercase tracking-widest">성공 사례</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight uppercase">
                {project.title}
              </h1>
              
              <div className="space-y-6">
                <p className="text-xl text-slate-600 font-medium leading-[1.8] opacity-90 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  {project.description}
                </p>
                <p className="text-lg text-slate-400 leading-relaxed italic border-l-4 border-slate-100 pl-8 py-2">
                  본 프로젝트는 효성전기만의 정밀 시공 엔지니어링이 적용되어, 전력 손실을 최소화하고 설비 수명을 30% 이상 향상시키는 혁신적 성과를 거두었습니다.
                </p>
              </div>
            </section>
          </div>

          {/* Right: Technical Summary Sidebar */}
          <div className="lg:col-span-4 flex flex-col h-fit lg:sticky lg:top-32">
            <div className="bg-[#0a0a0a] text-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-900/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[100px] -mr-16 -mt-16" />
              
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 border-b border-white/10 pb-6">공정 기술 기록</h3>
              
              <div className="space-y-10">
                <div className="group">
                  <div className="flex items-center gap-4 mb-3 text-white/50 group-hover:text-primary transition-colors">
                    <MapPin size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">현장 위치</span>
                  </div>
                  <div className="text-lg font-bold pl-8">{project.location}</div>
                </div>

                <div className="group">
                  <div className="flex items-center gap-4 mb-3 text-white/50 group-hover:text-primary transition-colors">
                    <Zap size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">설비 구축 용량</span>
                  </div>
                  <div className="text-lg font-bold pl-8 text-primary uppercase">{project.capacity}</div>
                </div>

                <div className="group">
                  <div className="flex items-center gap-4 mb-3 text-white/50 group-hover:text-primary transition-colors">
                    <Activity size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">솔루션 유형</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="text-xs font-black px-4 py-2 bg-white/5 border border-white/10 rounded-full uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center gap-4 mb-3 text-white/50 group-hover:text-primary transition-colors">
                    <Calendar size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">가동 시작일</span>
                  </div>
                  <div className="text-lg font-bold pl-8">
                    {project.completedAt ? new Date(project.completedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '연도 정보 없음'}
                  </div>
                </div>
              </div>

              <div className="mt-16">
                 <Link 
                  href="/contact" 
                  className="group flex items-center justify-center gap-4 py-8 bg-primary text-slate-950 font-black rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/20 active:scale-95 no-underline cursor-pointer"
                >
                  <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="tracking-[0.2em] uppercase text-base">프로젝트 매니저 상담</span>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50/50">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                   <ShieldCheck size={32} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">인증 현황</span>
                    <span className="text-base font-bold text-slate-600">정밀 공학 설계 인증</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
