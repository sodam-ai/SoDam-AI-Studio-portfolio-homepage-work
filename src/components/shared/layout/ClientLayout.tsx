"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/shared/PageTransition";
import { Navbar } from "@/components/shared/layout/Navbar";
import { ChatWidget } from "@/components/features/chat/ChatWidget";

interface ClientLayoutProps {
  readonly children: React.ReactNode;
  readonly interClassName: string;
  readonly siteName: string;
}

export function ClientLayout({
  children,
  interClassName,
  siteName,
}: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar siteName={siteName} />}
      <PageTransition>{children}</PageTransition>
      {!isAdmin && <ChatWidget />}
    </>
  );
}
