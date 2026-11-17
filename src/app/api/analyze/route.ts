import { NextResponse } from "next/server";

type AnalyzeRequest = {
  resume?: unknown;
  jobDescription?: unknown;
};

export async function POST(request: Request) {
  let body: AnalyzeRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    body === null ||
    typeof body !== "object" ||
    typeof body.resume !== "string" ||
    body.resume.trim().length === 0 ||
    typeof body.jobDescription !== "string" ||
    body.jobDescription.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Resume input and job description are required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    clarification: {
      id: "clarification-1",
      question: "Which accomplishment from your resume would you most like to emphasize for this role?",
    },
  });
}
