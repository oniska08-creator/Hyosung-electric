"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  capacity: string;
  location: string;
  imageUrls: string[];
  tags: string[];
}

export default function PortfolioInfo() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data.slice(0, 4)); // 메인 화면엔 4개만 노출
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section className="py-24 md:py-40 px-6 bg-slate-50 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-grid-pattern opacity-5 rotate-180 -z-10" />

      <div className="container mx-auto">
        {/* Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-500 text-sm font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
            정밀 공학 기술
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8 text-[#0a0a0a] tracking-tight uppercase">
            검증된 <span className="gradient-text">산업용</span> 시공 신뢰성
          </h2>
          
          <p className="text-xl text-[#475569] leading-relaxed font-bold max-w-2xl mx-auto">
            20년의 고밀도 시공 노하우와 국가 공인 기술 자격이 증명하는 완벽한 설비.<br />
            <span className="text-[#0a0a0a]">스마트 팩토리부터 상용 전력 인프라까지, 타협 없는 전력 시스템을 구축합니다.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Gallery Grid - Dynamic Projects */}
          <div className="grid grid-cols-2 gap-8 relative">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white animate-pulse rounded-[3rem]" />
              ))
            ) : projects.length > 0 ? (
              projects.map((item, i) => (
                <Link href={`/portfolio`} key={item.id} className="block active:scale-95 transition-transform duration-200">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="aspect-square rounded-[3rem] bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-200 font-black text-4xl group relative overflow-hidden shadow-xl shadow-slate-200/20"
                  >
                    {item.imageUrls?.[0] ? (
                      <Image 
                        src={item.imageUrls[0]} 
                        alt={item.title} 
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    )}
                    
                    {/* Schematic Corners */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-slate-100 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(255,183,0,0.5)] transition-all z-20" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-slate-100 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(255,183,0,0.5)] transition-all z-20" />
                    
                    <div className="relative z-10 flex flex-col items-center bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <span className="text-white text-3xl mb-1">0{i + 1}</span>
                      <span className="text-xs font-black tracking-[0.4em] text-primary uppercase text-center">{item.capacity || item.title}</span>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full aspect-video border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center bg-white/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Zap size={24} className="text-slate-300" />
                </div>
                <div className="text-slate-400 font-black text-base uppercase tracking-widest mb-2">포트폴리오 동기화 중</div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[250px]">등록된 시공 사례가 없습니다. 관리자 페이지에서 실적을 등록해 주세요.</p>
              </div>
            )}
          </div>

          {/* Call to Action Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">산업 전력 인프라의 표준을 제시합니다</h3>
              <p className="text-base text-slate-500 font-bold leading-relaxed">
                끊김 없는 에너지 정밀 제어, 극한 환경에서의 안정성 확보. <br />
                효성전기는 기술이 아닌 미래를 시공합니다. 
              </p>
              <Link 
                href="/portfolio" 
                className="group flex items-center justify-center gap-6 px-12 py-6 bg-slate-950 text-white font-black rounded-2xl hover:bg-primary hover:text-slate-950 shadow-2xl shadow-slate-900/20 transition-all no-underline w-full"
              >
                <span className="tracking-widest uppercase text-sm">전체 포트폴리오 탐색</span>
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-slate-950/10 flex items-center justify-center group-hover:translate-x-2 transition-transform cursor-pointer">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
