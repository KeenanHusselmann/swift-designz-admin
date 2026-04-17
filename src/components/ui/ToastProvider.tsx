"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

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

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  const dismiss = useCallback(() => { clear(); setToast(null); }, []);

  const show = useCallback((type: ToastType, message: string, ms?: number) => {
    clear();
    setToast({ type, message });
    if (ms) timer.current = setTimeout(() => setToast(null), ms);
  }, []);

  const api: ToastAPI = {
    loading: useCallback((msg) => show("loading", msg), [show]),
    success: useCallback((msg) => show("success", msg, 2500), [show]),
    error:   useCallback((msg) => show("error",   msg, 4000), [show]),
    dismiss,
  };

  return (
    <Ctx.Provider value={api}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
          >
            <div className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl bg-sidebar border border-border shadow-2xl shadow-black/60 backdrop-blur-md min-w-[220px] max-w-xs">
              {toast.type === "loading" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/favicon.png"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                  style={{ animation: "spin 0.75s linear infinite" }}
                />
              )}
              {toast.type === "success" && (
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                </span>
              )}
              {toast.type === "error" && (
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
                  <X className="h-3 w-3 text-red-400" strokeWidth={3} />
                </span>
              )}
              <p className="text-sm font-medium text-foreground leading-tight flex-1">{toast.message}</p>
              {toast.type === "error" && (
                <button onClick={dismiss} className="ml-1 shrink-0 text-gray-500 hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
