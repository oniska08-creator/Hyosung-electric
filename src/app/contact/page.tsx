"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SubHero from "@/components/common/SubHero";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { createInquiry } from "@/lib/actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      7
    )}-${phoneNumber.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.phone.length < 12) {
      alert("올바른 연락처 형식을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createInquiry(formData);
      alert("문의가 성공적으로 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
      setFormData({ name: "", phone: "", location: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <SubHero
        title="고객지원 및 문의"
        subtitle="전문가의 맞춤 컨설팅을 지금 시작하세요."
      />

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Phone size={32} />, title: "기술 지원 및 상담", info: "02-896-8285", sub: "자재 선정 및 시공 기술 문의" },
            { icon: <Mail size={32} />, title: "견적 및 발주 문의", info: "sales@hyosung-elec.com", sub: "도면 검토 및 대량 발주 견적" },
            { icon: <MapPin size={32} />, title: "효성 물류 센터", info: "서울 금천구 시흥동 984", sub: "자재 픽업 및 전국 배송 거점" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center text-center hover:bg-white hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-primary mb-10 border border-slate-50">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 text-slate-950 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-lg font-bold mb-8 tracking-wide">{item.sub}</p>
              <p className="text-2xl font-black text-slate-950 tracking-tight">{item.info}</p>
            </motion.div>
          ))}
        </div>

        {/* Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-20">
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-slate-50 rounded-[3rem] p-16 border border-slate-100 shadow-xl shadow-slate-200/10">
            <h3 className="text-4xl font-black mb-12 text-slate-950 tracking-tight">프로젝트 문의 접수</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="담당자 성함"
                  className="h-20 bg-white border border-slate-100 rounded-2xl px-8 flex items-center text-[#0a0a0a] text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="연락처 (예: 010-0000-0000)"
                  className="h-20 bg-white border border-slate-100 rounded-2xl px-8 flex items-center text-[#0a0a0a] text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="현장명 / 지역 (예: 서울 금천구 지식산업센터)"
                className="w-full h-20 bg-white border border-slate-100 rounded-2xl px-8 flex items-center text-[#0a0a0a] text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="현장 상황 및 문의 내용을 상세히 적어주세요."
                className="w-full h-64 bg-white border border-slate-100 rounded-2xl p-8 text-[#0a0a0a] text-lg font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-8 bg-slate-950 text-white text-xl font-black rounded-2xl hover:bg-primary hover:text-slate-950 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    문의 전송 중...
                  </>
                ) : "무료 견적 요청 보내기"}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-4">
            <h3 className="text-4xl font-black mb-12 text-slate-950 tracking-tight">자주 묻는 질문</h3>
            <div className="space-y-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-b border-slate-100 pb-12 group cursor-pointer">
                  <h4 className="text-2xl font-black text-slate-900 mb-6 flex gap-4 group-hover:text-primary transition-colors">
                    <span className="text-primary text-3xl">Q.</span>
                    자주 묻는 질문 제목 {i}
                  </h4>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    여기에 질문에 대한 답변 내용이 플레이스홀더로 들어갑니다. 전문적인 전력 인프라 관점에서의 답변이 기술됩니다.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
