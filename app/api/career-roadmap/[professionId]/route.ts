import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCareerAnalysis } from "@/lib/openai";

const ROADMAP_TEMPLATES: Record<string, any> = {
  "prof-1": {
    // Software Engineer
    stages: [
      {
        stage: 1,
        title: "School",
        titleRu: "Школа",
        titleKk: "Мектеп",
        duration: "4 years",
        icon: "🎓",
        subjects: ["Mathematics", "Computer Science", "Physics"],
        skills: ["Logic", "Problem Solving", "Algorithms"],
        clubs: ["Robotics Club", "Coding Club"],
      },
      {
        stage: 2,
        title: "Exams",
        titleRu: "Экзамены",
        titleKk: "Сынақтар",
        duration: "1 year",
        icon: "📝",
        exams: ["ENT Math", "ENT Physics", "ENT Biology"],
        recommendedScores: { Math: "140+", Physics: "130+" },
      },
      {
        stage: 3,
        title: "University",
        titleRu: "Университет",
        titleKk: "Университет",
        duration: "4 years",
        icon: "🏫",
        specialties: ["Computer Science", "Software Engineering"],
        topUniversities: [
          { name: "AITU", country: "Kazakhstan", minScore: 120 },
          { name: "Satbayev", country: "Kazakhstan", minScore: 110 },
          { name: "NU", country: "Kazakhstan", minScore: 130 },
        ],
      },
      {
        stage: 4,
        title: "Technical Skills",
        titleRu: "Технические навыки",
        titleKk: "Техникалық дағдылар",
        duration: "2 years",
        icon: "💻",
        skills: ["Python", "Java", "JavaScript", "Git", "SQL", "System Design"],
      },
      {
        stage: 5,
        title: "Practical Experience",
        titleRu: "Практический опыт",
        titleKk: "Практикалық тәжірибе",
        duration: "1-2 years",
        icon: "🔧",
        activities: [
          "Internship at tech company",
          "Build portfolio projects",
          "Contribute to open source",
          "Participate in hackathons",
        ],
      },
      {
        stage: 6,
        title: "Career Growth",
        titleRu: "Карьерный рост",
        titleKk: "Мансап өсуі",
        duration: "Ongoing",
        icon: "📈",
        progression: ["Junior Developer", "Middle Developer", "Senior Developer", "Tech Lead", "Architect"],
      },
    ],
    timeline: 10,
    requiredSkills: ["Programming", "Problem Solving", "Algorithms", "System Design", "Communication"],
    salaryInfo: {
      Kazakhstan: "1,200 - 3,500 USD",
      Europe: "3,000 - 7,000 USD",
      USA: "80,000 - 150,000 USD",
    },
  },
  "prof-2": {
    // Data Scientist
    stages: [
      {
        stage: 1,
        title: "School",
        titleRu: "Школа",
        titleKk: "Мектеп",
        duration: "4 years",
        icon: "🎓",
        subjects: ["Mathematics", "Statistics", "Computer Science"],
        skills: ["Math", "Logic", "Data Analysis"],
        clubs: ["Math Club", "Computer Club"],
      },
      {
        stage: 2,
        title: "Exams",
        titleRu: "Экзамены",
        titleKk: "Сынақтар",
        duration: "1 year",
        icon: "📝",
        exams: ["ENT Math", "ENT Physics"],
        recommendedScores: { Math: "150+", Physics: "120+" },
      },
      {
        stage: 3,
        title: "University",
        titleRu: "Университет",
        titleKk: "Университет",
        duration: "4 years",
        icon: "🏫",
        specialties: ["Data Science", "Mathematics", "Statistics"],
        topUniversities: [
          { name: "NU", country: "Kazakhstan", minScore: 140 },
          { name: "KBTU", country: "Kazakhstan", minScore: 125 },
          { name: "Satbayev", country: "Kazakhstan", minScore: 115 },
        ],
      },
      {
        stage: 4,
        title: "Data Tools & Coding",
        titleRu: "Инструменты данных",
        titleKk: "Деректер құралдары",
        duration: "2 years",
        icon: "📊",
        skills: ["Python", "SQL", "R", "TensorFlow", "Pandas", "Machine Learning"],
      },
      {
        stage: 5,
        title: "Practical Projects",
        titleRu: "Практические проекты",
        titleKk: "Практикалық жобалар",
        duration: "1-2 years",
        icon: "🔬",
        activities: [
          "Data analysis projects",
          "Kaggle competitions",
          "Research papers",
          "Internship at analytics company",
        ],
      },
      {
        stage: 6,
        title: "Career Progression",
        titleRu: "Карьерный рост",
        titleKk: "Мансап өсуі",
        duration: "Ongoing",
        icon: "📈",
        progression: ["Junior Data Analyst", "Data Scientist", "Senior Data Scientist", "ML Engineer", "Research Lead"],
      },
    ],
    timeline: 10,
    requiredSkills: ["Statistics", "Python", "Machine Learning", "SQL", "Data Visualization"],
    salaryInfo: {
      Kazakhstan: "1,500 - 4,000 USD",
      Europe: "4,000 - 8,000 USD",
      USA: "100,000 - 180,000 USD",
    },
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ professionId: string }> }
) {
  try {
    const { professionId } = await params;

    // Get profession from DB
    const profession = await prisma.profession.findUnique({
      where: { id: professionId },
    });

    if (!profession) {
      return NextResponse.json({ error: "Profession not found" }, { status: 404 });
    }

    // Get base roadmap template or from DB
    const baseRoadmap = ROADMAP_TEMPLATES[professionId] || {
      stages: [
        { stage: 1, title: "School", duration: "4 years" },
        { stage: 2, title: "Exams", duration: "1 year" },
        { stage: 3, title: "University", duration: "4 years" },
        { stage: 4, title: "Skills", duration: "2 years" },
        { stage: 5, title: "Experience", duration: "1-2 years" },
        { stage: 6, title: "Career Growth", duration: "Ongoing" },
      ],
      timeline: 12,
      requiredSkills: profession.skills || [],
      salaryInfo: { Kazakhstan: profession.salary },
    };

    // Check if user is authenticated for personalization
    const session = await getSession();
    let personalization = null;

    if (session?.userId) {
      // Get user's test results if available
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          mbtiType: true,
          skillResults: true,
          riasecScores: true,
        },
      });

      if (user) {
        // Generate AI-powered personalized analysis
        const analysis = await generateCareerAnalysis(
          {
            mbtiType: user.mbtiType || undefined,
            interests: user.riasecScores
              ? Object.entries(user.riasecScores as any)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 3)
                  .map(([key]) => key)
              : undefined,
            skills: Array.isArray(user.skillResults)
              ? (user.skillResults as any[]).slice(0, 5)
              : undefined,
          },
          profession.name,
          "en"
        );

        personalization = {
          isPersonalized: true,
          userId: session.userId,
          matchPercentage: analysis.matchPercentage,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          advice: analysis.advice,
          alternativeProfessions: analysis.alternativeProfessions,
        };
      }
    }

    return NextResponse.json({
      professionId,
      professionName: profession.name,
      professionNameRu: profession.nameRu,
      professionNameKk: profession.nameKk,
      category: profession.category,
      futureDemand: profession.futureDemand,
      ...baseRoadmap,
      personalization,
    });
  } catch (error) {
    console.error("Career roadmap error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}
