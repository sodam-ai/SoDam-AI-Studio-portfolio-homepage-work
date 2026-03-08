/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Variants, Transition } from "framer-motion";

export type AnimationPreset = "apple" | "trendy" | "minimal";
export type AnimationSpeed = "slow" | "normal" | "fast";

interface AnimationEngineConfig {
  enabled: boolean;
  preset: AnimationPreset;
  speed: AnimationSpeed;
}

/**
 * 하이퍼 애니메이션 엔진: 설정에 따라 framer-motion variants와 transition을 생성합니다.
 */
export function useAnimationEngine(config?: AnimationEngineConfig) {
  const { enabled = true, preset = "apple", speed = "normal" } = config || {};

  // 속도에 따른 시간(Duration) 매핑
  const durationMap = {
    slow: 1.6, // 더 느리게
    normal: 0.8,
    fast: 0.4, // 더 빠르게
  };

  const duration = durationMap[speed];

  // 프리셋별 트랜지션 설정
  const transition = useMemo((): Transition => {
    if (!enabled) return { duration: 0 };

    switch (preset) {
      case "apple":
        return {
          duration: duration * 1.2,
          ease: [0.16, 1, 0.3, 1], // 더 깊은 곡선
        };
      case "trendy": {
        let stiffness = 120;
        if (speed === "fast") stiffness = 200;
        else if (speed === "slow") stiffness = 80;

        const damping = speed === "fast" ? 12 : 15;

        return {
          type: "spring",
          stiffness,
          damping,
          mass: 0.6,
        };
      }
      case "minimal":
        return {
          duration: duration * 0.7,
          ease: "easeOut", // linear보다는 약간의 부드러움 추가
        };
      default:
        return { duration };
    }
  }, [enabled, preset, duration, speed]);

  // 공통적인 방향 기반 Variants 생성
  const getFadeInVariants = (
    arg1: "up" | "down" | "left" | "right" | "none" | number = "up",
    arg2?: number,
  ): Variants => {
    // 인자 분석: (direction, delay) 또는 (delay) 형태 지원
    const direction = typeof arg1 === "string" ? arg1 : "up";
    const delay = typeof arg1 === "number" ? arg1 : arg2 || 0;

    if (!enabled) {
      return {
        initial: { opacity: 1, x: 0, y: 0 },
        animate: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0 },
        },
      };
    }

    const offsetMap = {
      apple: 40, // 깊은 움직임
      trendy: 60, // 큰 튕김
      minimal: 15, // 절제된 움직임
    };
    const offset = offsetMap[preset];

    let initialScale = 1;
    if (preset === "apple") initialScale = 1.02;
    else if (preset === "trendy") initialScale = 0.9;

    const initialStyles: any = {
      opacity: 0,
      scale: initialScale,
      rotateX: preset === "apple" ? 10 : 0,
    };

    if (direction === "up") initialStyles.y = offset;
    if (direction === "down") initialStyles.y = -offset;
    if (direction === "left") initialStyles.x = offset;
    if (direction === "right") initialStyles.x = -offset;

    return {
      initial: initialStyles,
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          ...transition,
          delay,
        },
      },
    };
  };

  // 비틀기 효과 (Apple 스타일에 적합)
  const skewVariants: Variants = {
    initial: {
      opacity: 0,
      rotateX: preset === "apple" ? 15 : 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        ...transition,
        staggerChildren: 0.1,
      },
    },
  };

  return {
    enabled,
    transition,
    getFadeInVariants,
    skewVariants,
  };
}
