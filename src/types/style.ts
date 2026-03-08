export type TextAlign = "left" | "center" | "right" | "justify";
export type WhiteSpace = "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
export type ButtonStyle = "sharp" | "rounded" | "glass";
export type CursorStyle = "minimal" | "dynamic" | "classic";
export type CardSize = "small" | "medium" | "large" | "custom";
export type LayoutType = "split" | "full" | "minimal";
export type ImagePosition = "left" | "right" | "top";

export interface ElementStyle {
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  textAlign?: TextAlign;
  fontSize?: number | string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string;
  whiteSpace?: WhiteSpace;
  margin?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  fontFamily?: string;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  position?: "relative" | "absolute" | "fixed" | "sticky";
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: number;
  borderRadius?: string | number;
  border?: string;
  boxShadow?: string;
  transition?: string;
  transform?: string;
  lineBreak?: "hard" | "soft" | "auto";
  wordBreak?: "break-all" | "keep-all" | "normal";
  className?: string;
}

// Helper to add 'px' to number values
export const toPx = (
  value: string | number | undefined,
): string | number | undefined => {
  if (typeof value === "number") return `${value}px`;
  return value;
};

// Helper to convert ElementStyle to React.CSSProperties
export const styleToCss = (style?: ElementStyle): React.CSSProperties => {
  if (!style) return {};

  const css: React.CSSProperties = {
    color: style.color,
    backgroundColor: style.backgroundColor,
    opacity: style.opacity,
    textAlign: style.textAlign,
    fontSize: toPx(style.fontSize),
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    whiteSpace: style.whiteSpace,
    margin: toPx(style.margin),
    marginTop: toPx(style.marginTop),
    marginBottom: toPx(style.marginBottom),
    padding: toPx(style.padding),
    paddingTop: toPx(style.paddingTop),
    paddingBottom: toPx(style.paddingBottom),
    textTransform: style.textTransform,
    fontFamily: style.fontFamily,
    width: toPx(style.width),
    height: toPx(style.height),
    minHeight: toPx(style.minHeight),
    maxHeight: toPx(style.maxHeight),
    maxWidth: toPx(style.maxWidth),
    display: style.display,
    alignItems: style.alignItems as React.CSSProperties["alignItems"],
    justifyContent: style.justifyContent,
    position: style.position,
    top: toPx(style.top),
    bottom: toPx(style.bottom),
    left: toPx(style.left),
    right: toPx(style.right),
    zIndex: style.zIndex,
    borderRadius: toPx(style.borderRadius),
    border: style.border,
    boxShadow: style.boxShadow,
    transition: style.transition,
    transform: style.transform,
  };

  // handle lineBreak and wordBreak
  if (style.lineBreak === "hard") {
    css.wordBreak = "break-all";
  } else if (style.lineBreak === "soft") {
    css.wordBreak = "keep-all";
  }

  if (style.wordBreak) {
    css.wordBreak = style.wordBreak;
  }

  return css;
};
