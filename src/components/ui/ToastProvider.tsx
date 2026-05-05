"use client";

import { createContext, useContext, useCallback, useRef, useState, useEffect, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Loader2, Trash2, Send, Save, Plus, Upload, FileText, CreditCard, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const LOADING_ICONS: Array<{ test: RegExp; Icon: LucideIcon }> = [
  { test: /delet/i,                Icon: Trash2 },
  { test: /send|email|mail/i,      Icon: Send },
  { test: /sav|updat|edit/i,       Icon: Save },
  { test: /creat|add|new/i,        Icon: Plus },
  { test: /upload/i,               Icon: Upload },
  { test: /pdf|generat|document/i, Icon: FileText },
  { test: /pay|record/i,           Icon: CreditCard },
  { test: /refresh|reload|sync/i,  Icon: RefreshCw },
];

function LoadingIcon({ message }: { message: string }) {
  const match = LOADING_ICONS.find(({ test }) => test.test(message));
  if (!match) {
    return (
      <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-teal/15">
        <Loader2 className="h-4 w-4 text-teal animate-spin" strokeWidth={2.5} />
      </span>
    );
  }
  const { Icon } = match;
  return (
    <span className="shrink-0 relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-teal/50 animate-ping" />
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-teal/15">
        <Icon className="h-4 w-4 text-teal" strokeWidth={2.5} />
      </span>
    </span>
  );
}

type ToastType = "loading" | "success" | "error";
interface ToastState { type: ToastType; message: string; }

interface ToastAPI {
  loading: (msg: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  dismiss: () => void;
}

const Ctx = createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // Dismiss loading toast when route changes (e.g. after redirect from server action)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      startTransition(() => {
        setToast((t) => (t?.type === "loading" ? null : t));
      });
      if (timer.current) clearTimeout(timer.current);
    }
  }, [pathname]);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  const dismiss = useCallback(() => { clear(); setToast(null); }, []);

  const show = useCallback((type: ToastType, message: string, ms?: number) => {
    clear();
    setToast({ type, message });
    if (ms) timer.current = setTimeout(() => setToast(null), ms);
  }, []);

  const api: ToastAPI = {
    loading: useCallback((msg) => show("loading", msg, 8000), [show]),
    success: useCallback((msg) => show("success", msg, 3000), [show]),
    error:   useCallback((msg) => show("error",   msg, 5000), [show]),
    dismiss,
  };

  return (
    <Ctx.Provider value={api}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-9999"
          >
            <div className="relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl bg-sidebar border border-border shadow-2xl shadow-black/70 backdrop-blur-md min-w-[320px] max-w-lg">
              {toast.type === "loading" && (
                <LoadingIcon message={toast.message} />
              )}
              {toast.type === "success" && (
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-4.5 w-4.5 text-green-400" strokeWidth={3} />
                </span>
              )}
              {toast.type === "error" && (
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                  <X className="h-4.5 w-4.5 text-red-400" strokeWidth={3} />
                </span>
              )}
              <p className="text-[15px] font-medium text-foreground leading-snug flex-1">{toast.message}</p>
              <button
                onClick={dismiss}
                className="ml-2 shrink-0 text-gray-500 hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Progress bar for timed toasts */}
              {(toast.type === "success" || toast.type === "error") && (
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 rounded-b-2xl ${toast.type === "success" ? "bg-green-500/50" : "bg-red-500/50"}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: toast.type === "success" ? 3 : 5,
                    ease: "linear",
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
