import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map(toast => {
          let Icon = CheckCircle2;
          let bgColor = 'bg-white border-[#E09F95] text-[#2C1D1B]';
          let iconColor = 'text-[#C97A72]';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            bgColor = 'bg-[#FFF5F5] border-red-300 text-red-950';
            iconColor = 'text-red-500';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            bgColor = 'bg-[#FFFBF0] border-amber-300 text-amber-950';
            iconColor = 'text-amber-500';
          } else if (toast.type === 'info') {
            Icon = Info;
            bgColor = 'bg-[#F4F9FF] border-blue-200 text-blue-950';
            iconColor = 'text-blue-500';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start space-x-3 ${bgColor}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm">
                {toast.title && <p className="font-semibold text-xs uppercase tracking-wider mb-0.5">{toast.title}</p>}
                <p className="font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 transition p-0.5 -mr-1 -mt-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
