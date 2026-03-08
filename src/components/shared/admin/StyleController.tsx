"use client";

import React, { useState } from "react";
import {
  Settings2,
  Type,
  Palette,
  Layers,
  WrapText,
  ChevronDown,
  Maximize,
  Move,
  Zap,
  Layout,
  Square,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementStyle, WhiteSpace } from "@/types/style";

interface StyleControllerProps {
  label: string;
  style?: ElementStyle;
  onChange: (newStyle: ElementStyle) => void;
  defaultOpen?: boolean;
}

export const StyleController: React.FC<StyleControllerProps> = ({
  label,
  style = {},
  onChange,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const updateStyle = (updates: Partial<ElementStyle>) => {
    onChange({ ...style, ...updates });
  };

  // 스타일 미리보기 뱃지 생성
  const hasCustomStyles =
    style.color ||
    style.textAlign ||
    (style.opacity !== undefined && style.opacity !== 1) ||
    style.whiteSpace ||
    style.fontSize ||
    style.fontWeight;

  let containerClass =
    "bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5";
  if (isOpen) {
    containerClass =
      "bg-white/6 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.03)]";
  } else if (hasCustomStyles) {
    containerClass =
      "bg-linear-to-r from-white/4 to-white/8 border-white/15 hover:border-white/25";
  }

  return (
    <div
      className={`border rounded-sm overflow-hidden transition-all duration-300 ${containerClass}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-sm transition-colors ${
              isOpen
                ? "bg-white/15 text-white"
                : "bg-white/5 text-white/40 group-hover:text-white/70"
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              isOpen ? "text-white" : "text-white/50 group-hover:text-white/80"
            }`}
          >
            ✦ {label} 스타일 제어
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 스타일 미리보기 뱃지 */}
          {!isOpen && hasCustomStyles && (
            <div className="flex items-center gap-1.5">
              {style.color && (
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: style.color }}
                  title={`Color: ${style.color}`}
                />
              )}
              {style.opacity !== undefined && style.opacity !== 1 && (
                <span className="text-[8px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded-sm">
                  {Math.round(style.opacity * 100)}%
                </span>
              )}
              {style.textAlign && (
                <span className="text-[8px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded-sm uppercase">
                  {style.textAlign}
                </span>
              )}
            </div>
          )}
          <div
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 ${isOpen ? "text-white/60" : "text-white/20 group-hover:text-white/40"}`}
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/10"
          >
            <div className="p-5 space-y-6">
              {/* 색상 & 투명도 */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label
                    htmlFor={`color-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5"
                  >
                    <Palette className="w-3 h-3" /> 색상 (Color)
                  </label>
                  <div className="flex items-center gap-3 cursor-pointer group/color p-2 bg-white/3 rounded-sm border border-white/5 hover:border-white/15 transition-colors">
                    <input
                      id={`color-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                      type="color"
                      value={style.color || "#ffffff"}
                      onChange={(e) => updateStyle({ color: e.target.value })}
                      className="w-8 h-8 bg-transparent border-none cursor-pointer outline-none rounded-sm"
                    />
                    <span className="text-[11px] font-mono text-white/60 group-hover/color:text-white transition-colors">
                      {style.color || "기본값"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label
                    htmlFor={`opacity-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5"
                  >
                    <Layers className="w-3 h-3" /> 투명도 (Opacity)
                  </label>
                  <div className="flex items-center gap-3 p-2 bg-white/3 rounded-sm border border-white/5">
                    <input
                      id={`opacity-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={style.opacity ?? 1}
                      onChange={(e) =>
                        updateStyle({
                          opacity: Number.parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-white/60 w-10 text-right">
                      {Math.round((style.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 정렬 & 줄바꿈 & 자간/행간 */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Layout className="w-3 h-3" /> 정렬 (Align)
                  </span>
                  <div className="flex p-0.5 bg-white/5 rounded-sm border border-white/5">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => updateStyle({ textAlign: align })}
                        className={`flex-1 py-2 flex justify-center transition-all rounded-xs ${
                          style.textAlign === align
                            ? "bg-white text-black shadow-md"
                            : "text-white/40 hover:bg-white/5 hover:text-white/60"
                        }`}
                        aria-label={`Align ${align}`}
                      >
                        {align === "left" && (
                          <div className="text-[9px] font-bold">왼쪽</div>
                        )}
                        {align === "center" && (
                          <div className="text-[9px] font-bold">가운데</div>
                        )}
                        {align === "right" && (
                          <div className="text-[9px] font-bold">오른쪽</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <WrapText className="w-3 h-3" /> 줄바꿈 (Line Break)
                  </span>
                  <div className="flex p-0.5 bg-white/5 rounded-sm border border-white/5">
                    {(["normal", "pre-wrap"] as const).map((ws) => (
                      <button
                        key={ws}
                        type="button"
                        onClick={() =>
                          updateStyle({ whiteSpace: ws as WhiteSpace })
                        }
                        className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-tight transition-all rounded-xs ${
                          style.whiteSpace === ws
                            ? "bg-white text-black shadow-md"
                            : "text-white/40 hover:bg-white/5 hover:text-white/60"
                        }`}
                      >
                        {ws === "normal" ? "자동" : "유지"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 자간 & 행간 추가 */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Type className="w-3 h-3" /> 자간 (Letter Spacing)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 0.1em, -1px"
                    value={style.letterSpacing || ""}
                    onChange={(e) =>
                      updateStyle({ letterSpacing: e.target.value })
                    }
                    className="w-full bg-white/3 border border-white/10 text-[11px] font-mono text-white px-3 py-2 rounded-sm outline-none focus:border-white/40"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Type className="w-3 h-3" /> 행간 (Line Height)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 1.5, 24px"
                    value={style.lineHeight || ""}
                    onChange={(e) =>
                      updateStyle({ lineHeight: e.target.value })
                    }
                    className="w-full bg-white/3 border border-white/10 text-[11px] font-mono text-white px-3 py-2 rounded-sm outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* 폰트 크기 & 굵기 */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label
                    htmlFor={`fontsize-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5"
                  >
                    <Type className="w-3 h-3" /> 글꼴 크기 (px)
                  </label>
                  <input
                    id={`fontsize-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    type="number"
                    placeholder="기본값"
                    value={style.fontSize || ""}
                    onChange={(e) =>
                      updateStyle({
                        fontSize: e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full bg-white/3 border border-white/10 text-[11px] font-mono text-white px-3 py-2 focus:border-white/40 outline-none transition-colors rounded-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <label
                    htmlFor={`fontweight-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5"
                  >
                    <Type className="w-3 h-3" /> 굵기 (Weight)
                  </label>
                  <select
                    id={`fontweight-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
                    value={style.fontWeight || ""}
                    onChange={(e) =>
                      updateStyle({ fontWeight: e.target.value || undefined })
                    }
                    className="w-full bg-white/3 border border-white/10 text-[11px] font-mono text-white px-3 py-2 focus:border-white/40 outline-none transition-colors appearance-none rounded-sm"
                  >
                    <option value="" className="bg-black">
                      기본값
                    </option>
                    <option value="100" className="bg-black">
                      가장 얇게 (100)
                    </option>
                    <option value="300" className="bg-black">
                      얇게 (300)
                    </option>
                    <option value="400" className="bg-black">
                      보통 (400)
                    </option>
                    <option value="700" className="bg-black">
                      굵게 (700)
                    </option>
                    <option value="900" className="bg-black">
                      가장 굵게 (900)
                    </option>
                  </select>
                </div>
              </div>

              {/* 간격 제어 (Margin & Padding) */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <ArrowUpDown className="w-3 h-3" /> 바깥 간격 (Margin)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="상단(T)"
                      value={style.marginTop || ""}
                      onChange={(e) =>
                        updateStyle({
                          marginTop: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                    <input
                      type="number"
                      placeholder="하단(B)"
                      value={style.marginBottom || ""}
                      onChange={(e) =>
                        updateStyle({
                          marginBottom: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Square className="w-3 h-3" /> 안쪽 여백 (Padding)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="상단(T)"
                      value={style.paddingTop || ""}
                      onChange={(e) =>
                        updateStyle({
                          paddingTop: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                    <input
                      type="number"
                      placeholder="하단(B)"
                      value={style.paddingBottom || ""}
                      onChange={(e) =>
                        updateStyle({
                          paddingBottom: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 크기 및 위치 (Size & Position) */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Maximize className="w-3 h-3" /> 크기 (Width/Height)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="가로(W)"
                      value={style.width || ""}
                      onChange={(e) => updateStyle({ width: e.target.value })}
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                    <input
                      type="text"
                      placeholder="세로(H)"
                      value={style.height || ""}
                      onChange={(e) => updateStyle({ height: e.target.value })}
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Move className="w-3 h-3" /> 위치 오프셋 (X/Y)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="X (Left)"
                      value={style.left || ""}
                      onChange={(e) =>
                        updateStyle({
                          left: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                    <input
                      type="number"
                      placeholder="Y (Top)"
                      value={style.top || ""}
                      onChange={(e) =>
                        updateStyle({
                          top: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-2 py-1.5 rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 곡률 & 그림자 & 모션 */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Square className="w-3 h-3" /> 모서리 곡률 (Radius)
                  </label>
                  <input
                    type="number"
                    placeholder="단위: px"
                    value={style.borderRadius || ""}
                    onChange={(e) =>
                      updateStyle({
                        borderRadius: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-3 py-2 rounded-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                    <Layers className="w-3 h-3" /> 그림자 (Box Shadow)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 0 4px 10px rgba(0,0,0,0.5)"
                    value={style.boxShadow || ""}
                    onChange={(e) => updateStyle({ boxShadow: e.target.value })}
                    className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-3 py-2 rounded-sm outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* 애니메이션 속도 제어 */}
              <div className="space-y-2.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> 애니메이션 모션 제어 (Transition)
                </label>
                <div className="grid grid-cols-2 gap-5">
                  <select
                    value={style.transition?.split(" ")[1] || ""}
                    onChange={(e) => {
                      const duration = e.target.value || "0.3s";
                      updateStyle({
                        transition: `all ${duration} cubic-bezier(0.16, 1, 0.3, 1)`,
                      });
                    }}
                    className="w-full bg-white/3 border border-white/10 text-[10px] font-mono text-white px-3 py-2 rounded-sm appearance-none cursor-pointer hover:border-white/20 transition-colors"
                  >
                    <option value="" className="bg-black">
                      속도 선택 (기본 0.3s)
                    </option>
                    <option value="0.1s" className="bg-black">
                      매우 빠름 (0.1s)
                    </option>
                    <option value="0.3s" className="bg-black">
                      부드럽게 (0.3s)
                    </option>
                    <option value="0.5s" className="bg-black">
                      고급스러움 (0.5s)
                    </option>
                    <option value="1s" className="bg-black">
                      천천히 (1.0s)
                    </option>
                    <option value="2s" className="bg-black">
                      매우 느리게 (2.0s)
                    </option>
                  </select>
                  <div className="flex items-center px-4 bg-white/5 rounded-sm border border-white/10 italic text-[9px] text-white/30">
                    * 모든 모션은 프리미엄 베지어 곡선(0.16, 1, 0.3, 1)이
                    적용됩니다
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
