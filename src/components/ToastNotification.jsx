import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Flame className="w-5 h-5 text-brand-flame shrink-0 animate-pulse" />,
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-bounce-in transition-all">
      <div className="bg-[#18181B] border border-brand-red/50 text-[#F5EBDD] p-4 rounded-xl shadow-flame flex items-center space-x-3 backdrop-blur-md">
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-sm font-medium tracking-wide">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
