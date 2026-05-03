"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, Zap, X, LayoutDashboard, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "기업 소개", href: "/about" },
    { label: "제품 정보", href: "/products" },
    { label: "시공 사례", href: "/portfolio" },
    { label: "고객 문의", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-20 shadow-2xl shadow-slate-200/20"
    >
      {/* Precision Energy Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 overflow-hidden">
        <motion.div 
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-1/4 h-full bg-primary shadow-[0_0_15px_rgba(245,158,11,0.8)]"
        />
      </div>

      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 no-underline group">
          <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center rounded-sm group-hover:bg-primary transition-all duration-500 shadow-xl shadow-slate-900/10">
            <Zap size={20} className="text-white group-hover:text-[#0a0a0a] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.3em] text-[#0a0a0a] uppercase leading-none">Hyosung</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-slate-500">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-black tracking-widest hover:text-primary transition-colors no-underline relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          
          {status === "authenticated" ? (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-black tracking-widest text-primary hover:text-amber-500 transition-colors no-underline cursor-pointer"
              >
                <LayoutDashboard size={14} /> 관리자 패널
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-black tracking-widest text-[#0a0a0a] hover:text-red-500 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-black tracking-[0.2em] px-8 py-3 rounded-xl border-2 border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all shadow-sm no-underline active:scale-95 cursor-pointer"
            >
              보안 로그인
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-900 active:scale-90 transition-transform"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-10 flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-black tracking-widest text-[#0a0a0a] no-underline"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-100">
                {status === "authenticated" ? (
                  <button
                    onClick={() => signOut()}
                    className="w-full py-4 bg-red-50 text-red-600 font-black rounded-xl cursor-pointer"
                  >
                    로그아웃
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-4 bg-[#0a0a0a] text-white text-center font-black rounded-xl no-underline cursor-pointer"
                  >
                    보안 로그인
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
