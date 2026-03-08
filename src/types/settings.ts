/**
 * @file settings.ts
 * @description 포트폴리오 프로젝트의 전역 설정 타입 정의
 */

export interface AppearanceSettings {
  theme: "white" | "black";
  primaryColor: string;
  fontFamily: string;
}

export interface HeaderSettings {
  show: boolean;
  alignment: "left" | "center" | "right";
  fontSize: number;
  title?: string;
}

export interface WorkSettings {
  header: HeaderSettings;
  gridColumns: number;
}

export interface AboutSettings {
  header: HeaderSettings;
  description: string;
  showIntro: boolean;
}

export interface ContactChannel {
  id: string;
  name: string;
  url: string;
  visible: boolean;
  icon?: string;
}

export interface TalkSettings {
  header: HeaderSettings;
  channels: ContactChannel[];
}

export interface AdminSettings {
  fontSizeScale: number;
  showAdvanced: boolean;
}

export interface GlobalSettings {
  appearance: AppearanceSettings;
  work: WorkSettings;
  about: AboutSettings;
  talk: TalkSettings;
  admin: AdminSettings;
}

export type SettingsUpdatePayload = Partial<GlobalSettings>;
