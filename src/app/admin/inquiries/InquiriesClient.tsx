"use client";

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { markInquiryRead, deleteInquiry } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function InquiriesClient({ initialInquiries }: { initialInquiries: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const handleView = async (item: any) => {
    setViewingItem(item);
    setIsModalOpen(true);
    if (!item.isRead) {
      await markInquiryRead(item.id);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('문의 내역을 삭제하시겠습니까?')) {
      await deleteInquiry(id);
      router.refresh();
    }
  };

  const columns = [
    { 
      key: 'createdAt', 
      label: '일시',
      render: (item: any) => (
        <span className="text-xs text-slate-400 font-bold">
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </span>
      )
    },
    { key: 'name', label: '문의자' },
    { key: 'location', label: '현장명', render: (item: any) => item.location || '-' },
    { key: 'phone', label: '연락처' },
    { 
      key: 'isRead', 
      label: '상태',
      render: (item: any) => (
        <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl ${item.isRead ? 'bg-slate-50 text-slate-300' : 'bg-primary text-slate-950 shadow-lg shadow-primary/20'}`}>
          {item.isRead ? '확인 완료' : '신규 문의'}
        </span>
      )
    },
  ];

  return (
    <div className="pb-20">
      <AdminHeader 
        title="고객문의 및 기술상담 현황"
        description="플랫폼을 통해 접수된 모든 견적 및 기술 문의를 실시간으로 관리합니다. 상담이 완료된 문의는 확인 처리하십시오."
      />

      <AdminTable 
        columns={columns} 
        data={initialInquiries} 
        onView={handleView}
        onDelete={handleDelete}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="상담 문의 상세 내역"
      >
        {viewingItem && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: '문의자', value: viewingItem.name },
                { label: '연락처', value: viewingItem.phone },
                { label: '현장명/지역', value: viewingItem.location || '-' },
                { label: '업체명', value: viewingItem.company || '-' },
              ].map((info, idx) => (
                <div key={idx} className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{info.label}</div>
                  <div className="text-base font-black text-slate-900">{info.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">상담 요청 내용</div>
              <div className="p-8 bg-slate-950 text-white rounded-[2.5rem] font-medium leading-relaxed shadow-2xl shadow-slate-950/20 whitespace-pre-wrap">
                {viewingItem.content}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
               <div className="text-xs font-black text-slate-300 uppercase tracking-widest">
                 접수 일시: {new Date(viewingItem.createdAt).toLocaleString()}
               </div>
               <button 
                onClick={() => setIsModalOpen(false)}
                className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all active:scale-95 shadow-xl shadow-slate-950/20"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
