"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Github as GithubIcon,
  ChevronRight,
  Binary,
} from "lucide-react";

import { Project } from "@/types/project";

interface ProjectSidebarProps {
  project: Project;
  nextProject: Project;
}

export function ProjectSidebar({ project, nextProject }: ProjectSidebarProps) {
  return (
    <div className="sticky top-40 space-y-8">
      <div className="p-8 rounded-4xl border border-white/5 bg-white/3 backdrop-blur-2xl space-y-10">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            CONNECT_&_DEPLOY
          </h4>
          <div className="space-y-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all group"
              >
                Launch_Live_App
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
              >
                Source_Repository
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">
              NEXT_PHASE
            </p>
            <Link
              href={`/work/${nextProject.id}`}
              className="text-xl font-black tracking-tighter hover:text-(--accent-primary) transition-colors"
            >
              {nextProject.title}
            </Link>
          </div>
          <Link
            href={`/work/${nextProject.id}`}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-(--accent-primary) transition-all group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Summary Visual Callout */}
      <div className="rounded-4xl overflow-hidden bg-linear-to-br from-(--accent-primary)/20 to-transparent p-1">
        <div className="rounded-[1.9rem] bg-black p-8 space-y-4">
          <Binary className="w-8 h-8 text-(--accent-primary) opacity-40" />
          <p className="text-sm text-zinc-500 font-light leading-relaxed italic">
            &quot;{project.title}은 단순한 결과물을 넘어 설계 과정에서의 철학을
            담고 있습니다. 상세 레이아웃을 통해 그 깊이를 확인하세요.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
