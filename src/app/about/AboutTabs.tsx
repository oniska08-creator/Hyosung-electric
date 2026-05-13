"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AboutContent from "./AboutContent";
import { 
  UserCheck, 
  History as HistoryIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  ExternalLink 
} from "lucide-react";

interface AboutTabsProps {
  about: {
    title?: string | null;
    subtitle?: string | null;
    mainImage?: string | null;
    philosophy?: string | null;
    vision?: string | null;
    greeting?: string | null;
  } | null;
  milestones: any[];
}

function AboutTabsInner({ about, milestones }: AboutTabsProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"company" | "greeting" | "history" | "location">("company");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tabParam === "company" || tabParam === "greeting" || tabParam === "history" || tabParam === "location") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs = [
    { id: "company", label: "회사소개", icon: Award },
    { id: "greeting", label: "인사말", icon: UserCheck },
    { id: "history", label: "연혁", icon: HistoryIcon },
    { id: "location", label: "회사위치", icon: MapPin },
  ] as const;

  const address = "서울특별시 금천구 시흥대로 97 21동 121";
  const mapQuery = "서울특별시 금천구 시흥대로 97";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Tab Switcher - Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="bg-slate-100 p-1.5 rounded-full inline-flex gap-1 shadow-inner border border-slate-200/60 max-w-full overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-full text-base md:text-lg font-black flex items-center gap-2 transition-all duration-300 shrink-0 ${
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-slate-950 rounded-full -z-10 shadow-lg shadow-slate-950/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="pt-12">
        <AnimatePresence mode="wait">
          {activeTab === "company" && (
            <motion.div
              key="company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-32"
            >
              {/* Philosophy & Vision Section */}
              <section className="px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="aspect-square rounded-[3rem] bg-slate-50 border border-slate-100 relative overflow-hidden shadow-2xl shadow-slate-200/50 flex items-center justify-center">
                    {about?.mainImage ? (
                      <Image 
                        src={about.mainImage} 
                        alt="Hyosung Electric Philosophy" 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center space-y-4 p-8">
                        <Award className="w-16 h-16 text-primary mx-auto opacity-80" />
                        <span className="text-slate-300 font-black text-3xl md:text-4xl tracking-tighter block">[ INDUSTRIAL RELIABILITY ]</span>
                        <p className="text-sm text-slate-400 font-bold">효성전기 핵심 가치 및 기술 철학</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-10">
                    <div className="text-sm font-black text-primary uppercase tracking-[0.3em]">Our Philosophy</div>
                    <h2 className="text-3xl md:text-6xl font-black leading-tight text-slate-950 tracking-tight">
                      품질이 만드는<br />
                      <span className="gradient-text">전력의 가치</span>
                    </h2>
                    <div className="w-24 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                    <div className="space-y-8">
                      <p className="text-2xl text-slate-600 leading-relaxed font-bold">
                        {about?.philosophy || "우리는 단순한 자재 유통을 넘어, 고객의 비즈니스가 멈추지 않도록 가장 안전하고 효율적인 전력 인프라를 지탱합니다."}
                      </p>
                      <p className="text-xl text-slate-500 leading-relaxed font-medium">
                        {about?.vision || "국가 공인 기술 자격이 증명하는 완벽한 디테일. 스마트 팩토리부터 상업 빌딩까지, 어떤 환경에서도 끊김 없는 최적의 시스템을 구축합니다."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "greeting" && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-32"
            >
              {/* CEO Greeting Section */}
              <section className="px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-xl shadow-slate-200/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
                  
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>CEO Greeting</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight tracking-tight">
                      고객의 성공을 밝히는<br />
                      <span className="gradient-text">신뢰의 전력 파트너</span>
                    </h2>

                    <div className="space-y-6 text-lg md:text-xl text-slate-600 font-bold leading-relaxed break-keep">
                      {about?.greeting ? (
                        about.greeting.split('\n').map((paragraph, idx) => paragraph.trim() ? (
                          <p key={idx}>{paragraph}</p>
                        ) : null)
                      ) : (
                        <>
                          <p>
                            안녕하십니까, 효성전기 웹사이트를 찾아주신 고객 여러분께 깊은 감사의 말씀을 드립니다.
                          </p>
                          <p>
                            효성전기는 지난 세월 동안 대한민국 산업 현장의 최전선에서 고품질 전력 자재 공급과 최적의 인프라 솔루션을 제공하며 고객과 함께 성장해 왔습니다. 작은 부품 하나에서부터 대규모 플랜트 설비에 이르기까지, 전기가 흐르는 모든 곳에 우리의 땀과 기술이 깃들어 있습니다.
                          </p>
                          <p>
                            급변하는 스마트 산업 시대 속에서도 저희의 원칙은 단 하나, <strong className="text-slate-950 underline decoration-primary decoration-2 underline-offset-4">‘절대 타협하지 않는 완벽한 신뢰’</strong>입니다. 고객의 설비가 단 한 순간도 멈추지 않도록, 엄격한 품질 검증을 거친 최상의 자재만을 신속하고 정확하게 공급할 것을 약속드립니다.
                          </p>
                          <p>
                            앞으로도 에너지의 미래를 잇는 확실한 선택이 될 수 있도록 끊임없이 혁신하겠습니다. 변함없는 성원과 관심을 부탁드립니다. 감사합니다.
                          </p>
                        </>
                      )}
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-slate-400">효성전기 주식회사</div>
                        <div className="text-2xl font-black text-slate-950 tracking-tight">대표이사 및 임직원 일동</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-950/20">
                        HE
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-6 max-w-7xl mx-auto space-y-20"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
                  효성이 걸어온 <span className="gradient-text">신뢰의 역사</span>
                </h2>
                <p className="text-lg text-slate-500 font-bold">
                  끊임없는 도전과 열정으로 빚어낸 효성전기의 뜻깊은 발자취입니다.
                </p>
              </div>

              <div className="bg-slate-50 bg-grid-pattern border border-slate-100 rounded-[3rem] p-8 md:p-16">
                <AboutContent milestones={milestones} />
              </div>
            </motion.div>
          )}

          {activeTab === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-6 max-w-7xl mx-auto space-y-20"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
                  찾아오시는 길
                </h2>
                <p className="text-lg text-slate-500 font-bold">
                  효성전기 본사 및 주요 물류센터 방문을 위한 안내입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Real Interactive Map Interface */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/30 flex flex-col">
                  <div className="w-full h-[450px] md:h-[500px] relative bg-slate-100">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="효성전기 오시는 길 실제 지도"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-400 mb-1">상세 도로명 주소</div>
                        <div className="text-base font-black text-slate-950">{address}</div>
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl font-bold text-sm text-slate-700 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">주소 복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>주소 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                      <a 
                        href={`https://map.naver.com/v5/search/${encodeURIComponent(mapQuery)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#03c75a] text-white rounded-xl font-black text-xs flex items-center gap-1.5 hover:bg-[#02b351] transition-all no-underline"
                      >
                        <span>네이버 지도로 열기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-lg shadow-slate-200/20">
                    <h3 className="text-2xl font-black text-slate-950 tracking-tight">연락처 및 상담 안내</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 text-primary shrink-0 shadow-sm">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-400">고객센터 및 기술상담</div>
                          <div className="text-lg font-black text-slate-950">02-896-8285</div>
                          <p className="text-xs text-slate-500 font-medium mt-1 break-keep">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 text-primary shrink-0 shadow-sm">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-400">견적 및 발주 문의</div>
                          <div className="text-lg font-black text-slate-950 break-all">sales@hyosung-elec.com</div>
                          <p className="text-xs text-slate-500 font-medium mt-1 break-keep">도면 첨부 및 대량 발주 이메일 접수</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AboutTabs(props: AboutTabsProps) {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">로딩중...</div>}>
      <AboutTabsInner {...props} />
    </Suspense>
  );
}
