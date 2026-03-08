import { ElementStyle } from "./style";

export interface TechWalkthrough {
  title: string;
  titleStyle?: ElementStyle;
  description: string;
  descriptionStyle?: ElementStyle;
  steps: string[];
}

export interface Project {
  id: string;
  title: string;
  titleStyle?: ElementStyle;
  category: string;
  thumbnail: string;
  description: string;
  descriptionStyle?: ElementStyle;
  tags: string[];
  featured?: boolean;
  fullDescription?: string;
  fullDescriptionStyle?: ElementStyle;
  approach?: string;
  approachStyle?: ElementStyle;
  challenges?: string[];
  images?: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  resultFileUrl?: string;
  prompt?: string;
  techWalkthrough?: TechWalkthrough;
  aspectRatio?: string;
}
