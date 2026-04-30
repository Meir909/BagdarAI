import { NextRequest, NextResponse } from "next/server";

const CORRECT_ANSWERS: Record<string, string[]> = {
  "riasec-basic": ["a", "a", "a", "a", "a", "a"],
  "soft-skills": ["a", "a", "a", "a", "a"],
  "it-basics": ["a", "a", "a", "a", "a"],
};

const XP_PER_CORRECT = 20;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const answers = CORRECT_ANSWERS[id];
    if (!answers) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const body = await request.json();
    const submitted: (string | null)[] = body.answers ?? [];

    let correct = 0;
    submitted.forEach((ans, i) => {
      if (ans && answers[i] && ans === answers[i]) correct++;
    });

    const total = answers.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xpEarned = correct * XP_PER_CORRECT;

    return NextResponse.json({ score, correct, total, xpEarned });
  } catch (error) {
    console.error("Test submit error:", error);
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 });
  }
}
