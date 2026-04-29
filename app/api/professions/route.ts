import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const skip = (page - 1) * limit;

    const where: { name?: { contains: string; mode: "insensitive" }; category?: string } = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (category && category !== "All") {
      where.category = category;
    }

    const [professions, total] = await Promise.all([
      prisma.profession.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ futureDemand: "desc" }, { name: "asc" }],
      }),
      prisma.profession.count({ where }),
    ]);

    return NextResponse.json({ professions, total, page, limit });
  } catch (error) {
    console.error("Professions error:", error);
    return NextResponse.json({ error: "Failed to get professions" }, { status: 500 });
  }
}
