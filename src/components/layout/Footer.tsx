import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-black mb-6 tracking-tighter">
              <span className="gradient-text">HYOSUNG</span> <span className="text-white">ELECTRIC</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              최고 품질의 산업용 전기자재 솔루션을 제공하며, 안정적인 전력 공급과 효율적인 시스템 구축을 책임지는 당신의 파트너입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6">빠른 메뉴</h3>
            <ul className="space-y-4 text-base font-bold">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors no-underline">회사 소개</Link></li>
              <li><Link href="/products" className="text-slate-400 hover:text-white transition-colors no-underline">제품 안내</Link></li>
              <li><Link href="/portfolio" className="text-slate-400 hover:text-white transition-colors no-underline">시공 사례</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6">문의처</h3>
            <ul className="space-y-4 text-base font-bold text-slate-400">
              <li>T. 02-896-8285</li>
              <li>E. contact@hyosung-elec.com</li>
              <li>A. 서울 금천구 시흥동 984</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
