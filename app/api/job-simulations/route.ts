import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const professionId = searchParams.get("professionId") || "";

    const where: any = {};

    if (category && category !== "All") {
      where.profession = {
        category: category,
      };
    }

    if (professionId) {
      where.professionId = professionId;
    }

    const simulations = await prisma.jobSimulation.findMany({
      where,
      include: {
        profession: {
          select: { name: true, category: true },
        },
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ simulations, total: simulations.length });
  } catch (error) {
    console.error("Job simulations error:", error);
    return NextResponse.json({ error: "Failed to get job simulations" }, { status: 500 });
  }
}
