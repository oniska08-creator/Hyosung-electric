"use client";

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { 
  createProductCategory, updateProductCategory, deleteProductCategory,
  createProjectCategory, updateProjectCategory, deleteProjectCategory 
} from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Briefcase, Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoriesClient({ productCategories, projectCategories }: { productCategories: any[], projectCategories: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'product' | 'project'>('product');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('카테고리를 삭제하시겠습니까? 관련 데이터의 카테고리 정보는 유지되지만 목록에서 선택할 수 없게 됩니다.')) {
      if (activeTab === 'product') {
        await deleteProductCategory(id);
      } else {
        await deleteProjectCategory(id);
      }
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (activeTab === 'product') {
        if (editingItem) {
          await updateProductCategory(editingItem.id, formData);
        } else {
          await createProductCategory(formData);
        }
      } else {
        if (editingItem) {
          await updateProjectCategory(editingItem.id, formData);
        } else {
          await createProjectCategory(formData);
        }
      }
      setIsModalOpen(false);
      setLoading(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert('처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'order', 
      label: '정렬 순서',
      render: (item: any) => (
        <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100">
          {item.order}
        </span>
      )
    },
    { key: 'name', label: '카테고리명', render: (item: any) => <span className="text-xl font-black text-slate-900">{item.name}</span> },
  ];

  const currentData = activeTab === 'product' ? productCategories : projectCategories;

  return (
    <div className="pb-20">
      <AdminHeader 
        title="카테고리 마스터 관리"
        description="제품 및 시공사례에서 사용하는 공통 카테고리를 관리합니다. 정렬 순서가 낮을수록 사용자 화면 상단에 노출됩니다."
        buttonText={`${activeTab === 'product' ? '제품' : '시공'} 카테고리 추가`}
        onButtonClick={handleCreate}
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-10 p-2 bg-slate-100/50 rounded-3xl w-fit">
        <button 
          onClick={() => setActiveTab('product')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'product' ? 'bg-white text-slate-950 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutGrid size={20} />
          제품 카테고리
        </button>
        <button 
          onClick={() => setActiveTab('project')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'project' ? 'bg-white text-slate-950 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Briefcase size={20} />
          시공사례 카테고리
        </button>
      </div>

      <AdminTable 
        key={activeTab}
        columns={columns} 
        data={currentData} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? '카테고리 수정' : '신규 카테고리 등록'} (${activeTab === 'product' ? '제품' : '시공'})`}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">카테고리 명칭</label>
            <input name="name" type="text" defaultValue={editingItem?.name || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="예: 고압 차단기" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">노출 순서 (낮을수록 먼저 노출)</label>
            <input name="order" type="number" min="1" defaultValue={editingItem?.order ?? (currentData.length + 1)} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" />
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-end gap-5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">
              취소
            </button>
            <button type="submit" disabled={loading} className={`px-14 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? '처리 중...' : (editingItem ? '수정 완료' : '등록 완료')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
