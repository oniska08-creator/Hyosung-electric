"use client";

import { motion } from "framer-motion";

interface SubHeroProps {
  title: string;
  subtitle: string;
}

export default function SubHero({ title, subtitle }: SubHeroProps) {
  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-48 pb-20 px-6 bg-white bg-grid-pattern border-b border-slate-100 overflow-hidden">
      <div className="relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-1.5 bg-primary mx-auto mb-8 rounded-full shadow-lg shadow-primary/20"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-950 mb-6 md:mb-8 tracking-tighter"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 font-bold max-w-2xl mx-auto break-keep leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-amber-500/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
}
