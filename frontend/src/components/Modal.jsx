import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './ui/Button';

const SIZE_MAP = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  const panelRef = useRef(null);

  /* ── lock scroll ── */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxW = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative bg-white rounded-[2rem] shadow-2xl w-full ${maxW} z-10 overflow-hidden`}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-start justify-between border-b border-slate-100">
          <div>
            <h3 id="modal-title" className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm font-semibold text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <IconButton
            icon={<X size={18} />}
            label="Close modal"
            variant="ghost"
            size="sm"
            shape="circle"
            onClick={onClose}
            className="shrink-0 ml-4 -mt-1"
          />
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
