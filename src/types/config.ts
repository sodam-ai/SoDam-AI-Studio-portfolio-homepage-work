export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  role: string;
  bio: string;
  slogan: string;
  connectors: {
    id: string;
    label: string;
    url: string;
  }[];
  location?: string;
  landingHero?: {
    title: string;
    subtitle: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string;
  categories: string[];
}
