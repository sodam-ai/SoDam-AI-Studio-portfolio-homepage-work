import {
  ElementStyle,
  TextAlign,
  CardSize,
  LayoutType,
  ImagePosition,
} from "./style";

export type {
  ButtonStyle,
  CursorStyle,
  TextAlign,
  CardSize,
  LayoutType,
  ImagePosition,
} from "./style";

export interface SectionSettings {
  isVisible?: boolean;
  title: string;
  titleStyle?: ElementStyle;
  subtitle?: string;
  subtitleStyle?: ElementStyle;
  description?: string;
  descriptionStyle?: ElementStyle;
  content?: string;
  copyright?: string;
  alignment: TextAlign;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  minHeight?: string;
  contentOffset?: number;
  opacity?: number;
  backgroundColor?: string;
  variant?: string;
  // 카드 그리드 및 요소 제어
  gridColumns?: number;
  cardAspectRatio?: string;
  showCardCategory?: boolean;
  showCardTitle?: boolean;
  showCardDescription?: boolean;
  showCardLink?: boolean;
  cardCategoryStyle?: ElementStyle;
  cardTitleStyle?: ElementStyle;
  cardDescriptionStyle?: ElementStyle;
}

export interface BrandingSettings {
  appearance: {
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    buttonStyle: "sharp" | "rounded" | "glass";
    cursorStyle: "minimal" | "dynamic" | "classic";
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
      containerPadding?: number;
      containerMaxWidth?: number;
      contentMaxWidth?: number;
      useFixedLayout?: boolean;
      sectionPadding?: number;
      cardRadius?: number;
    };
    animations: {
      enabled: boolean;
      preset: "apple" | "trendy" | "minimal";
      speed: "slow" | "normal" | "fast";
      intensity: "minimal" | "medium" | "intense";
    };
  };
  landing: {
    hero: {
      title: string;
      titleStyle?: ElementStyle;
      subtitle: string;
      subtitleStyle?: ElementStyle;
      wordStyles: string[];
      alignment: TextAlign;
      verticalAlignment?: "top" | "center" | "bottom";
      titleSubtitleGap?: number;
      paddingTop?: number;
      paddingBottom?: number;
      marginBottom?: number;
      minHeight?: string;
      contentOffset?: number;
    };
    sections: {
      showcase: SectionSettings;
      philosophy: SectionSettings;
      contact: SectionSettings;
      footer: SectionSettings;
    };
  };
  pages: {
    work: {
      title: string;
      titleStyle?: ElementStyle;
      description: string;
      descriptionStyle?: ElementStyle;
      alignment: TextAlign;
      cardSize: CardSize;
      cardGap: number;
      gridColumns: number;
      showCategories: boolean;
      showLabel?: boolean;
      showTitle?: boolean;
      showDescription?: boolean;
      titleFont?: string;
      descriptionFont?: string;
      categories?: string[];
      cardDesign?: "minimal" | "modern" | "glass";
      cardCategoryStyle?: ElementStyle;
      cardTitleStyle?: ElementStyle;
      cardDescriptionStyle?: ElementStyle;
      containerPaddingTop?: number;
      containerPaddingBottom?: number;
      contentOffset?: number;
    };
    about: {
      title: string;
      titleStyle?: ElementStyle;
      description: string;
      story: string;
      descriptionStyle?: ElementStyle;
      introductionStyle?: ElementStyle;
      storyStyle?: ElementStyle;
      alignment: TextAlign;
      layoutType: LayoutType;
      imagePosition: ImagePosition;
      showLabel?: boolean;
      showTitle?: boolean;
      showDescription?: boolean;
      sectionGap?: number;
      contentOffset?: number;
      introOffset?: number;
    };
    talk: {
      title: string;
      titleStyle?: ElementStyle;
      description: string;
      descriptionStyle?: ElementStyle;
      alignment: TextAlign;
      showLabel?: boolean;
      showTitle?: boolean;
      showDescription?: boolean;
      contentOffset?: number;
      email: string;
      socials: {
        instagram: string;
        linkedin: string;
        github: string;
      };
    };
  };
}
