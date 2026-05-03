"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  spec: string;
  imageUrls: string[];
  tags?: string[];
}

export default function ProductsGrid({ limit }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          // 리미트가 있으면 해당 개수만큼만, 없으면 전체 노출
          const displayData = limit ? data.slice(0, limit) : data;
          setProducts(displayData);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [limit]);

  return (
    <section id="products" className="py-24 md:py-32 px-6 bg-white border-y border-slate-100 relative overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">재고 데이터 시스템</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#0a0a0a] tracking-tight uppercase leading-tight">
            검증된 <span className="gradient-text">산업용</span> 자재 라인업
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem]" />
            ))
          ) : products.length > 0 ? (
            products.map((item, i) => (
              <Link href={`/products/${item.id}`} key={item.id} className="no-underline group flex flex-col h-full active:scale-95 transition-transform duration-200">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="relative flex-1 flex flex-col bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden group-hover:border-primary/50 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 p-2"
                >
                  {/* Product Image or Placeholder */}
                  <div className="aspect-[4/3] bg-slate-50 flex flex-col items-center justify-center text-slate-200 font-black text-6xl tracking-tighter rounded-[2rem] group-hover:bg-amber-50 transition-colors border border-slate-100 overflow-hidden relative shrink-0">
                    {item.imageUrls?.[0] ? (
                      <Image 
                        src={item.imageUrls[0]} 
                        alt={item.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                        <span className="relative z-10">{i + 1}</span>
                      </>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(item.tags || [item.category]).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-slate-100 text-sm font-black text-slate-500 uppercase tracking-widest rounded-sm border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-2">{item.spec}</div>
                      <h3 className="text-2xl font-black mb-4 text-[#0a0a0a] group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
                      <p className="text-base text-[#475569] font-bold leading-relaxed mb-8 opacity-60 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center group/btn mt-auto">
                      <span className="text-sm font-black tracking-widest text-[#94a3b8] group-hover:text-[#0a0a0a] transition-colors uppercase">사양 보기</span>
                      <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all group-active/btn:scale-90 cursor-pointer">
                        <ArrowRight size={18} className="text-[#94a3b8] group-hover:text-[#0a0a0a]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <div className="text-slate-300 font-black text-xl uppercase tracking-widest mb-2">재고 동기화 중</div>
              <p className="text-slate-400 text-sm">등록된 제품이 없습니다.</p>
            </div>
          )}
        </div>

        {/* View All Button - Only shows when limit is applied */}
        {limit && (
          <div className="mt-20 flex justify-center">
            <Link 
              href="/products"
              className="group flex items-center gap-6 px-12 py-6 bg-white border-2 border-slate-950 text-slate-950 font-black rounded-2xl hover:bg-slate-950 hover:text-white transition-all shadow-xl shadow-slate-200/50"
            >
              <span className="tracking-widest uppercase text-sm">전체 카탈로그 탐색</span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:translate-x-2 transition-transform cursor-pointer">
                <ArrowRight size={16} className="text-slate-950" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
