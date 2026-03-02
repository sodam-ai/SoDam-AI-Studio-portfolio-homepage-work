import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const authPath = path.join(process.cwd(), "src/data/auth.json");

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword, mode } = await request.json();

    // Load current password
    const authData = JSON.parse(await fs.readFile(authPath, "utf-8"));

    // Login mode
    if (mode === "login") {
      if (currentPassword === authData.password) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
          { status: 401 },
        );
      }
    }

    // Change password mode
    if (currentPassword !== authData.password) {
      return NextResponse.json(
        { success: false, error: "Current password does not match" },
        { status: 400 },
      );
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "New password too short" },
        { status: 400 },
      );
    }

    // Save new password
    authData.password = newPassword;
    await fs.writeFile(authPath, JSON.stringify(authData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Security API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
