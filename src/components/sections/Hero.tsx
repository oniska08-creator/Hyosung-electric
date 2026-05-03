"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6 bg-grid-pattern overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-500 text-sm font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
            <Zap className="w-4 h-4 text-primary" /> 전문가 기술력
          </div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-[10rem] font-black leading-[1.1] md:leading-[0.85] mb-14 text-slate-950 tracking-[-0.04em] uppercase"
          >
            완벽한 전력<br />
            <span className="gradient-text">시스템</span><br />
            엔지니어링
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 mb-16 max-w-xl leading-relaxed font-bold border-l-4 border-primary pl-10"
          >
            대한민국 산업 현장의 에너지를 설계하는<br />
            <span className="text-slate-950">효성전기 고성능 전력 솔루션 마스터.</span>
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
            <Link 
              href="/products"
              className="px-14 py-7 bg-[#0a0a0a] text-white font-black rounded-2xl hover:bg-primary hover:text-[#0a0a0a] shadow-2xl shadow-slate-900/10 transition-all flex items-center gap-3 no-underline group active:scale-95"
            >
              제품 라인업 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact"
              className="px-14 py-7 bg-white border-2 border-[#0a0a0a] text-[#0a0a0a] font-black rounded-2xl hover:bg-[#0a0a0a] hover:text-white transition-all shadow-sm no-underline active:scale-95 cursor-pointer"
            >
              기술 및 시공 문의
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Media Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-[4rem] overflow-hidden bg-white border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-4 group"
        >
          {/* Schematic Corners */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-slate-200 group-hover:border-primary transition-colors z-20" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-slate-200 group-hover:border-primary transition-colors z-20" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-slate-200 group-hover:border-primary transition-colors z-20" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-slate-200 group-hover:border-primary transition-colors z-20" />

          <div className="w-full h-full bg-slate-50 rounded-[3.5rem] relative group-hover:bg-slate-100 transition-colors overflow-hidden">
             <Image 
              src="/hero.png" 
              alt="Industrial Power System"
              fill
              priority
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
             <div className="absolute bottom-10 left-10 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
               <div className="text-sm tracking-[0.5em] mb-2 uppercase opacity-70">인프라 자산 01</div>
               <div className="text-3xl font-black uppercase">기술 핵심 역량</div>
             </div>
          </div>
        </motion.div>
      </div>


      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] rounded-full -z-10 opacity-30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-100/50 blur-[120px] rounded-full -z-10" />
    </section>
  );
}
