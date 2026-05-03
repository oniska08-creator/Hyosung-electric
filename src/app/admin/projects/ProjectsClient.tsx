"use client";

import React, { useState, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createProject, updateProject, deleteProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, Plus } from 'lucide-react';

export default function ProjectsClient({ initialProjects, categories }: { initialProjects: any[], categories: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // 누적 이미지 관리를 위한 상태
  const [pendingImages, setPendingImages] = useState<{file: File, preview: string}[]>([]);
  const [existingImagesToKeep, setExistingImagesToKeep] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setPendingImages([]);
    setExistingImagesToKeep([]);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setPendingImages([]);
    setExistingImagesToKeep(item.imageUrls || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('시공 사례를 삭제하시겠습니까?')) {
      await deleteProject(id);
      router.refresh();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPending = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPendingImages(prev => [...prev, ...newPending]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingImage = (index: number) => {
    setPendingImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImagesToKeep(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      // Append files
      pendingImages.forEach(({ file }) => {
        formData.append('images', file);
      });

      // Append existing URLs
      existingImagesToKeep.forEach(url => {
        formData.append('existingImageUrls', url);
      });

      // Validation: At least one image is required for projects
      if (pendingImages.length === 0 && existingImagesToKeep.length === 0) {
        alert('시공 현장 사진을 최소 하나 이상 등록해주세요.');
        setLoading(false);
        return;
      }

      if (editingItem) {
        await updateProject(editingItem.id, formData);
      } else {
        await createProject(formData);
      }
      
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
      finishSubmit();
    } catch (error: any) {
      console.error(error);
      alert(error.message || '처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const finishSubmit = () => {
    setIsModalOpen(false);
    setLoading(false);
    router.refresh();
  };

  const columns = [
    { 
      key: 'imageUrls', 
      label: '현장사진',
      render: (item: any) => (
        <div className="w-24 h-16 bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          {item.imageUrls?.[0] ? (
            <img src={item.imageUrls[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-300">이미지 없음</div>
          )}
        </div>
      )
    },
    { key: 'title', label: '공사/납품명' },
    { key: 'capacity', label: '규모/용량' },
    { key: 'location', label: '위치' },
    { 
      key: 'completedAt', 
      label: '가동 시작일',
      render: (item: any) => item.completedAt ? new Date(item.completedAt).toLocaleDateString() : '-'
    },
    { 
      key: 'tags', 
      label: '분류태그',
      render: (item: any) => (
        <div className="flex flex-wrap gap-2">
          {(item.tags || []).slice(0, 2).map((tag: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-sm font-bold border border-slate-100 uppercase tracking-tighter">
              {tag}
            </span>
          ))}
          {item.tags?.length > 2 && <span className="text-sm text-slate-300 font-bold">+{item.tags.length - 2}</span>}
        </div>
      )
    },
  ];

  return (
    <div className="pb-20">
      <AdminHeader 
        title="시공·납품 실적 아카이브"
        description="효성전기의 대규모 인프라 구축 실적을 관리합니다. 대한민국 전역에 구축된 주요 설비 프로젝트를 등록하십시오."
        buttonText="신규 실적 등록"
        onButtonClick={handleCreate}
      />

      <AdminTable 
        columns={columns} 
        data={initialProjects} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "실적 정보 수정" : "신규 실적 등록"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">프로젝트명 (공사/납품 명칭)</label>
            <input name="title" defaultValue={editingItem?.title || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 시화공단 공장 설비 납품" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">규모 및 용량</label>
              <input name="capacity" defaultValue={editingItem?.capacity || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 500kVA 변압기 등" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">지역/위치</label>
              <input name="location" defaultValue={editingItem?.location || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 경기도 시흥시" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">가동 시작일</label>
              <input 
                name="completedAt" 
                type="date" 
                required
                defaultValue={editingItem?.completedAt ? new Date(editingItem.completedAt).toISOString().split('T')[0] : ""} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">분류 태그 (콤마로 구분)</label>
              <input 
                id="tags-input"
                name="tagsString" 
                defaultValue={editingItem?.tags?.join(', ') || ""} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" 
                placeholder="변압기, 배전반, 경기도" 
              />
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 px-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block w-full mb-1">추천 카테고리:</span>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('tags-input') as HTMLInputElement;
                        if (input) {
                          const currentTags = input.value.split(',').map(t => t.trim()).filter(t => t !== "");
                          if (!currentTags.includes(cat.name)) {
                            input.value = [...currentTags, cat.name].join(', ');
                          }
                        }
                      }}
                      className="px-4 py-1.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all active:scale-95 shadow-sm"
                    >
                      + {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">프로젝트 상세 설명</label>
            <textarea name="description" defaultValue={editingItem?.description || ""} rows={3} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none resize-none" placeholder="납품 내역 및 공사 상세 내용을 입력하세요" />
          </div>

          <div className="space-y-6">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">현장 사진 라이브러리</label>
            
            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 flex flex-col items-center justify-center gap-4 hover:border-amber-500/40 hover:bg-amber-50/10 transition-all duration-500"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-amber-600 transition-all duration-500">
                <UploadCloud size={32} />
              </div>
              <div className="text-center">
                <span className="block text-base font-black text-slate-900 mb-1">현장 사진 추가하기</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">누적 업로드가 가능합니다 (최대 10MB)</span>
              </div>
            </div>

            {/* Preview Grid */}
            {(existingImagesToKeep.length > 0 || pendingImages.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                {/* Existing Images */}
                {existingImagesToKeep.map((url, idx) => (
                  <div key={`existing-${idx}`} className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={url} alt="existing" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(idx)}
                        className="w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded-md text-[8px] font-black text-white uppercase tracking-widest">SAVED</div>
                  </div>
                ))}

                {/* Pending Images */}
                {pendingImages.map((img, idx) => (
                  <div key={`pending-${idx}`} className="group relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
                    <img src={img.preview} alt="pending" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => removePendingImage(idx)}
                        className="w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 rounded-md text-[8px] font-black text-white uppercase tracking-widest animate-pulse">NEW</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-end gap-5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">
              취소
            </button>
            <button type="submit" disabled={loading} className={`px-14 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? '데이터 동기화 중...' : (editingItem ? '수정 사항 반영' : '실적 정보 등록')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
