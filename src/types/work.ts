export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  featured?: boolean;
  aspectRatio?: string;
  images?: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}
