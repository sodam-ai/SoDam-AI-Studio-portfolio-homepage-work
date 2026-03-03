"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Terminal as TerminalIcon,
  X,
  ChevronRight,
  Command,
} from "lucide-react";

interface TerminalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inlineMode?: boolean;
}

interface CommandResponse {
  type: "text" | "image" | "video" | "code" | "system";
  content: string;
  metadata?: {
    url?: string;
    model?: string;
    prompt?: string;
    language?: string;
  };
}

export function AIInteractiveTerminal({
  isOpen = true,
  onClose = () => {},
  inlineMode = false,
}: Readonly<TerminalProps>) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    { cmd: string; output: CommandResponse[] }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history, isTyping]);

  const handleCommand = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const cmd = input.toLowerCase().trim();
    setInput("");
    setIsTyping(true);

    // Initial Processing State
    setHistory((prev) => [...prev, { cmd: input, output: [] }]);

    let response: CommandResponse[] = [];

    // Simulate Network/Processing Latency for Premium Feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (cmd === "help" || cmd === "syntax help") {
      response = [
        {
          type: "system",
          content: "ACCESSING_CREATIVE_SYNTAX_COMMAND_REGISTRY...",
        },
        {
          type: "text",
          content:
            "Available Commands:\n- ls [images|videos|projects]\n- gen [image|video|code] '--prompt'\n- whoami\n- clear\n- system --status",
        },
      ];
    } else if (cmd === "whoami") {
      response = [
        {
          type: "text",
          content:
            "I am the Creative Syntax Engine. An orchestration of multiple AI models, distilled through 15 years of design and engineering philosophy.",
        },
      ];
    } else if (cmd.startsWith("ls")) {
      const target = cmd.split(" ")[1];
      response = [
        {
          type: "system",
          content: `SCANNING_ARCHIVE_TARGET: ${target || "root"}...`,
        },
      ];
      if (target === "images") {
        response.push({
          type: "text",
          content:
            "ARCHIVE_SCAN: 3 AI Images found.\n- [IMG_01] Dreamscape\n- [IMG_02] Neon_Cyberpunk\n- [IMG_03] Abstract_Syntax",
        });
      } else if (target === "videos") {
        response.push({
          type: "text",
          content:
            "ARCHIVE_SCAN: 2 Motion Graphics found.\n- [VID_01] Intro_Sequence\n- [VID_02] Architecture_Flythrough",
        });
      } else {
        response.push({
          type: "text",
          content: "Usage: ls [images|videos|projects]",
        });
      }
    } else if (cmd.startsWith("gen image")) {
      response = [
        {
          type: "system",
          content: "INITIALIZING_STABLE_DIFFUSION_PIPELINE...",
        },
        {
          type: "image",
          content: "Imagination Manifested.",
          metadata: {
            url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
            model: "SDXL_Turbo_v1.0",
            prompt:
              cmd.split("'")[1] || "A digital masterpiece of abstract syntax",
          },
        },
      ];
    } else if (cmd === "clear") {
      setHistory([]);
      setIsTyping(false);
      return;
    } else if (cmd.startsWith("gen code")) {
      response = [
        { type: "system", content: "ORCHESTRATING_CLAUDE_3.5_SONNET..." },
        {
          type: "code",
          content: `const Portfolio = () => {\n  return (\n    <div className="premium-grid">\n      <h1 className="text-premium">Creative Syntax</h1>\n    </div>\n  );\n};`,
          metadata: { language: "typescript", model: "Claude 3.5 Sonnet" },
        },
      ];
    } else {
      response = [
        {
          type: "text",
          content: `Syntax Error: command '${cmd}' unknown. Type 'help' for guidance.`,
        },
      ];
    }

    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].output = response;
      return newHistory;
    });
    setIsTyping(false);
  };

  const renderOutput = (out: CommandResponse, i: number, j: number) => {
    switch (out.type) {
      case "system":
        return (
          <div
            key={`out-${i}-${j}`}
            className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-[10px] animate-pulse"
          >
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            {out.content}
          </div>
        );
      case "image":
        return (
          <motion.div
            key={`out-${i}-${j}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-2"
          >
            <div className="text-[10px] text-white/40 uppercase tracking-tighter flex justify-between">
              <span>[MODEL: {out.metadata?.model}]</span>
              <span>[STATUS: RENDERED]</span>
            </div>
            <div className="relative group overflow-hidden rounded-lg border border-white/10 shadow-2xl">
              <img
                src={out.metadata?.url}
                alt="AI Generated"
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-[10px] text-white/60 leading-tight line-clamp-2">
                  {out.metadata?.prompt}
                </p>
              </div>
            </div>
            <div className="text-white/60 italic text-[11px]">
              "{out.content}"
            </div>
          </motion.div>
        );
      case "code":
        return (
          <motion.div
            key={`out-${i}-${j}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 bg-black/40 border border-white/5 rounded p-4 font-mono text-[11px] overflow-hidden relative group"
          >
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <pre className="text-white/90">
              <code>{out.content}</code>
            </pre>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-white/30 uppercase tracking-widest">
              <span>{out.metadata?.language}</span>
              <span>ORCHESTRATED_BY_ANTIGRAVITY</span>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key={`out-${i}-${j}`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: j * 0.1 }}
            className="pl-5 text-white/80 whitespace-pre-wrap leading-relaxed border-l border-white/10"
          >
            {out.content}
          </motion.div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={inlineMode ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={
        inlineMode
          ? "relative w-full h-full bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col font-mono"
          : "fixed inset-x-4 bottom-4 md:inset-x-auto md:right-8 md:bottom-8 md:w-125 h-100 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col font-mono"
      }
    >
      {/* Header */}
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-white/60" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-medium">
            Creative_Syntax_Core_v1.0.4
          </span>
        </div>
        {!inlineMode && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-3 h-3 text-white/40" />
          </button>
        )}
      </div>

      {/* Output Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto text-xs space-y-6 scrollbar-thin scrollbar-thumb-white/10"
      >
        <div className="text-white/20 italic border-l-2 border-white/5 pl-3 py-1">
          System Initialized. Awaiting your Creative Syntax instructions...
        </div>

        {history.map((entry, i) => (
          <div key={`entry-${entry.cmd}-${i}`} className="space-y-3">
            <div className="flex items-center gap-2 text-white/40">
              <ChevronRight className="w-3 h-3" />
              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase">
                {entry.cmd}
              </span>
            </div>
            {entry.output.map((out, j) => renderOutput(out, i, j))}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleCommand}
        className="p-4 bg-white/2 border-t border-white/5 flex items-center gap-2"
      >
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[8px] text-white/40 font-bold uppercase tracking-widest">
          <Command className="w-2.5 h-2.5" />
          Prompt
        </div>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder:text-white/10 font-mono tracking-tight"
          placeholder="ls images | gen image 'prompt' | whoami"
        />
        <div className="text-[10px] text-white/20 select-none">⏎</div>
      </form>
    </motion.div>
  );
}
