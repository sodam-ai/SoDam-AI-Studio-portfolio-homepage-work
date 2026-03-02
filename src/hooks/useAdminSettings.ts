/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

export function useAdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
    }
  };

  const updateFontSize = (
    mode: "desktop" | "mobile",
    field: string,
    value: number,
  ) => {
    setSettings((prev: any) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [mode === "desktop" ? "fontSizes" : "mobileFontSizes"]: {
          ...prev.appearance?.[
            mode === "desktop" ? "fontSizes" : "mobileFontSizes"
          ],
          [field]: value,
        },
      },
    }));
  };

  const updateLayout = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        layout: {
          ...prev.appearance?.layout,
          [field]: value,
        },
      },
    }));
  };

  const updateValue = (category: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  return {
    settings,
    setSettings,
    loading,
    saveStatus,
    handleSave,
    updateFontSize,
    updateLayout,
    updateValue,
    refresh: fetchSettings,
  };
}
