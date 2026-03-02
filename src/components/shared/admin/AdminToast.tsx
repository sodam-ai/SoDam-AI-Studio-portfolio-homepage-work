"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface AdminToastProps {
  isVisible: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function AdminToast({
  isVisible,
  message,
  type,
  onClose,
}: Readonly<AdminToastProps>) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-8 right-8 z-100 pointer-events-auto"
        >
          <div
            className={`flex items-center gap-4 bg-black/95 backdrop-blur-2xl border px-6 py-4 min-w-72 ${
              type === "success"
                ? "border-green-500/30 text-green-400"
                : "border-red-500/30 text-red-400"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}

            <p className="text-[11px] font-black uppercase tracking-[0.2em] flex-1">
              {message}
            </p>

            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>

            {/* 진행 바 (자동 닫힘 표시) */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: 3, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-px ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
