"use client";

import React, { useState, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createHistory, updateHistory, deleteHistory, updateAbout } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { ImageIcon, UploadCloud, Save, Loader2 } from 'lucide-react';

export default function AboutClient({ initialHistory, initialAbout }: { initialHistory: any[], initialAbout: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);

  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const [aboutPreview, setAboutPreview] = useState<string>(initialAbout?.mainImage || "");

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('연혁 데이터를 삭제하시겠습니까?')) {
      await deleteHistory(id);
      router.refresh();
    }
  };

  const handleAboutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAboutPreview(URL.createObjectURL(file));
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const existingMainImage = formData.get('existingMainImage') as string;
    const mainImageFile = formData.get('mainImage') as File;

    if (!existingMainImage && (!mainImageFile || mainImageFile.size === 0)) {
      alert('기업 소개 메인 이미지를 업로드해주세요.');
      return;
    }

    setAboutLoading(true);
    try {
      const result = await updateAbout(formData);
      if (result && !result.success) {
        alert(result.error);
        setAboutLoading(false);
        return;
      }
      alert('기업 정보가 성공적으로 업데이트되었습니다.');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || '업데이트 중 오류가 발생했습니다.');
    } finally {
      setAboutLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      let result;
      if (editingItem) {
        result = await updateHistory(editingItem.id, data);
      } else {
        result = await createHistory(data);
      }

      if (result && !result.success) {
        alert(result.error);
        setLoading(false);
        return;
      }

      setIsModalOpen(false);
      setLoading(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || '처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'order',
      label: '순서',
      render: (item: any) => (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 font-black text-sm border border-slate-100">
          {item.order}
        </div>
      )
    },
    {
      key: 'year',
      label: '연도',
      render: (item: any) => <span className="text-xl font-black text-slate-900">{item.year}</span>
    },
    {
      key: 'month',
      label: '월',
      render: (item: any) => <span className="font-black text-amber-600">{item.month ? `${item.month}월` : '-'}</span>
    },
    { key: 'title', label: '주요 성과/사건' },
    {
      key: 'content',
      label: '상세 내용',
      render: (item: any) => <span className="text-xs text-slate-400 font-bold leading-tight line-clamp-1">{item.content || '-'}</span>
    },
  ];

  return (
    <div className="pb-20 space-y-16">
      <AdminHeader
        title="기업 프로필 및 연혁 관리"
        description="효성전기의 정체성을 정의하는 메인 이미지와 핵심 가치를 관리합니다."
      />

      {/* About Info Management */}
      <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">기업 소개 메인 설정</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">About 페이지 상단 비주얼 및 기업 철학</p>
          </div>
        </div>

        <form onSubmit={handleAboutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Upload Area */}
          <div className="lg:col-span-4 space-y-6">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">기업 소개 메인 이미지</label>
            <div
              onClick={() => aboutFileInputRef.current?.click()}
              className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] relative overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-all duration-500"
            >
              {aboutPreview ? (
                <img src={aboutPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <UploadCloud size={48} />
                  <span className="text-xs font-black uppercase tracking-widest">이미지 업로드</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-black uppercase tracking-widest">이미지 변경</span>
              </div>
              <input
                type="file"
                ref={aboutFileInputRef}
                name="mainImage"
                onChange={handleAboutFileChange}
                accept="image/*"
                className="hidden"
              />
              <input type="hidden" name="existingMainImage" value={initialAbout?.mainImage || ""} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-4 text-center">
              최소 1200x1200px 이상의 고해상도 이미지를 권장합니다.
            </p>
          </div>

          {/* Philosophy & Vision Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">페이지 메인 타이틀</label>
                <input name="title" defaultValue={initialAbout?.title || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="에너지를 잇는 확실한 선택" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">페이지 서브 타이틀</label>
                <input name="subtitle" defaultValue={initialAbout?.subtitle || ""} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" placeholder="효성전기 20년의 세월..." />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">기업 철학 (Philosophy)</label>
              <textarea
                name="philosophy"
                defaultValue={initialAbout?.philosophy || ""}
                rows={4}
                required
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-lg focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none resize-none"
                placeholder="기업의 핵심 철학을 입력하세요. (About 페이지 상단 노출)"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">미래 비전 (Vision)</label>
              <textarea
                name="vision"
                defaultValue={initialAbout?.vision || ""}
                rows={4}
                required
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-lg focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none resize-none"
                placeholder="효성전기가 그리는 미래를 입력하세요."
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">CEO 인사말 (Greeting)</label>
                <span className="text-[10px] text-amber-600 font-bold tracking-tight">💡 내용을 비우고 저장하면 기본값으로 초기화(삭제)됩니다.</span>
              </div>
              <textarea
                name="greeting"
                defaultValue={initialAbout?.greeting || ""}
                rows={6}
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-lg focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none resize-none"
                placeholder="CEO 인사말을 여러 문단으로 자유롭게 입력하세요. 줄바꿈은 화면에서 문단으로 자동 분리됩니다."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={aboutLoading}
                className="flex items-center gap-4 px-12 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all active:scale-95 shadow-2xl shadow-slate-950/20 disabled:opacity-50"
              >
                {aboutLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                <span>기업 프로필 저장하기</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* History Management */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-4">
          <div>
            <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">연혁 데이터베이스</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">역대 주요 성과 및 사건 목록</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-4 px-10 py-5 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
          >
            <UploadCloud size={20} />
            <span>신규 연혁 등록</span>
          </button>
        </div>

        <AdminTable
          columns={columns}
          data={initialHistory}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "연혁 정보 수정" : "신규 연혁 등록"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">연도</label>
              <input name="year" type="text" defaultValue={editingItem?.year || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 2024" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">월 (선택사항)</label>
              <input name="month" type="text" defaultValue={editingItem?.month || ""} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 05" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">주요 제목</label>
            <input name="title" defaultValue={editingItem?.title || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 효성전기 제2공장 설립" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">상세 설명</label>
            <textarea name="content" defaultValue={editingItem?.content || ""} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none resize-none" placeholder="연혁에 대한 상세 내용을 입력하세요" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">노출 순서 (정렬 순서)</label>
            <div className="relative">
              <input
                name="order"
                type="number"
                min="1"
                required
                defaultValue={editingItem?.order ?? (initialHistory.length > 0 ? Math.max(...initialHistory.map(h => h.order || 0)) + 1 : 1)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                placeholder="숫자가 클수록 상단에 노출됩니다"
              />
              <div className="mt-2 px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                💡 팁: 숫자가 클수록 먼저 보입니다. 최신 연혁을 등록할 때는 기존보다 큰 숫자를 사용하세요. (현재 권장 순서: {initialHistory.length > 0 ? Math.max(...initialHistory.map(h => h.order || 0)) + 1 : 1})
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-end gap-5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">
              취소
            </button>
            <button type="submit" disabled={loading} className={`px-14 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? '기록 업데이트 중...' : (editingItem ? '수정 사항 반영' : '연혁 데이터 등록')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
