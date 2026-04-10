import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
  error:   <XCircle     size={18} className="text-rose-500 shrink-0" />,
  warning: <AlertCircle size={18} className="text-amber-500 shrink-0" />,
  info:    <Info        size={18} className="text-blue-500 shrink-0" />,
};

const BAR_COLOR = {
  success: 'bg-emerald-500',
  error:   'bg-rose-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 bg-white border border-slate-100 shadow-2xl shadow-slate-200/60 rounded-2xl px-4 py-3.5 min-w-[280px] max-w-sm relative overflow-hidden"
      style={{ animation: 'slideInRight 0.25s ease-out' }}
    >
      {/* Left colour bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${BAR_COLOR[toast.type] ?? BAR_COLOR.info} rounded-l-2xl`} />

      {ICONS[toast.type] ?? ICONS.info}

      <p className="text-sm font-bold text-slate-700 flex-1 leading-snug pt-0.5">{toast.message}</p>

      {/* Dismiss button */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useUI();

  if (!toasts.length) return null;

  return (
    <>
      {/* Keyframe style injected inline so no extra CSS file is needed */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)       scale(1);  }
        }
      `}</style>

      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-auto"
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </>
  );
}
