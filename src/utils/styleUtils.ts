import { CSSProperties } from "react";
import { ElementStyle, styleToCss } from "@/types/style";

/**
 * ElementStyle 객체를 React CSS 인라인 스타일 객체로 변환합니다.
 * (중복 로직 제거 및 옴니-제어 통합)
 */
export function getElementStyles(style?: ElementStyle): CSSProperties {
  return styleToCss(style);
}

/**
 * 텍스트 내용 안의 줄바꿈을 처리합니다.
 */
export function formatTextWithBreaks(
  text: string,
  style?: ElementStyle,
): string {
  if (!style) return text;

  if (style.lineBreak === "hard") {
    // 하드 브레이크: 실제 줄바꿈을 유지
    return text;
  }

  if (style.lineBreak === "soft") {
    // 소프트 브레이크: 특정 패턴이나 길이에 따른 자동 줄바꿈 유도 (현재는 pre-wrap으로 처리)
    return text;
  }

  return text;
}
