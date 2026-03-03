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

  const appearance = settings?.appearance || {};
  const fontSizes = appearance.fontSizes || {};
  const mobileFontSizes = appearance.mobileFontSizes || {};
  const layout = appearance.layout || {};
  const fonts = appearance.fonts || {};

  const fontVars = {
    // Desktop
    "--font-heroTitle": fontSizes.heroTitle
      ? `${fontSizes.heroTitle}px`
      : undefined,
    "--font-heroSubtitle": fontSizes.heroSubtitle
      ? `${fontSizes.heroSubtitle}px`
      : undefined,
    "--font-philosophyTitle": fontSizes.philosophyTitle
      ? `${fontSizes.philosophyTitle}px`
      : undefined,
    "--font-philosophyDesc": fontSizes.philosophyDesc
      ? `${fontSizes.philosophyDesc}px`
      : undefined,
    "--font-sectionTitle": fontSizes.sectionTitle
      ? `${fontSizes.sectionTitle}px`
      : undefined,
    "--font-sectionDescription": fontSizes.sectionDescription
      ? `${fontSizes.sectionDescription}px`
      : undefined,
    "--font-cardTitle": fontSizes.cardTitle
      ? `${fontSizes.cardTitle}px`
      : undefined,
    "--font-cardCategory": fontSizes.cardCategory
      ? `${fontSizes.cardCategory}px`
      : undefined,
    "--font-bodyText": fontSizes.bodyText
      ? `${fontSizes.bodyText}px`
      : undefined,
    "--font-navigation": fontSizes.navigation
      ? `${fontSizes.navigation}px`
      : undefined,
    // Mobile
    "--m-font-heroTitle": mobileFontSizes.heroTitle
      ? `${mobileFontSizes.heroTitle}px`
      : undefined,
    "--m-font-heroSubtitle": mobileFontSizes.heroSubtitle
      ? `${mobileFontSizes.heroSubtitle}px`
      : undefined,
    "--m-font-philosophyTitle": mobileFontSizes.philosophyTitle
      ? `${mobileFontSizes.philosophyTitle}px`
      : undefined,
    "--m-font-philosophyDesc": mobileFontSizes.philosophyDesc
      ? `${mobileFontSizes.philosophyDesc}px`
      : undefined,
    "--m-font-sectionTitle": mobileFontSizes.sectionTitle
      ? `${mobileFontSizes.sectionTitle}px`
      : undefined,
    "--m-font-sectionDescription": mobileFontSizes.sectionDescription
      ? `${mobileFontSizes.sectionDescription}px`
      : undefined,
    "--m-font-cardTitle": mobileFontSizes.cardTitle
      ? `${mobileFontSizes.cardTitle}px`
      : undefined,
    "--m-font-cardCategory": mobileFontSizes.cardCategory
      ? `${mobileFontSizes.cardCategory}px`
      : undefined,
    "--m-font-bodyText": mobileFontSizes.bodyText
      ? `${mobileFontSizes.bodyText}px`
      : undefined,
    "--m-font-navigation": mobileFontSizes.navigation
      ? `${mobileFontSizes.navigation}px`
      : undefined,
    // Layout
    "--section-gap": layout.sectionGap ? `${layout.sectionGap}px` : undefined,
    "--container-max-width": layout.containerMaxWidth
      ? `${layout.containerMaxWidth}px`
      : undefined,
    "--content-max-width": layout.contentMaxWidth
      ? `${layout.contentMaxWidth}px`
      : undefined,
    "--text-align": layout.textAlign || "center",
    "--letter-spacing": layout.letterSpacing
      ? `${layout.letterSpacing}em`
      : "-0.02em",
    "--line-height": layout.lineHeight || 1.6,
    "--font-primary":
      fonts.fontFamily === "Outfit" ? "var(--font-outfit)" : fonts.fontFamily,
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
            logoUrl={siteConfig.logoUrl}
          >
            {children}
          </ClientLayout>
        </VibeProvider>
      </body>
    </html>
  );
}
