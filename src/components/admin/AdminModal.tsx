import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function AdminModal({ isOpen, onClose, title, children }: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Body */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 md:px-12 py-6 md:py-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-xl md:text-4xl font-black tracking-[-0.03em] text-slate-950 uppercase">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 md:p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all active:scale-95"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
