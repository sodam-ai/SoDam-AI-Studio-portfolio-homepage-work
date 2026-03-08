"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isProjectHover, setIsProjectHover] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isActive, setIsActive] = useState(true);

  const requestRef = useRef<number>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (not mobile)
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) {
      setIsActive(false);
      return;
    }

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;

      // Interactive elements check
      const isInteractive = !!target.closest(
        'button, a, select, [role="button"], .interactive-cursor',
      );
      setIsHovering(isInteractive);

      // Project item check
      const projectTarget = target.closest(".project-card, .project-link");
      setIsProjectHover(!!projectTarget);
      if (projectTarget) {
        setCursorText(projectTarget.getAttribute("data-cursor-text") || "VIEW");
      }

      // Input check
      const inputTarget = target.closest(
        'input, textarea, [contenteditable="true"]',
      );
      setIsInputHover(!!inputTarget);
    };

    const animate = () => {
      setPosition({ x: mousePosition.current.x, y: mousePosition.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="custom-cursor-element fixed inset-0 z-[9999999] pointer-events-none"
          style={{ isolation: "isolate" }}
        >
          {/* 글로벌 커서 숨김 스타일 (classic 에서는 커서 보이기) */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            html:not([data-cursor-style="classic"]) * { cursor: none !important; }
            html:not([data-cursor-style="classic"]) input, 
            html:not([data-cursor-style="classic"]) textarea { cursor: text !important; }
          `,
            }}
          />

          {/* Main Dot */}
          <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
            animate={{
              x: position.x - 3,
              y: position.y - 3,
              scale: isClicking ? 0.7 : isHovering ? 1.5 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 1000,
              damping: 50,
              mass: 0.1,
            }}
          />

          {/* Outer Ring */}
          <motion.div
            className="fixed top-0 left-0 border border-white/40 rounded-full mix-blend-difference"
            animate={{
              x: position.x - (isProjectHover ? 40 : 15),
              y: position.y - (isProjectHover ? 40 : 15),
              width: isProjectHover ? 80 : 30,
              height: isProjectHover ? 80 : 30,
              backgroundColor: isProjectHover
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              opacity: isClicking ? 0 : isInputHover ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 30,
              mass: 0.5,
            }}
          />

          {/* Project View Text */}
          {isProjectHover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
              style={{
                x: position.x - 40,
                y: position.y - 40,
                width: 80,
                height: 80,
              }}
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-white">
                {cursorText}
              </span>
            </motion.div>
          )}

          {/* Magnetic Trailing Effect */}
          {!isInputHover && !isClicking && (
            <motion.div
              className="fixed top-0 left-0 w-60 h-60 bg-white/[0.03] rounded-full blur-3xl"
              animate={{
                x: position.x - 120,
                y: position.y - 120,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          )}

          {/* Interactive Aura */}
          {isHovering && !isProjectHover && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1 }}
              className="fixed top-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-xl"
              style={{
                x: position.x - 40,
                y: position.y - 40,
              }}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
