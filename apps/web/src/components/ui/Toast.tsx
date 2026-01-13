'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@/lib/utils';
import styles from './Toast.module.css';

export interface ToastOptions {
  /** Тип уведомления */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Длительность отображения (мс), 0 = бесконечно */
  duration?: number;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Хук для работы с Toast уведомлениями
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

/**
 * Провайдер для Toast системы
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const { variant = 'info', duration = 3000 } = options;
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, variant }]);

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

/**
 * Контейнер для отображения Toast уведомлений
 */
function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  // Монтируем только на клиенте
  useState(() => {
    setMounted(true);
  });

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}

/**
 * Отдельный Toast компонент
 */
function Toast({
  message,
  variant,
  onClose,
}: {
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}) {
  return (
    <div
      className={cx(styles.toast, styles[variant])}
      role="status"
      aria-live="polite"
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
}
