import { NextResponse } from "next/server";

const TESTS = [
  {
    id: "riasec-basic",
    title: "Кем ты хочешь стать?",
    description: "Быстрый тест на профориентацию — узнай свой тип личности по RIASEC",
    questionsCount: 6,
    category: "Профориентация",
  },
  {
    id: "soft-skills",
    title: "Мягкие навыки",
    description: "Проверь свои коммуникационные и командные навыки",
    questionsCount: 5,
    category: "Навыки",
  },
  {
    id: "it-basics",
    title: "Основы IT",
    description: "Базовые знания о программировании, алгоритмах и технологиях",
    questionsCount: 5,
    category: "IT",
  },
];

export async function GET() {
  return NextResponse.json(TESTS);
}
