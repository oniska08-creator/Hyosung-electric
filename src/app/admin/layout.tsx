import Link from "next/link";
import { Home, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("Admin Session Debug:", {
    user: session?.user,
    role: (session?.user as any)?.role,
    isSuper: (session?.user as any)?.role === "SUPER_ADMIN"
  });
  const isSuperAdmin = (session?.user as any)?.role === "SUPER_ADMIN";

  const navLinks = [
    { label: '대시보드', href: '/admin' },
    { label: '기업연혁', href: '/admin/about' },
    { label: '제품관리', href: '/admin/products' },
    { label: '납품실적', href: '/admin/projects' },
    { label: '문의현황', href: '/admin/inquiries' },
    { label: '카테고리', href: '/admin/categories' },
  ];

  if (isSuperAdmin) {
    navLinks.push({ label: '계정관리', href: '/admin/users' });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Mini Admin Nav */}
      <nav className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-10">
          <div className="font-black tracking-tighter text-2xl text-slate-900">
            HYOSUNG <span className="text-amber-600 font-light">ELECTRIC</span>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl text-sm font-black transition-all no-underline border border-slate-100 active:scale-95"
          >
            <Home size={18} />
            메인 사이트
          </Link>
        </div>
        
        {/* Sub Nav Links */}
        <div className="hidden lg:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-400">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-950 transition-colors no-underline">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
          <span className="hidden md:inline">통합 관제 센터 연결됨</span>
          <div className="flex items-center gap-6 pl-8 border-l border-slate-200">
            <div className="text-right">
              <span className="text-slate-950 font-black block">{session?.user?.name || "관리자"}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{isSuperAdmin ? "최고 관리자" : "일반 관리자"}</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg ${isSuperAdmin ? 'bg-amber-600 shadow-amber-500/20' : 'bg-slate-950 shadow-slate-900/20'}`}>
              {isSuperAdmin ? <ShieldCheck size={24} /> : "ADMIN"}
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
