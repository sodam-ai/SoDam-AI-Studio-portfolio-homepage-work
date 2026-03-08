"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import AdminAboutForm from "@/components/features/admin/AdminAboutForm";
import { AdminConfigForm } from "@/components/features/admin/AdminConfigForm";
import AdminContactForm from "@/components/features/admin/AdminContactForm";
import AdminProjectForm from "@/components/features/admin/AdminProjectForm";
import { AdminSettingsForm } from "@/components/features/admin/AdminSettingsForm";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "work"
    | "about"
    | "talk"
    | "settings"
    | "branding"
    | "security"
    | "taxonomy"
  >("home");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    setIsAuthChecked(true);
  }, []);

  const handleSaveComplete = () => {
    // Optional global save completion handler
  };

  const menuGroups = [
    {
      title: "🖥️ 통합 페이지 제어 센터",
      items: [
        {
          id: "home",
          label: "👑 페이지 마스터 (Page Master)",
          desc: "모든 페이지 레이아웃 & 시각적 서사 통합 관리",
        },
      ],
    },
    {
      title: "📦 콘텐츠 & 아카이브 관리",
      items: [
        {
          id: "work",
          label: "🎨 프로젝트 데이터베이스",
          desc: "개별 프로젝트 업로드 및 상세 내용 편집",
        },
        {
          id: "about",
          label: "👤 퍼스널 스토리 데이터",
          desc: "자기소개 장문 텍스트 및 개별 연혁 관리",
        },
      ],
    },
    {
      title: "✨ 브랜드 비주얼 마스터",
      items: [
        {
          id: "branding",
          label: "🌈 디자인 시스템 (Global)",
          desc: "전역 컬러, 타이포그래피, 애니메이션 제어",
        },
        {
          id: "talk",
          label: "🔗 소셜 & 네트워크 채널",
          desc: "외부 SNS 링크 및 API 수신처 관리",
        },
      ],
    },
    {
      title: "⚙️ 시스템 최적화 & 보안",
      items: [
        {
          id: "settings",
          label: "🌍 SEO & 환경 설정",
          desc: "검색 엔진 최적화 및 핵심 메타 데이터",
        },
        {
          id: "security",
          label: "🔐 시스템 보안 수칙",
          desc: "관리자 암호 변경 및 접근 권한 강화",
        },
      ],
    },
  ];

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: password, mode: "login" }),
      });
      const result = await res.json();
      if (result.success) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        alert(result.error || "비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  if (!isAuthChecked) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        className="min-h-screen bg-black text-white flex items-center justify-center px-6"
        style={
          {
            fontFamily: "var(--font-outfit), sans-serif",
            lineHeight: "1.5",
            letterSpacing: "normal",
            textAlign: "left",
            fontSize: "16px",
          } as React.CSSProperties
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black uppercase tracking-[0.4em]">
              SoDam STUDIO
              <br />
              <span className="text-white/30 text-[9px] tracking-[0.8em] mt-2 block">
                ADMINISTRATION PORTAL
              </span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="admin-access-key"
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block text-center"
              >
                Enter System Access Key
              </label>
              <input
                id="admin-access-key"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-black/60 border border-white/10 px-4 py-5 focus:outline-none focus:border-white/40 focus:bg-black/80 transition-all text-center tracking-[1em] text-xl rounded-sm text-white placeholder:text-white/10"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.5em] py-6 hover:bg-zinc-200 active:scale-[0.98] transition-all duration-500 shadow-2xl"
            >
              Access Granted
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors duration-500 underline underline-offset-4"
            >
              Back to Public Site
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#020202] text-white flex overflow-hidden"
      style={
        {
          fontFamily: "var(--font-outfit), sans-serif",
          lineHeight: "1.5",
          letterSpacing: "normal",
          textAlign: "left",
          fontSize: "16px",
        } as React.CSSProperties
      }
    >
      {/* Sidebar - Fixed to the left */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 h-screen sticky top-0 bg-[#020202] z-50">
        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">
              SoDam STUDIO
            </h2>
          </div>
          <p className="text-[8px] uppercase tracking-[0.4em] text-white/30">
            CONTROL CENTER V2.0
          </p>
        </div>

        <nav className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 px-4">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full text-left px-5 py-4 transition-all duration-500 group relative rounded-sm ${
                      activeTab === tab.id
                        ? "bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.05)]"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="space-y-1 relative z-10">
                      <span className="block text-[10px] font-black uppercase tracking-tighter">
                        {tab.label}
                      </span>
                      <span
                        className={`block text-[7.5px] uppercase tracking-widest font-medium ${
                          activeTab === tab.id
                            ? "text-black/50"
                            : "text-white/10"
                        }`}
                      >
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <Link
          href="/"
          onClick={() => sessionStorage.removeItem("admin_auth")}
          className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-all duration-500 mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2"
        >
          관리 시스템 종료 🔒
        </Link>
      </aside>

      {/* Main Content - Takes remaining width and manages its own scroll */}
      <section className="flex-1 max-w-[calc(100vw-18rem)] h-screen overflow-y-auto overflow-x-hidden bg-[#050505]/50">
        <div className="w-full mix-blend-normal p-8 md:p-12 lg:p-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Dynamic Header based on activeTab */}
              <div className="mb-16 space-y-3 pb-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-white" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter">
                    {menuGroups
                      .flatMap((g) => g.items)
                      .find((i) => i.id === activeTab)
                      ?.label.split(" ")
                      .slice(1)
                      .join(" ") || "관리 센터"}
                  </h2>
                </div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 ml-4">
                  {menuGroups
                    .flatMap((g) => g.items)
                    .find((i) => i.id === activeTab)?.desc || "시스템 제어 중"}
                </p>
              </div>

              {activeTab === "home" && (
                <AdminSettingsForm mode="home" onSave={handleSaveComplete} />
              )}

              {activeTab === "work" && <AdminProjectForm />}

              {activeTab === "about" && <AdminAboutForm />}

              {activeTab === "talk" && (
                <div className="space-y-20">
                  <AdminContactForm />
                  <div className="pt-20 border-t border-white/5">
                    <AdminConfigForm section="connectors" showTabs={false} />
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <AdminConfigForm showTabs={true} section="global" />
              )}

              {activeTab === "branding" && (
                <AdminSettingsForm mode="global" showTabs={true} />
              )}

              {activeTab === "taxonomy" && (
                <AdminConfigForm section="taxonomy" showTabs={false} />
              )}

              {activeTab === "security" && (
                <AdminSettingsForm
                  mode="global"
                  activeTab="security"
                  showTabs={false}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
