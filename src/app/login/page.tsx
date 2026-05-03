"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else {
        router.push("/admin"); // 로그인 성공 시 어드민으로 이동
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 text-[#0a0a0a] bg-grid-pattern overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

        <div className="text-center mb-12">
          <Link href="/" className="text-2xl font-black tracking-tighter mb-4 inline-block no-underline group">
            <span className="gradient-text group-hover:drop-shadow-[0_0_10px_rgba(255,183,0,0.5)] transition-all">HYOSUNG</span> <span className="text-[#0a0a0a]">ELECTRIC</span>
          </Link>
          <h1 className="text-xl font-black text-[#334155] uppercase tracking-widest">Admin Control</h1>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-black text-[#0a0a0a] uppercase tracking-widest px-1">ID / Username</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Manager ID"
                className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-lg text-[#0a0a0a] font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black text-[#0a0a0a] uppercase tracking-widest px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-20 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 text-lg text-[#0a0a0a] font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-20 bg-[#0a0a0a] text-white text-xl font-black rounded-2xl hover:bg-primary hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 mt-6 shadow-xl shadow-slate-900/10 active:scale-95 transform"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                Secure Login <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-black text-[#94a3b8] hover:text-primary uppercase tracking-widest transition-colors">
            Back to Platform
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
