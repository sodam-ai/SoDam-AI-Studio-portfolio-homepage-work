import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "파일이 없습니다." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 MIME 타입 및 확장자 확인
    const contentType = file.type;
    const fileName = file.name.toLowerCase();
    let subDir = "assets";
    if (
      contentType.startsWith("video/") ||
      fileName.endsWith(".mp4") ||
      fileName.endsWith(".webm")
    ) {
      subDir = "videos";
    } else if (
      contentType.startsWith("image/") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".webp") ||
      fileName.endsWith(".gif")
    ) {
      subDir = "images";
    }

    // 저장 경로 설정: public/[subDir]/projects/ (서버 내부 경로)
    const uploadDir = join(process.cwd(), "public", subDir, "projects");

    // 디렉토리가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EEXIST") {
        console.error("Directory creation error:", err);
      }
    }

    // 파일 이름 생성 (타임스탬프 + 원본 이름)
    const filename = `${Date.now()}-${file.name.replaceAll(/\s+/g, "-")}`;
    const path = join(uploadDir, filename);

    // 파일 쓰기
    await writeFile(path, buffer);

    // 클라이언트에서 접근 가능한 URL 반환
    const url = `/${subDir}/projects/${filename}`;

    return NextResponse.json({
      success: true,
      data: { url, type: subDir },
      message: `${subDir === "videos" ? "동영상이" : "파일이"} 성공적으로 업로드되었습니다.`,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
