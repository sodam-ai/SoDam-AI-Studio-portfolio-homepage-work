import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

const settingsPath = path.join(process.cwd(), "src/data/settings.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(settingsPath, "utf-8");
    return NextResponse.json({ success: true, data: JSON.parse(fileContent) });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({
      success: true,
      data: {
        appearance: {
          fonts: {
            fontFamily: "Inter",
            headingFont: "Inter",
            titleFont: "Inter",
            descriptionFont: "Inter",
          },
          fontSizes: {
            heroTitle: 80,
            sectionTitle: 40,
            bodyText: 16,
            cardCategory: 12,
          },
          layout: {
            sectionGap: 100,
            useFixedLayout: true,
          },
        },
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(settingsPath, JSON.stringify(body, null, 2));
    revalidatePath("/");
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("Settings POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
