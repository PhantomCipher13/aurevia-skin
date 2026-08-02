"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "cart";
  subtitle?: string;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: "success" | "info" | "cart",
    subtitle?: string
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ─── Icons ─── */
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#C7A064" strokeWidth="1.2" />
      <path
        d="M5.5 9L8 11.5L12.5 6.5"
        stroke="#C7A064"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7A064" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#C7A064" strokeWidth="1.2" />
      <path d="M9 8v4" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.8" fill="#C7A064" />
    </svg>
  );
}

/* ─── Provider ─── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "cart" = "success", subtitle?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type, subtitle }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-24 right-6 z-[9990] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto"
            >
              <div
                className="flex items-start gap-3.5 px-5 py-4 rounded-2xl min-w-[280px] max-w-[380px]"
                style={{
                  background: "rgba(251,248,244,0.92)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(234,217,195,0.4)",
                  boxShadow:
                    "0 12px 40px rgba(52,42,36,0.1), 0 2px 8px rgba(52,42,36,0.06)",
                }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    background: "rgba(199,160,100,0.1)",
                    border: "1px solid rgba(199,160,100,0.2)",
                  }}
                >
                  {toast.type === "cart" ? (
                    <CartIcon />
                  ) : toast.type === "info" ? (
                    <InfoIcon />
                  ) : (
                    <CheckIcon />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-medium leading-snug"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#342A24",
                    }}
                  >
                    {toast.message}
                  </p>
                  {toast.subtitle && (
                    <p
                      className="text-[11px] mt-1 leading-snug"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "#493E36",
                        opacity: 0.6,
                      }}
                    >
                      {toast.subtitle}
                    </p>
                  )}
                </div>

                {/* Dismiss */}
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="flex-shrink-0 mt-0.5 opacity-40 hover:opacity-70 transition-opacity"
                  aria-label="Dismiss"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 3l8 8M11 3l-8 8"
                      stroke="#493E36"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.5, ease: "linear" }}
                className="h-[2px] mt-1 mx-4 rounded-full origin-left"
                style={{ background: "#C7A064" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
