import { Package, FolderKanban, MessageSquare, Users, ChevronRight, Clock, Award } from 'lucide-react';
import { prisma } from "@/lib/prisma";
import Image from 'next/image';
import Link from 'next/link';

interface Inquiry {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  isRead: boolean;
}

interface Project {
  id: string;
  title: string;
  imageUrls: string[];
  capacity: string | null;
  location: string | null;
}

export default async function AdminDashboard() {
  // 실시간 데이터 집계
  const [productCount, projectCount, inquiryCount, historyCount, recentInquiries, recentProjects] = await Promise.all([
    prisma.product.count(),
    prisma.project.count(),
    prisma.inquiry.count(),
    prisma.history.count(),
    prisma.inquiry.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="space-y-10 pb-20">
      {/* Dashboard Header */}
      <div className="bg-white rounded-[3rem] p-12 text-slate-900 relative overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/20 bg-grid-pattern mb-12">
        <div className="relative z-10 text-center lg:text-left">
          <div className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">통합 관제 센터</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none uppercase">전력 설비 통합 관제</h1>
          <p className="text-slate-600 text-lg max-w-2xl leading-relaxed font-bold">
            효성전기 전국 사업장의 자재 수급 현황과 시공 운영 상태를 실시간으로 모니터링하십시오.
          </p>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-primary/5 blur-[100px] -mr-40" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Package size={26} />, label: "총 전기자재", value: productCount.toLocaleString(), unit: "종", href: "/admin/products" },
          { icon: <FolderKanban size={26} />, label: "납품/시공", value: projectCount.toLocaleString(), unit: "건", href: "/admin/projects" },
          { icon: <MessageSquare size={26} />, label: "견적 문의", value: inquiryCount.toLocaleString(), unit: "건", href: "/admin/inquiries", hl: inquiryCount > 0 },
          { icon: <Award size={26} />, label: "기업 연혁", value: historyCount.toLocaleString(), unit: "개", href: "/admin/about" },
        ].map((item, idx) => (
          <Link key={idx} href={item.href} className="no-underline block group">
            <div className={`bg-white h-full p-8 rounded-[2rem] border ${item.hl ? 'border-amber-100 shadow-amber-100/50' : 'border-slate-100'} shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all`}>
              <div className="flex justify-center mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${item.hl ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
                  {item.icon}
                </div>
              </div>
              <div className={`text-base font-black tracking-widest uppercase mb-2 ${item.hl ? 'text-amber-600/60' : 'text-slate-400'}`}>{item.label}</div>
              <div className={`text-4xl font-black tabular-nums ${item.hl ? 'text-amber-600' : 'text-slate-950'}`}>
                {item.value}<span className="text-sm font-black ml-2 uppercase text-slate-300">{item.unit}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inquiries List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-[#0a0a0a]">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black">최근 견적 문의</h2>
            <Link href="/admin/inquiries" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors cursor-pointer">
              <ChevronRight size={20} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentInquiries.length > 0 ? recentInquiries.map((inquiry: Inquiry) => (
              <div key={inquiry.id} className="px-10 py-6 flex justify-between items-center hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${inquiry.isRead ? 'bg-slate-300' : 'bg-amber-500 animate-pulse'}`} />
                  <div>
                    <div className="font-black text-lg">{inquiry.name} <span className="text-xs text-slate-400 font-normal ml-2">{inquiry.company}</span></div>
                    <div className="text-sm text-slate-400 font-bold">{inquiry.phone}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${inquiry.isRead ? 'bg-slate-50 text-slate-400' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                  {inquiry.isRead ? '확인 완료' : '대기중'}
                </span>
              </div>
            )) : (
              <div className="p-10 text-center text-slate-300 font-bold text-sm">신규 문의 내역이 없습니다.</div>
            )}
          </div>
        </div>

        {/* Portfolio List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-[#0a0a0a]">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black">시공 실적 업데이트</h2>
            <Link href="/admin/projects" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors cursor-pointer">
              <ChevronRight size={20} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentProjects.length > 0 ? recentProjects.map((project: Project) => (
              <div key={project.id} className="px-10 py-6 flex items-center gap-5 hover:bg-slate-50/50 transition-all">
                <div className="w-16 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {project.imageUrls?.[0] ? (
                     <Image 
                      src={project.imageUrls[0]} 
                      alt="" 
                      width={64}
                      height={48}
                      className="w-full h-full object-cover opacity-80" 
                     />
                  ) : (
                    <Clock size={16} className="text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="font-black text-lg">{project.title}</div>
                  <div className="text-sm text-slate-400 font-bold italic">{project.capacity} | {project.location}</div>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-slate-300 font-bold text-sm">등록된 실적이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
