"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { AdminButton } from "../../../shared/admin/AdminButton";
import { AdminInputControl } from "@/components/shared/admin/AdminControls";

interface SecuritySettingsProps {
  securityData: {
    currentPassword: string;
    newPassword: string;
    verifyPassword: string;
  };
  setSecurityData: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      verifyPassword: string;
    }>
  >;
  handleSecurityUpdate: () => Promise<void>;
  isUpdatingSecurity: boolean;
}

export const SecuritySettings = ({
  securityData,
  setSecurityData,
  handleSecurityUpdate,
  isUpdatingSecurity,
}: SecuritySettingsProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="접근 권한 관리"
        description="관리자 페이지 접속을 통제하는 게이트키퍼 설정입니다."
        icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
      >
        <div className="max-w-2xl mx-auto">
          <AdminCard
            title="관리자 비밀번호 변경"
            description="시스템 보안을 위해 복잡도가 높은 암호를 사용하십시오."
          >
            <div className="space-y-4">
              <AdminInputControl
                label="현재 비밀번호"
                type="password"
                placeholder="현재 사용 중인 비밀번호"
                value={securityData.currentPassword}
                onChange={(val) =>
                  setSecurityData((prev) => ({
                    ...prev,
                    currentPassword: val,
                  }))
                }
              />
              <AdminInputControl
                label="신규 비밀번호"
                type="password"
                placeholder="최소 8자 이상의 강력한 비밀번호"
                value={securityData.newPassword}
                onChange={(val) =>
                  setSecurityData((prev) => ({
                    ...prev,
                    newPassword: val,
                  }))
                }
              />
              <AdminInputControl
                label="비밀번호 확인"
                type="password"
                placeholder="신규 비밀번호 재입력"
                value={securityData.verifyPassword}
                onChange={(val) =>
                  setSecurityData((prev) => ({
                    ...prev,
                    verifyPassword: val,
                  }))
                }
              />
              <div className="pt-6">
                <AdminButton
                  variant="primary"
                  className="w-full py-6 text-[10px] tracking-[0.3em] font-black bg-red-500/10 border-red-500/20 hover:bg-red-500 hover:text-black transition-all duration-500"
                  onClick={handleSecurityUpdate}
                  isLoading={isUpdatingSecurity}
                >
                  보안 설정 업데이트
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
};
