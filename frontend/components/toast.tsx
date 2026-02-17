"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    success: (message: string) => ctx.addToast(message, "success"),
    error: (message: string) => ctx.addToast(message, "error"),
    info: (message: string) => ctx.addToast(message, "info"),
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      const duration = variant === "error" ? 5000 : 3000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:left-auto sm:items-end"
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} item={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const isSuccess = item.variant === "success";

  return (
    <div
      className="animate-fade-up bg-surface text-foreground pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-[var(--color-divider)] px-4 py-3 shadow-lg"
      role="alert"
    >
      {isSuccess && (
        <CheckCircle2 className="text-primary h-5 w-5 shrink-0" aria-hidden />
      )}
      <p className="text-body text-sm font-medium">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="text-body hover:bg-background/60 -m-1 ml-auto rounded-lg p-1 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:outline-none"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
