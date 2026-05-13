"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubHero from "@/components/common/SubHero";
import Link from "next/link";
import Image from "next/image";
import { Loader2, PackageSearch, Filter, Search, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  spec: string;
  imageUrls: string[];
  price?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories?type=product")
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }

        if (Array.isArray(categoriesData)) {
          const names = ["전체", ...categoriesData.map((c: any) => c.name)];
          setCategories(names);
        } else {
          // Fallback if no categories registered
          const uniqueCats = ["전체", ...Array.from(new Set((productsData as any[]).map((p: any) => (p.category as string) || "기타")))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 필터링 및 검색 로직 통합
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === "전체" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.spec.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // 현재 화면에 보여줄 아이템 리스트
  const visibleProducts = filteredProducts.slice(0, displayCount);
  const hasMore = filteredProducts.length > displayCount;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-40">
      <SubHero
        title="제품 정보"
        subtitle=""
      />

      <main className="max-w-7xl mx-auto px-6">
        {/* Search & Filter Smart Bar */}
        <div className="sticky top-20 z-30 flex flex-col gap-4 -mt-10 mb-20">
          {/* Top: Category Tabs with Horizontal Scroll */}
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center overflow-hidden">
            <div className="flex items-center gap-3 px-6 border-r border-slate-100 shrink-0">
              <Filter size={16} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-1 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setDisplayCount(12); }}
                  className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 transform cursor-pointer ${activeCategory === cat
                      ? "bg-slate-950 text-white shadow-xl shadow-slate-900/20 scale-105 ring-2 ring-primary/20"
                      : "text-slate-400 hover:text-slate-950 hover:bg-white hover:scale-105 hover:shadow-lg hover:border-primary/30 border border-transparent"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom: Search bar */}
          <div className="relative max-w-md mx-auto w-full group">
            <input
              type="text"
              placeholder="모델명 또는 스펙 검색..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(12); }}
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#0a0a0a]"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-200">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <span className="font-black tracking-[0.4em] uppercase text-sm">인벤토리 자산 필터링 중...</span>
          </div>
        ) : visibleProducts.length > 0 ? (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/products/${item.id}`} className="no-underline group block active:scale-95 transition-transform duration-200">
                      <div className="flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-primary/50 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 p-2">
                        <div className="aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative flex items-center justify-center">
                          {item.imageUrls?.[0] ? (
                            <Image
                              src={item.imageUrls[0]}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-4 opacity-10">
                              <PackageSearch size={48} />
                            </div>
                          )}
                          <div className="absolute top-6 left-6 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-black tracking-widest text-[#0a0a0a] border border-slate-100 z-10 shadow-sm">
                            {item.spec}
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-3">{item.category}</div>
                          <h3 className="text-slate-950 font-black text-lg group-hover:text-primary transition-colors leading-tight mb-4">{item.name}</h3>
                          <div className="pt-6 border-t border-slate-50 flex justify-between items-center group/more">
                            <span className="text-sm font-black tracking-widest text-slate-300 group-hover:text-slate-950 transition-colors uppercase">상세 보기</span>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all cursor-pointer">
                              <Plus size={18} className="text-slate-300 group-hover:text-white" />
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
                  Showing {visibleProducts.length} of {filteredProducts.length} Assets
                </div>
                <button
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  className="group flex items-center gap-6 px-12 py-6 bg-slate-950 text-white font-black rounded-2xl hover:bg-primary hover:text-slate-950 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  <Plus className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="tracking-[0.2em] uppercase text-sm">Show {Math.min(12, filteredProducts.length - displayCount)} More Items</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-white">
            <PackageSearch size={48} className="mx-auto text-slate-100 mb-6" />
            <h3 className="text-slate-300 font-black text-2xl uppercase tracking-widest mb-2">No Matching Items</h3>
            <p className="text-slate-400 text-sm">검색 결과가 없거나 등록된 자재가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
