import { NextResponse } from "next/server";
import path from "node:path";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: {
    page: number;
    total: number;
  };
}

const DEFAULT_META = { page: 1, total: 1 };

export function createApiResponse<T>(
  data: T | null = null,
  error: string | null = null,
  status: number = 200,
  meta = DEFAULT_META,
) {
  const response: ApiResponse<T> = {
    success: !error,
    data,
    error,
    meta,
  };
  return NextResponse.json(response, { status });
}

export function getFilePathForType(type: string): string | null {
  const contentDir = path.join(process.cwd(), "src", "content");

  switch (type) {
    case "projects":
      return path.join(contentDir, "projects.json");
    case "about":
      return path.join(contentDir, "about.json");
    case "site-config":
      return path.join(contentDir, "site-config.json");
    case "contact":
      return path.join(contentDir, "contact.json");
    case "settings":
      return path.join(process.cwd(), "src", "data", "settings.json");
    default:
      return null;
  }
}
