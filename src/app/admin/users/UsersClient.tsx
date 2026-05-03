"use client";

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createAdminUser, deleteAdminUser, updateAdminUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, Trash2, Key, Edit3 } from 'lucide-react';

export default function UsersClient({ initialUsers, currentUser }: { initialUsers: any[], currentUser: any }) {
  const router = useRouter();
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
    if (id === currentUser.id) {
      alert('자기 자신은 삭제할 수 없습니다.');
      return;
    }
    if (confirm('이 관리자 계정을 삭제하시겠습니까?')) {
      await deleteAdminUser(id);
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingItem) {
        await updateAdminUser(editingItem.id, formData);
      } else {
        await createAdminUser(formData);
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
      key: 'name', 
      label: '이름',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black">
            {item.name?.charAt(0) || item.username.charAt(0)}
          </div>
          <span className="font-black text-slate-900">{item.name || '-'}</span>
        </div>
      )
    },
    { key: 'username', label: '아이디' },
    { 
      key: 'role', 
      label: '권한',
      render: (item: any) => (
        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${
          item.role === 'SUPER_ADMIN' 
          ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20' 
          : 'bg-slate-100 text-slate-500'
        }`}>
          {item.role === 'SUPER_ADMIN' ? '최고 관리자' : '일반 관리자'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: '생성일',
      render: (item: any) => (
        <span className="text-xs text-slate-400 font-bold">
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </span>
      )
    },
  ];

  return (
    <div className="pb-20">
      <AdminHeader 
        title="관리자 계정 통합 제어"
        description="시스템 접근 권한을 가진 관리자들을 관리합니다. 일반 관리자는 콘텐츠만 수정 가능하며, 최고 관리자만이 이 화면에 접근할 수 있습니다."
        buttonText="신규 관리자 추가"
        onButtonClick={handleCreate}
      />

      <AdminTable 
        columns={columns} 
        data={initialUsers} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "관리자 계정 정보 수정" : "신규 관리자 계정 생성"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">관리자 이름</label>
              <input name="name" type="text" defaultValue={editingItem?.name || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="홍길동" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">계정 권한 설정</label>
              <select name="role" defaultValue={editingItem?.role || "ADMIN"} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none appearance-none">
                <option value="ADMIN">일반 관리자</option>
                <option value="SUPER_ADMIN">최고 관리자</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">로그인 아이디 (Username)</label>
            <input name="username" type="text" defaultValue={editingItem?.username || ""} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder="admin_user" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
              {editingItem ? "새 비밀번호 (변경 시에만 입력)" : "로그인 비밀번호"}
            </label>
            <input name="password" type="password" required={!editingItem} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none" placeholder={editingItem ? "비밀번호 유지 시 공란" : "••••••••"} />
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-end gap-5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">
              취소
            </button>
            <button type="submit" disabled={loading} className={`px-14 py-5 bg-slate-950 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? '처리 중...' : (editingItem ? '정보 수정 완료' : '신규 계정 등록')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
