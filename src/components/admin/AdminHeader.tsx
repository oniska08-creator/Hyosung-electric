import React from 'react';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function AdminHeader({ 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}: AdminHeaderProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/20 mb-10 overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-[-0.03em] mb-4 text-slate-950 uppercase leading-tight">{title}</h1>
          <p className="text-slate-500 font-bold leading-relaxed text-lg max-w-2xl mx-auto">{description}</p>
        </div>
        
        {buttonText && (
          <button 
            onClick={onButtonClick}
            className="flex items-center gap-4 px-12 py-6 bg-slate-950 text-white text-xl rounded-2xl font-black hover:bg-primary hover:text-slate-950 transition-all active:scale-95 shadow-2xl shadow-slate-950/20"
          >
            <Plus size={28} />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] -ml-32 -mb-32" />
    </div>
  );
}
