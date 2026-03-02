import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/shared/layout/ClientLayout";
import { VibeProvider } from "@/components/features/vibe-switcher/VibeContext";
import fs from "node:fs/promises";
import path from "node:path";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

async function getSiteConfig() {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "site-config.json",
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading site-config:", error);
    return {
      siteName: "Portfolio",
      role: "Designer & Developer",
      bio: "Creative Portfolio",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: {
      default:
        siteConfig.metaTitle || `${siteConfig.siteName} | ${siteConfig.role}`,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: siteConfig.metaDescription || siteConfig.bio,
    keywords: siteConfig.keywords
      ? siteConfig.keywords.split(",").map((k: string) => k.trim())
      : undefined,
    openGraph: {
      title:
        siteConfig.metaTitle || `${siteConfig.siteName} | ${siteConfig.role}`,
      description: siteConfig.metaDescription || siteConfig.bio,
      images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined,
    },
  };
}

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "settings.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load settings:", error);
    return { appearance: { theme: "black" } };
  }
}

import { CustomCursor } from "@/components/ui/CustomCursor";
import { ThemeSync } from "@/components/shared/ThemeSync";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  const settings = await getSettings();
  const theme = settings?.appearance?.theme || "black";
  const themeClass = theme === "black" ? "" : `theme-${theme}`;

  const fontVars = {
    // Desktop
    "--font-heroTitle": `${settings?.appearance?.fontSizes?.heroTitle}px`,
    "--font-heroSubtitle": `${settings?.appearance?.fontSizes?.heroSubtitle}px`,
    "--font-philosophyTitle": `${settings?.appearance?.fontSizes?.philosophyTitle}px`,
    "--font-philosophyDesc": `${settings?.appearance?.fontSizes?.philosophyDesc}px`,
    "--font-sectionTitle": `${settings?.appearance?.fontSizes?.sectionTitle}px`,
    "--font-sectionDescription": `${settings?.appearance?.fontSizes?.sectionDescription}px`,
    "--font-cardTitle": `${settings?.appearance?.fontSizes?.cardTitle}px`,
    "--font-cardCategory": `${settings?.appearance?.fontSizes?.cardCategory}px`,
    "--font-bodyText": `${settings?.appearance?.fontSizes?.bodyText}px`,
    "--font-navigation": `${settings?.appearance?.fontSizes?.navigation}px`,
    // Mobile
    "--m-font-heroTitle": `${settings?.appearance?.mobileFontSizes?.heroTitle}px`,
    "--m-font-heroSubtitle": `${settings?.appearance?.mobileFontSizes?.heroSubtitle}px`,
    "--m-font-philosophyTitle": `${settings?.appearance?.mobileFontSizes?.philosophyTitle}px`,
    "--m-font-philosophyDesc": `${settings?.appearance?.mobileFontSizes?.philosophyDesc}px`,
    "--m-font-sectionTitle": `${settings?.appearance?.mobileFontSizes?.sectionTitle}px`,
    "--m-font-sectionDescription": `${settings?.appearance?.mobileFontSizes?.sectionDescription}px`,
    "--m-font-cardTitle": `${settings?.appearance?.mobileFontSizes?.cardTitle}px`,
    "--m-font-cardCategory": `${settings?.appearance?.mobileFontSizes?.cardCategory}px`,
    "--m-font-bodyText": `${settings?.appearance?.mobileFontSizes?.bodyText}px`,
    "--m-font-navigation": `${settings?.appearance?.mobileFontSizes?.navigation}px`,
    // Layout
    "--section-gap": `${settings?.appearance?.layout?.sectionGap}px`,
    "--container-max-width": `${settings?.appearance?.layout?.containerMaxWidth}px`,
    "--content-max-width": `${settings?.appearance?.layout?.contentMaxWidth}px`,
    "--text-align": settings?.appearance?.layout?.textAlign || "center",
    "--letter-spacing": `${settings?.appearance?.layout?.letterSpacing || -0.02}em`,
    "--line-height": settings?.appearance?.layout?.lineHeight || 1.6,
    "--font-primary":
      settings?.appearance?.fonts?.fontFamily === "Outfit"
        ? "var(--font-outfit)"
        : settings?.appearance?.fonts?.fontFamily,
  } as React.CSSProperties;

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={themeClass}
      style={fontVars}
    >
      <body
        className={`${outfit.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeSync settings={settings} />
        <CustomCursor />
        <VibeProvider>
          <ClientLayout
            interClassName={outfit.className}
            siteName={siteConfig.siteName}
          >
            {children}
          </ClientLayout>
        </VibeProvider>
      </body>
    </html>
  );
}
