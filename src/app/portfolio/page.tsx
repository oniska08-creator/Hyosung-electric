"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubHero from "@/components/common/SubHero";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Zap, MapPin, Activity, Search, Plus, Filter } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  capacity: string;
  location: string;
  imageUrls: string[];
  tags: string[];
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("전체 실적");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(9); // 포트폴리오는 3열이므로 9개씩
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/categories?type=project")
        ]);
        
        const projectsData = await projectsRes.json();
        const categoriesData = await categoriesRes.json();

        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        }

        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          const names = ["전체 실적", ...categoriesData.map((c: any) => c.name)];
          setCategories(names);
        } else {
          // Fallback if no categories registered
          const allTags = projectsData.flatMap((p: any) => p.tags || []);
          const uniqueTags = ["전체 실적", ...new Set(allTags)];
          setCategories(uniqueTags);
        }
      } catch (error) {
        console.error("Failed to fetch projects or categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 지능형 필터링: 태그 매칭 + 제목/내용 검색 통합
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = activeCategory === "전체 실적" || p.tags?.includes(activeCategory);
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const visibleProjects = filteredProjects.slice(0, displayCount);
  const hasMore = filteredProjects.length > displayCount;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-40">
      <SubHero 
        title="엔지니어링 성공 사례" 
        subtitle="전국의 거점 인프라를 지탱하는 효성전기의 정밀 설비 레퍼런스를 확인하세요." 
      />

      <main className="max-w-7xl mx-auto px-6">
        {/* Search & Dynamic Filter Smart Bar */}
        <div className="sticky top-20 z-30 flex flex-col gap-4 -mt-10 mb-20">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center overflow-hidden">
             <div className="flex items-center gap-3 px-6 border-r border-slate-100 shrink-0">
               <Filter size={16} className="text-primary" />
             </div>
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-1 flex-1">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => { setActiveCategory(cat); setDisplayCount(9); }}
                   className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 transform cursor-pointer ${
                     activeCategory === cat 
                       ? "bg-slate-950 text-white shadow-xl shadow-slate-900/20 scale-105 ring-2 ring-primary/20" 
                       : "text-slate-400 hover:text-slate-950 hover:bg-white hover:scale-105 hover:shadow-lg hover:border-primary/30 border border-transparent"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          <div className="relative max-w-md mx-auto w-full group">
            <input 
              type="text"
              placeholder="프로젝트 명 또는 지역 검색..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(9); }}
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#0a0a0a]"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-200">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <span className="font-black tracking-[0.4em] uppercase text-sm">시공 실적 데이터를 불러오는 중...</span>
          </div>
        ) : visibleProjects.length > 0 ? (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((item, i) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link href={`/portfolio/${item.id}`} className="no-underline group block active:scale-[0.98] transition-all">
                      <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-200/60 hover:border-primary/50 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                        <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                          {item.imageUrls?.[0] ? (
                            <Image 
                              src={item.imageUrls[0]} 
                              alt={item.title} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-200 font-black text-6xl italic opacity-20">PROJ {i+1}</div>
                          )}
                          <div className="absolute top-8 left-8 z-10">
                            <div className="px-5 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-black tracking-[0.3em] text-primary uppercase border border-white/10">
                              Verified Asset
                            </div>
                          </div>
                        </div>
                        <div className="p-10 md:p-12">
                          <div className="flex items-center gap-2 mb-4">
                            <Activity size={16} className="text-primary" />
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.tags[0] || "Architecture"}</span>
                          </div>
                          <h3 className="text-2xl font-black text-[#0a0a0a] group-hover:text-primary transition-colors mb-8 leading-tight tracking-tighter uppercase">{item.title}</h3>
                          <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                             <div className="flex flex-col gap-1">
                               <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Specifications</span>
                               <span className="text-sm font-bold text-slate-600 truncate">{item.capacity}</span>
                             </div>
                             <div className="flex flex-col gap-1 items-end">
                               <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Installation</span>
                               <span className="text-sm font-bold text-slate-600 flex items-center gap-2 justify-end">
                                 <MapPin size={14} className="text-primary" /> {item.location}
                               </span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-24 flex flex-col items-center gap-6">
                <div className="text-slate-400 text-sm font-black uppercase tracking-widest">
                  Analyzing {visibleProjects.length} of {filteredProjects.length} Success Stories
                </div>
                <button
                  onClick={() => setDisplayCount(prev => prev + 9)}
                  className="group flex items-center gap-6 px-12 py-6 bg-slate-950 text-white font-black rounded-2xl hover:bg-primary hover:text-slate-950 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 cursor-pointer"
                >
                  <Plus className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="tracking-[0.2em] uppercase text-sm">{Math.min(9, filteredProjects.length - displayCount)}개의 실적 더보기</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[4rem] bg-white">
            <Zap size={48} className="mx-auto text-slate-100 mb-6" />
            <h3 className="text-slate-300 font-black text-2xl uppercase tracking-widest mb-2">No Success Cases</h3>
            <p className="text-slate-400 text-sm">해당 검색 조건에 맞는 프로젝트가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
