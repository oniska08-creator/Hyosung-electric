"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Hero from "@/components/sections/Hero";
import ProductsGrid from "@/components/sections/ProductsGrid";
import PortfolioInfo from "@/components/sections/PortfolioInfo";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductsGrid limit={8} />
      <PortfolioInfo />
      {/* Final Contact CTA */}
      <section className="py-40 px-6 bg-slate-950 overflow-hidden relative border-t border-slate-900">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-black uppercase tracking-[0.3em] mb-10">
              <Zap className="w-4 h-4 animate-pulse" /> 미래를 설계하는 전력 솔루션
            </div>

            <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tight leading-[1.1]">
              대한민국 전력 인프라의<br />
              <span className="gradient-text">&nbsp;든든한 파트너</span>, 효성전기
            </h2>

            <p className="text-lg md:text-xl text-slate-300 mb-14 font-medium leading-relaxed max-w-2xl mx-auto">
              20년의 기술력과 최상급 자격이 보증하는 완벽한 설비.<br />
              지금 바로 전문가의 맞춤형 전력 솔루션을 무상으로 진단받으세요.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <Link
                href="/contact"
                className="group px-12 py-6 bg-primary text-slate-950 font-black rounded-2xl hover:bg-amber-500 shadow-2xl shadow-primary/20 transition-all flex items-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative">상담 및 견적 신청</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-col items-start px-6 border-l-2 border-slate-800">
                <span className="text-primary text-sm font-black uppercase tracking-widest mb-1">직통 기술 상담</span>
                <span className="text-3xl font-black text-white tracking-tight">02-896-8285</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] scale-150 rotate-12" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
      </section>
    </>
  );
}
