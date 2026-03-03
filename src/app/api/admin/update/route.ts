import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Premium Admin Portal API
 * 포트폴리오의 JSON 데이터를 업데이트하는 API 엔드포인트입니다.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // 업데이트할 파일 경로 설정
    const contentDir = path.join(process.cwd(), "src", "content");
    let filePath = "";

    switch (type) {
      case "projects":
        filePath = path.join(contentDir, "projects.json");
        break;
      case "about":
        filePath = path.join(contentDir, "about.json");
        break;
      case "site-config":
        filePath = path.join(contentDir, "site-config.json");
        break;
      case "contact":
        filePath = path.join(contentDir, "contact.json");
        break;
      case "settings":
        filePath = path.join(process.cwd(), "src/data/settings.json");
        break;
      default:
        return NextResponse.json(
          { success: false, error: "유효하지 않은 데이터 타입입니다." },
          { status: 400 },
        );
    }

    // 데이터 유효성 검사 및 기본값 할당
    if (!data) {
      return NextResponse.json(
        { success: false, error: "저장할 데이터가 없습니다." },
        { status: 400 },
      );
    }

    let finalData = data;

    // 만약 프로젝트 데이터라면 필수 필드가 누락되지 않았는지 확인 (런타임 에러 방지)
    if (type === "projects" && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      finalData = data.map((project: any) => ({
        ...project,
        fullDescription: project.fullDescription || "",
        approach: project.approach || "",
        challenges: project.challenges || [],
        tags: project.tags || [],
        images: project.images || [],
        techWalkthrough: project.techWalkthrough || null,
      }));
    }

    // 파일 쓰기 수행
    await fs.writeFile(filePath, JSON.stringify(finalData, null, 2), "utf-8");

    // 데이터 변경 후 관련 페이지 캐시 무효화 (실시간 반영을 위함)
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
    revalidatePath("/work", "page");
    revalidatePath("/work/[id]", "page");
    revalidatePath("/contact", "page");
    revalidatePath("/admin", "page");

    return NextResponse.json({
      success: true,
      message: `${type} 데이터가 성공적으로 저장되었습니다.`,
    });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "서버 오류가 발생했습니다: " +
          (error instanceof Error ? error.message : "알 수 없는 오류"),
      },
      { status: 500 },
    );
  }
}

/**
 * 현재 데이터를 불러오는 GET 메서드
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    const contentDir = path.join(process.cwd(), "src", "content");
    let filePath = "";

    if (type === "projects") filePath = path.join(contentDir, "projects.json");
    else if (type === "about") filePath = path.join(contentDir, "about.json");
    else if (type === "site-config")
      filePath = path.join(contentDir, "site-config.json");
    else if (type === "contact")
      filePath = path.join(contentDir, "contact.json");
    else if (type === "settings")
      filePath = path.join(process.cwd(), "src/data/settings.json");
    else {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 타입입니다." },
        { status: 400 },
      );
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json({ success: true, data: JSON.parse(fileContent) });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    );
  }
}
