"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import AdminAboutForm from "@/components/features/admin/AdminAboutForm";
import AdminConfigForm from "@/components/features/admin/AdminConfigForm";
import AdminContactForm from "@/components/features/admin/AdminContactForm";
import AdminProjectForm from "@/components/features/admin/AdminProjectForm";
import { AdminSettingsForm } from "@/components/features/admin/AdminSettingsForm";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "projects" | "about" | "config" | "settings" | "contact"
  >("projects");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    setIsAuthChecked(true);
  }, []);

  const handleSaveComplete = () => {
    // Optional global save completion handler
  };

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
        {/* Simple loader or blank while checking auth */}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-black uppercase tracking-[0.3em]">
              SoDam AI Studio
              <br />
              <span className="text-white/40 text-xs tracking-[0.5em]">
                Admin Portal
              </span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="admin-access-key"
                className="text-[10px] font-bold uppercase tracking-widest text-white/40"
              >
                Access Key
              </label>
              <input
                id="admin-access-key"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-white transition-colors text-center tracking-widest"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.5em] py-5 hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
            >
              Enter System
            </button>
          </form>

          <div className="text-center pt-8">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
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
      className="min-h-screen bg-[#050505] text-white flex"
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
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-8 space-y-12 shrink-0 h-screen sticky top-0">
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">
            Admin
          </h2>
          <p className="text-[8px] uppercase tracking-widest text-white/30">
            SoDam AI Studio v1.0
          </p>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { id: "projects", label: "Projects" },
            { id: "settings", label: "Appearance" },
            { id: "about", label: "About Me" },
            { id: "contact", label: "Contact / Talk" },
            { id: "config", label: "Site Config" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "projects"
                    | "settings"
                    | "about"
                    | "contact"
                    | "config",
                )
              }
              className={`w-full text-left text-[10px] font-black uppercase tracking-[0.3em] py-4 px-6 transition-all duration-200 active:scale-[0.98] ${
                activeTab === tab.id
                  ? "bg-white text-black translate-x-2 shadow-[4px_4px_20px_rgba(255,255,255,0.1)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <Link
          href="/"
          onClick={() => sessionStorage.removeItem("admin_auth")}
          className="text-[8px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
        >
          Exit Admin
        </Link>
      </aside>

      {/* Main Content */}
      <section className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-12 space-y-12">
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl border border-white/5 p-8"
              >
                <AdminAboutForm />
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl border border-white/5 p-8"
              >
                <AdminProjectForm />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl border border-white/5 p-8"
              >
                <AdminSettingsForm onSave={handleSaveComplete} />
              </motion.div>
            )}

            {activeTab === "config" && (
              <motion.div
                key="config"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl border border-white/5 p-8"
              >
                <AdminConfigForm />
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-2xl border border-white/5 p-8"
              >
                <AdminContactForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
