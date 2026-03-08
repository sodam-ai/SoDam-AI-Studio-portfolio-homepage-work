import { Type } from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { AdminSliderControl } from "@/components/shared/admin/AdminControls";
import { FontSelector } from "../../../shared/admin/FontSelector";
import { BrandingSettings } from "@/types/branding";

interface TypographySettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const TypographySettings = ({
  settings,
  updateNestedSetting,
}: TypographySettingsProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="비주얼 스케일링"
        description="모든 기기 환경에서의 정밀한 타이포그래피 크기를 제어합니다."
        icon={<Type className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 gap-6">
          <AdminCard
            title="히어로 타이포그래피"
            description="랜딩 페이지 상단의 핵심 메시지 크기를 설정합니다."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminSliderControl
                label="메인 타이틀 (데스크탑)"
                description="PC 환경에서의 핵심 타이틀 크기입니다."
                value={settings.appearance.fontSizes.heroTitle}
                min={20}
                max={120}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting("appearance.fontSizes.heroTitle", val)
                }
              />
              <AdminSliderControl
                label="메인 타이틀 (모바일)"
                description="모바일 화면에 최적화된 타이틀 크기입니다."
                value={settings.appearance.mobileFontSizes.heroTitle}
                min={20}
                max={80}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting(
                    "appearance.mobileFontSizes.heroTitle",
                    val,
                  )
                }
              />
              <AdminSliderControl
                label="서브타이틀"
                description="타이틀 아래 보조 메시지의 크기입니다."
                value={settings.appearance.fontSizes.heroSubtitle}
                min={12}
                max={32}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting("appearance.fontSizes.heroSubtitle", val)
                }
              />
            </div>
          </AdminCard>

          <AdminCard
            title="콘텐츠 구조"
            description="문서의 위계와 가독성을 위한 텍스트 크기입니다."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminSliderControl
                label="섹션 제목"
                description="각 콘텐츠 블록의 머리말 크기입니다."
                value={settings.appearance.fontSizes.sectionTitle}
                min={16}
                max={48}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting("appearance.fontSizes.sectionTitle", val)
                }
              />
              <AdminSliderControl
                label="본문 텍스트"
                description="일반적인 읽기 텍스트의 표준 크기입니다."
                value={settings.appearance.fontSizes.bodyText}
                min={12}
                max={24}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting("appearance.fontSizes.bodyText", val)
                }
              />
              <AdminSliderControl
                label="카드 카테고리"
                description="작업물 카드의 분류 태그 크기입니다."
                value={settings.appearance.fontSizes.cardCategory}
                min={10}
                max={20}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting("appearance.fontSizes.cardCategory", val)
                }
              />
              <AdminSliderControl
                label="전역 행간 (Line Height)"
                description="텍스트 줄 사이의 간격을 조절합니다."
                value={
                  Number.parseFloat(
                    String(settings.appearance.layout.lineHeight),
                  ) || 1.5
                }
                min={1}
                max={2}
                step={0.1}
                unit="em"
                onChange={(val) =>
                  updateNestedSetting("appearance.layout.lineHeight", val)
                }
              />
              <AdminSliderControl
                label="전역 자간 (Letter Spacing)"
                description="글자 사이의 간격을 조절합니다."
                value={
                  Number.parseFloat(settings.appearance.layout.letterSpacing) ||
                  0
                }
                min={-5}
                max={10}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting(
                    "appearance.layout.letterSpacing",
                    `${val}px`,
                  )
                }
              />
            </div>
          </AdminCard>

          <AdminCard
            title="서체 아이덴티티"
            description="브랜드의 고유한 분위기를 결정하는 폰트 패밀리를 선택합니다."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FontSelector
                label="헤딩 폰트 (Headings)"
                value={settings.appearance.fonts?.headingFont || "Inter"}
                onChange={(val: string) =>
                  updateNestedSetting("appearance.fonts.headingFont", val)
                }
              />
              <FontSelector
                label="본문 폰트 (Body)"
                value={settings.appearance.fonts?.fontFamily || "Inter"}
                onChange={(val: string) =>
                  updateNestedSetting("appearance.fonts.fontFamily", val)
                }
              />
            </div>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
};
