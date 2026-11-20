import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "review complete",
    finalOutput:
      "• Led cross-functional projects from planning through delivery, consistently meeting deadlines.\n• Delivered clear weekly project reports to keep stakeholders aligned.\n• Streamlined incoming request handling to improve team efficiency.",
  });
}
