import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latestToast = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      dispatch(removeToast(latestToast.id));
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let borderColor = 'border-emerald-200 bg-white dark:bg-slate-900 dark:border-emerald-800/60';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderColor = 'border-rose-200 bg-white dark:bg-slate-900 dark:border-rose-800/60';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderColor = 'border-amber-200 bg-white dark:bg-slate-900 dark:border-amber-800/60';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          borderColor = 'border-blue-200 bg-white dark:bg-slate-900 dark:border-blue-800/60';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderColor} animate-in slide-in-from-right duration-200 transition-all`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

