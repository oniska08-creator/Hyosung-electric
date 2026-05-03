import React, { useState } from 'react';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onView?: (item: any) => void;
}

export default function AdminTable({ columns, data = [], onEdit, onDelete, onView }: AdminTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const safeData = Array.isArray(data) ? data : [];
  const totalPages = Math.ceil(safeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = safeData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 text-right">
                    관리
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg font-bold text-slate-700">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                      <div className="flex justify-end items-center gap-1 md:gap-2">
                        {onView && (
                          <button onClick={() => onView(item)} className="p-2 md:p-3 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all">
                            <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(item)} className="p-2 md:p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                            <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item.id)} className="p-2 md:p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center text-slate-300 font-bold italic">
                    표시할 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <button 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:border-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all active:scale-90 ${
                  currentPage === page 
                  ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/20' 
                  : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-slate-200 shadow-sm'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:border-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
