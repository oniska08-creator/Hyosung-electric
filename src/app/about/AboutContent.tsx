"use client";

import { motion } from "framer-motion";

export default function AboutContent({ milestones }: { milestones: any[] }) {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Vertical Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200/50 -translate-x-1/2" />

      <div className="space-y-24">
        {milestones.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className={`relative flex items-center justify-between flex-col md:flex-row ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
          >
            {/* Point */}
            <div className="absolute left-6 md:left-1/2 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-lg shadow-primary/30 -translate-x-1/2 z-10" />
            
            {/* Card */}
            <div className={`w-full md:w-[42%] pl-16 md:pl-0 ${idx % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:border-primary/50 transition-all duration-500 group">
                <span className="text-primary font-black text-4xl block mb-4 tracking-tighter group-hover:scale-110 transition-transform origin-left">
                  {item.year}{item.month ? <span className="text-xl ml-1">.{item.month}</span> : ""}
                </span>
                <h3 className="text-slate-950 text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 font-bold leading-relaxed">{item.content}</p>
              </div>
            </div>
            
            <div className="hidden md:block w-[42%]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
