"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { GlobalSettings } from "@/types/settings";

interface SettingsContextType {
  settings: GlobalSettings | null;
  updateSettings: (newSettings: Partial<GlobalSettings>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({
  children,
  initialSettings,
}: {
  readonly children: React.ReactNode;
  readonly initialSettings: GlobalSettings;
}) {
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(
    async (newSettings: Partial<GlobalSettings>) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "settings",
            data: { ...settings, ...newSettings },
          }),
        });

        if (!response.ok) throw new Error("설정 업데이트에 실패했습니다.");

        setSettings((prev) => ({ ...prev, ...newSettings }));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 에러가 발생했습니다.",
        );
        console.error("Settings update error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [settings],
  );

  const value = React.useMemo(
    () => ({
      settings,
      updateSettings,
      isLoading,
      error,
    }),
    [settings, updateSettings, isLoading, error],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
