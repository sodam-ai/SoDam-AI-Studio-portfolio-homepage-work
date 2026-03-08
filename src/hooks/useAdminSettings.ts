"use client";

import { useSettings } from "@/components/providers/SettingsProvider";
import { GlobalSettings } from "@/types/settings";

export function useAdminSettings() {
  const { settings, updateSettings, isLoading, error } = useSettings();

  const updateSettingField = async <K extends keyof GlobalSettings>(
    category: K,
    data: Partial<GlobalSettings[K]>,
  ) => {
    if (!settings) return;

    const newCategorySettings = {
      ...settings[category],
      ...data,
    };

    await updateSettings({
      [category]: newCategorySettings,
    });
  };

  return {
    settings,
    updateSettingField,
    isLoading,
    error,
  };
}
