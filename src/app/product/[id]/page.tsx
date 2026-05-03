"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Info, Settings, ShieldCheck, Download } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 pt-32 text-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link href="/products" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-10 text-sm">
          <ChevronLeft size={16} /> 전체 라인업으로 돌아가기
        </Link>

        {/* Product Top: Info & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center font-mono text-slate-700"
          >
            [ PRODUCT HIGH-RES GALLERY ]
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
                Industrial Circuit Breaker
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-6">LS산전 Metasol MCCB<br />산업용 배선용 차단기</h1>
              <p className="text-lg text-slate-400 leading-relaxed font-light">
                고차단 용량과 신뢰성을 확보한 산업용 전력 공급 시스템의 핵심 부품입니다. 과부하 및 단락 사고로부터 전력 설비를 안전하게 보호합니다.
              </p>
            </div>

            {/* Key Features Icons */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Settings size={20} />, label: "KS/CE 인증" },
                { icon: <ShieldCheck size={20} />, label: "과전류 보호" },
                { icon: <Download size={20} />, label: "카탈로그" },
              ].map((f, i) => (
                <div key={i} className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="text-primary">{f.icon}</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex gap-4">
              <button className="flex-1 py-4 bg-primary text-slate-950 font-bold rounded-2xl hover:brightness-110 transition-all">
                전문가 상담 요청
              </button>
              <button className="px-8 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-slate-400">
                카탈로그 보기
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Bottom: Specifications Table */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-primary">
              <Info size={20} />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Technical Specifications</h2>
          </div>

          <div className="bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-6 text-sm font-black text-slate-400 uppercase tracking-widest border-b border-white/5">제원 항목</th>
                  <th className="p-6 text-sm font-black text-slate-400 uppercase tracking-widest border-b border-white/5">세부 사양</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["정격 전압 (Ue)", "AC 690 V"],
                  ["정격 전류 (In)", "100 ~ 250 A"],
                  ["정격 차단 용량 (Icu)", "50 kA / 460V"],
                  ["외형 크기 (W x H x D)", "105 x 165 x 60 mm"],
                  ["극수 (Poles)", "3P / 4P"],
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-slate-300 font-medium">{row[0]}</td>
                    <td className="p-6 text-slate-400 font-light">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
