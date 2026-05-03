import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package, ShieldCheck, Truck, MessageSquare } from "lucide-react";
import SubHero from "@/components/common/SubHero";
import ImageGallery from "@/components/common/ImageGallery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <SubHero
        title={product.name}
        subtitle=""
      />

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/products"
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-950 transition-all no-underline"
          >
            <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">카탈로그로 돌아가기</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">재고 현황</span>
              <span className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 공급 가능
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Premium Image Viewer */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.imageUrls} alt={product.name} />
          </div>

          {/* Right: Detailed Specifications */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-10">
              <div className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-4">공인 산업용 자재</div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-6 uppercase">
                {product.name}
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed opacity-80">
                {product.description}
              </p>
            </div>

            {/* Spec Card */}
            <div className="bg-[#0a0a0a] text-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 mb-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] -mr-10 -mt-10" />
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                <ShieldCheck size={20} /> 기술 사양 명세
              </h3>
              <div className="space-y-8">
                <div className="pb-6 border-b border-white/10 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">카테고리 분류</span>
                  <span className="text-lg font-bold uppercase">{product.category}</span>
                </div>
                <div className="pb-6 border-b border-white/10 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">상세 사양</span>
                  <span className="text-lg font-bold text-primary">{product.spec}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">표준 준수</span>
                  <span className="text-lg font-bold">국제 IEC / KS 표준</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <Truck className="text-slate-400" size={28} />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">물류 서비스</span>
                  <span className="text-sm font-bold text-slate-700">지능형 배송</span>
                </div>
              </div>
              <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <ShieldCheck className="text-slate-400" size={28} />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">품질 보증</span>
                  <span className="text-sm font-bold text-slate-700">검증 완료</span>
                </div>
              </div>
            </div>

            {/* Main Action */}
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-4 py-8 bg-primary text-slate-950 font-black rounded-2xl hover:bg-[#0a0a0a] hover:text-white transition-all shadow-2xl shadow-primary/20 active:scale-95 no-underline cursor-pointer"
            >
              <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.2em] uppercase text-sm">기술 및 시공 견적 문의</span>
            </Link>
          </div>
        </div>

        {/* Features Content Page Section */}
        <section className="mt-32 pt-24 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">고밀도 정밀 설계</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">현장의 극한 환경에서도 안정적인 전류 흐름을 보장하는 최첨단 내부 설계를 갖추었습니다.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">강력한 내부식성</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">특수 코팅 처리를 통해 습기와 산화로부터 부품을 완벽하게 보호하며 장기 수명을 보장합니다.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">스마트 그리드 최적화</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">지능형 전력망 시스템과의 원활한 통신 및 제어를 지원하는 모듈형 구조를 채택했습니다.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
