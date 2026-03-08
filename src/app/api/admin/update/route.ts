import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { createApiResponse, getFilePathForType } from "@/lib/api";

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

    const filePath = getFilePathForType(type);
    if (!filePath) {
      return createApiResponse(null, "유효하지 않은 데이터 타입입니다.", 400);
    }

    // 데이터 유효성 검사 및 기본값 할당
    if (!data) {
      return createApiResponse(null, "저장할 데이터가 없습니다.", 400);
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

    // 클라이언트가 기존 포맷의 success: true 와 message/error를 기대하는지 확인하기 위해
    // createApiResponse가 일관된 형식을 반환하도록 합니다.
    return NextResponse.json({
      success: true,
      message: `${type} 데이터가 성공적으로 저장되었습니다.`,
      data: finalData,
      error: null,
      meta: { page: 1, total: 1 },
    });
  } catch (error) {
    console.error("Admin API Error:", error);
    return createApiResponse(
      null,
      "서버 오류가 발생했습니다: " +
        (error instanceof Error ? error.message : "알 수 없는 오류"),
      500,
    );
  }
}

/**
 * 현재 데이터를 불러오는 GET 메서드
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return createApiResponse(null, "타입 파라미터가 필요합니다.", 400);
  }

  try {
    const filePath = getFilePathForType(type);
    if (!filePath) {
      return createApiResponse(null, "유효하지 않은 데이터 타입입니다.", 400);
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data,
      error: null,
      meta: { page: 1, total: 1 },
    });
  } catch (error) {
    return createApiResponse(
      null,
      error instanceof Error ? error.message : "알 수 없는 오류",
      500,
    );
  }
}
