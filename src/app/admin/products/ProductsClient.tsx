"use client";

import React, { useState, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, Image as ImageIcon, Plus } from 'lucide-react';

export default function ProductsClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
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
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteProduct(id);
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
    
    // Reset input so same file can be selected again if needed
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

      if (editingItem) {
        await updateProduct(editingItem.id, formData);
      } else {
        await createProduct(formData);
      }
      
      // Cleanup previews
      pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
      finishSubmit();
    } catch (error: any) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert(`저장 중 오류가 발생했습니다: ${errorMsg}`);
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
      label: '이미지',
      render: (item: any) => (
        <div className="w-20 h-14 bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          {item.imageUrls?.[0] && (
            <img src={item.imageUrls[0]} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )
    },
    { key: 'category', label: '카테고리' },
    { key: 'name', label: '제품명' },
    { 
      key: 'price', 
      label: '가격',
      render: (item: any) => `₩${(item.price || 0).toLocaleString()}`
    },
    { 
      key: 'isPublic', 
      label: '상태',
      render: (item: any) => (
        <span className={`px-4 py-1.5 text-sm font-black uppercase tracking-widest rounded-xl ${item.isPublic ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
          {item.isPublic ? '공개' : '비공개'}
        </span>
      )
    },
  ];

  return (
    <div className="pb-20">
      <AdminHeader 
        title="제품 마스터 데이터"
        description="전기 자재 인벤토리를 관리합니다. 카테고리별 정렬 및 상세 사양 편집이 가능합니다."
        buttonText="신규 제품 등록"
        onButtonClick={handleCreate}
      />

      <AdminTable 
        columns={columns} 
        data={initialProducts} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "제품 정보 수정" : "신규 제품 등록"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">카테고리</label>
              <select name="category" defaultValue={editingItem?.category || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none appearance-none">
                <option value="">카테고리 선택</option>
                {categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))
                ) : (
                  <>
                    <option value="차단기">차단기 (기본)</option>
                    <option value="전선">전선 (기본)</option>
                    <option value="조명">조명 (기본)</option>
                    <option value="수배전반">수배전반 (기본)</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">제품명</label>
              <input name="name" defaultValue={editingItem?.name || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="제품명 입력" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">상세 사양</label>
            <textarea name="spec" defaultValue={editingItem?.spec || ""} rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none resize-none" placeholder="모델명, 정격 등을 입력하세요" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">가격 (₩)</label>
              <input name="price" type="number" defaultValue={editingItem?.price || 0} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">디스플레이 설정</label>
              <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl">
                <input type="checkbox" name="isPublic" defaultChecked={editingItem?.isPublic !== false} className="w-6 h-6 accent-slate-950" />
                <span className="text-base font-bold text-slate-900 uppercase tracking-tighter">플랫폼 공개 여부</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">이미지 라이브러리</label>
            
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
                <span className="block text-base font-black text-slate-900 mb-1">이미지 추가하기</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">누적 업로드가 가능합니다 (최대 10MB)</span>
              </div>
            </div>

            {/* Preview Grid */}
            {(existingImagesToKeep.length > 0 || pendingImages.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                {/* Existing Images */}
                {existingImagesToKeep.map((url, idx) => (
                  <div key={`existing-${idx}`} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm">
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
                  <div key={`pending-${idx}`} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
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
              {loading ? '데이터 동기화 중...' : (editingItem ? '수정 사항 반영' : '제품 정보 등록')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
