import { createContext, useContext, useState, useCallback, useRef } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts,    setToasts]    = useState([]);
  const [dateRange, setDateRange] = useState(30);
  const [modals,    setModals]    = useState({});
  const idRef = useRef(0);            // stable counter – never resets on re-render
  const activeMessages = useRef(new Set()); // dedup guard

  const openModal  = useCallback((name) => setModals(p => ({ ...p, [name]: true })),  []);
  const closeModal = useCallback((name) => setModals(p => ({ ...p, [name]: false })), []);

  /**
   * addToast – fires ONCE per unique message+type pair within the display window.
   * Prevents duplicate spam from StrictMode double-invocation or race conditions.
   */
  const addToast = useCallback((message, type = 'success') => {
    const dedupKey = `${type}::${message}`;

    // Reject the second call if the same message is already being shown
    if (activeMessages.current.has(dedupKey)) return;
    activeMessages.current.add(dedupKey);

    const id = ++idRef.current;
    setToasts(p => [...p, { id, message, type }]);

    const TTL = 3500;
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id));
      activeMessages.current.delete(dedupKey);
    }, TTL);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(p => {
      const toast = p.find(t => t.id === id);
      if (toast) {
        const dedupKey = `${toast.type}::${toast.message}`;
        activeMessages.current.delete(dedupKey);
      }
      return p.filter(t => t.id !== id);
    });
  }, []);

  return (
    <UIContext.Provider value={{ toasts, addToast, dismissToast, dateRange, setDateRange, modals, openModal, closeModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
