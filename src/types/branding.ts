export type ButtonStyle = "sharp" | "rounded" | "glass";
export type CursorStyle = "minimal" | "dynamic" | "classic";
export type TextAlign = "left" | "center" | "right";
export type CardSize = "small" | "medium" | "large" | "custom";
export type LayoutType = "split" | "full" | "minimal";
export type ImagePosition = "left" | "right" | "top";

export interface BrandingSettings {
  appearance: {
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    buttonStyle: ButtonStyle;
    cursorStyle: CursorStyle;
    fonts: {
      fontFamily: string;
      headingFont: string;
      titleFont?: string;
      descriptionFont?: string;
    };
    fontSizes: {
      heroTitle: number;
      heroSubtitle: number;
      sectionTitle: number;
      bodyText: number;
      cardCategory: number;
    };
    mobileFontSizes: {
      heroTitle: number;
      heroSubtitle: number;
    };
    layout: {
      sectionGap: number;
      lineHeight: string | number;
      letterSpacing: string;
      textAlign: TextAlign;
      containerMaxWidth?: number;
      contentMaxWidth?: number;
      useFixedLayout?: boolean;
      sectionPadding?: number;
      cardRadius?: number;
    };
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      wordStyles: string[];
      alignment: "left" | "center" | "right";
    };
  };
  pages: {
    work: {
      title: string;
      description: string;
      alignment: TextAlign;
      cardSize: CardSize;
      cardGap: number;
      gridColumns: number;
      showCategories: boolean;
      titleFont?: string;
      descriptionFont?: string;
      categories?: string[];
      cardDesign?: "minimal" | "modern" | "glass";
    };
    about: {
      title: string;
      description: string;
      alignment: TextAlign;
      layoutType: LayoutType;
      imagePosition: ImagePosition;
    };
    talk: {
      title: string;
      description: string;
      alignment: TextAlign;
      email: string;
      socials: {
        instagram: string;
        linkedin: string;
        github: string;
      };
    };
  };
}
