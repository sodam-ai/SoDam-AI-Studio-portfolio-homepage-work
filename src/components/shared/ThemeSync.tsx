"use client";

import { useEffect } from "react";

interface ThemeSyncProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly settings: any;
}

export function ThemeSync({ settings }: ThemeSyncProps) {
  useEffect(() => {
    if (!settings?.appearance) return;

    const root = document.documentElement;
    const {
      fontSizes,
      mobileFontSizes,
      layout,
      fonts,
      accentColor,
      backgroundColor,
      surfaceColor,
      textColor,
    } = settings.appearance;

    // Desktop Font Sizes
    if (fontSizes) {
      Object.entries(fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, `${value}px`);
      });
    }

    // Mobile Font Sizes
    if (mobileFontSizes) {
      Object.entries(mobileFontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--m-font-${key}`, `${value}px`);
      });
    }

    // Layout Settings
    if (layout) {
      if (layout.sectionGap !== undefined)
        root.style.setProperty("--section-gap", `${layout.sectionGap}px`);
      if (layout.containerMaxWidth !== undefined)
        root.style.setProperty(
          "--container-max-width",
          `${layout.containerMaxWidth}px`,
        );
      if (layout.contentMaxWidth !== undefined)
        root.style.setProperty(
          "--content-max-width",
          `${layout.contentMaxWidth}px`,
        );
      if (layout.textAlign)
        root.style.setProperty("--text-align", layout.textAlign);
      if (layout.letterSpacing !== undefined)
        root.style.setProperty("--letter-spacing", `${layout.letterSpacing}em`);
      if (layout.lineHeight !== undefined)
        root.style.setProperty("--line-height", layout.lineHeight.toString());
    }

    // Font Family
    if (fonts?.fontFamily) {
      const family =
        fonts.fontFamily === "Outfit" ? "var(--font-outfit)" : fonts.fontFamily;
      root.style.setProperty("--font-primary", family);
      // For global body application if needed
      document.body.style.fontFamily = family;
    }
    if (fonts?.headingFont) {
      const headingFamily =
        fonts.headingFont === "Outfit"
          ? "var(--font-outfit)"
          : fonts.headingFont;
      root.style.setProperty("--font-heading", headingFamily);
    }

    // Colors
    if (backgroundColor)
      root.style.setProperty("--background", backgroundColor);
    if (textColor) root.style.setProperty("--foreground", textColor);
    if (surfaceColor) root.style.setProperty("--card", surfaceColor);
    if (accentColor) {
      root.style.setProperty("--primary", accentColor);
      root.style.setProperty("--accent", accentColor);
    }

    // Styles
    if (settings.appearance.buttonStyle) {
      root.dataset.buttonStyle = settings.appearance.buttonStyle;
    }
    if (settings.appearance.cursorStyle) {
      root.dataset.cursorStyle = settings.appearance.cursorStyle;
    }
  }, [settings]);

  return null;
}
