import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    suggestions: [
      {
        id: "suggestion-1",
        title: "Lead cross-functional delivery",
        originalBullet: "• Coordinated cross-functional projects to deliver work on schedule.",
        suggestedBullet:
          "• Led cross-functional projects from planning through delivery, consistently meeting deadlines.",
      },
      {
        id: "suggestion-2",
        title: "Improve stakeholder reporting",
        originalBullet: "• Created weekly reports for project stakeholders.",
        suggestedBullet: "• Delivered clear weekly project reports to keep stakeholders aligned.",
      },
      {
        id: "suggestion-3",
        title: "Streamline request handling",
        originalBullet: "• Improved the team's process for handling incoming requests.",
        suggestedBullet: "• Streamlined incoming request handling to improve team efficiency.",
      },
    ],
  });
}
