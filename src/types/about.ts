export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface AboutData {
  introduction: string;
  story: string;
  experience: ExperienceItem[];
  skills: SkillGroup[];
}
