"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

export type VibeType = "standard" | "cyberpunk" | "dreamy" | "mono";

export interface VibeContextType {
  vibe: VibeType;
  setVibe: (vibe: VibeType) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [vibe, setVibeState] = useState<VibeType>("standard");

  useEffect(() => {
    const savedVibe = localStorage.getItem("user-vibe") as VibeType;
    if (savedVibe) {
      setVibeState(savedVibe);
      document.documentElement.setAttribute("data-vibe", savedVibe);
    }
  }, []);

  const setVibe = (newVibe: VibeType) => {
    setVibeState(newVibe);
    localStorage.setItem("user-vibe", newVibe);
    document.documentElement.setAttribute("data-vibe", newVibe);
  };

  const value = useMemo(() => ({ vibe, setVibe }), [vibe]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error("useVibe must be used within a VibeProvider");
  }
  return context;
}
