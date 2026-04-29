import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Static fallback simulations shown when DB is empty
const STATIC_SIMULATIONS = [
  {
    id: "ux-designer-1",
    professionId: "ux-designer",
    title: "UX Designer: Crisis Day",
    titleRu: "UX-дизайнер: Кризисный день",
    titleKk: "UX-дизайнер: Дағдарыс күні",
    description: "Users are complaining about the confusing interface.",
    descriptionRu: "Пользователи жалуются на сложный интерфейс. Ты UX-дизайнер. Как ты это исправишь?",
    descriptionKk: "Пайдаланушылар күрделі интерфейс туралы шағымданады.",
    difficulty: "easy" as const,
    xpReward: 150,
    profession: { name: "UX Designer", category: "Creative" },
  },
  {
    id: "sim-1",
    professionId: "soft-engineer",
    title: "First Day as Software Engineer",
    titleRu: "Первый день инженера ПО",
    titleKk: "Бағдарламалық инженердің бірінші күні",
    description: "Start your first day at a tech company",
    descriptionRu: "Твой первый день в tech-компании.",
    descriptionKk: "Технологиялық компаниядағы бірінші күн.",
    difficulty: "easy" as const,
    xpReward: 100,
    profession: { name: "Software Engineer", category: "IT" },
  },
  {
    id: "sim-2",
    professionId: "data-scientist",
    title: "Data Analysis Challenge",
    titleRu: "Проблема анализа данных",
    titleKk: "Деректерді талдау сынағы",
    description: "You receive a large dataset and need to provide insights",
    descriptionRu: "Перед тобой датасет из 1 млн строк.",
    descriptionKk: "1 млн жолдан тұратын деректер жиынтығы бар.",
    difficulty: "medium" as const,
    xpReward: 150,
    profession: { name: "Data Scientist", category: "IT" },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const professionId = searchParams.get("professionId") || "";

    const where: any = {};

    if (category && category !== "All") {
      where.profession = { category };
    }

    if (professionId) {
      where.professionId = professionId;
    }

    let simulations: any[] = [];

    try {
      simulations = await prisma.jobSimulation.findMany({
        where,
        include: { profession: { select: { name: true, category: true } } },
        orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
      });
    } catch {
      // DB not available, use static
    }

    // If DB returned nothing, use static list (with category filter applied)
    if (simulations.length === 0) {
      simulations = STATIC_SIMULATIONS.filter((s) => {
        if (category && category !== "All") return s.profession.category === category;
        return true;
      });
    }

    return NextResponse.json({ simulations, total: simulations.length });
  } catch (error) {
    console.error("Job simulations error:", error);
    return NextResponse.json({ simulations: STATIC_SIMULATIONS, total: STATIC_SIMULATIONS.length });
  }
}
