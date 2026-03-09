import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "o4-mini";

export interface QuizAnswer {
  questionId: number;
  questionText: string;
  selectedOption: string;
  category: string;
}

export interface RiasecQuizAnswer {
  questionId: number;
  questionText: string;
  dimension: string;
  dimensionName: string;
  rating: number; // 1-5 Likert scale
}

export interface CareerAnalysisResult {
  personalitySummary: string;
  topCareers: Array<{
    name: string;
    nameRu: string;
    nameKk: string;
    match: number;
    description: string;
  }>;
  strengths: string[];
  skillsToDevelop: string[];
  roadmap: Array<{
    step: number;
    title: string;
    description: string;
    timeframe: string;
  }>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RoadmapResult {
  career: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    timeframe: string;
    resources: string[];
  }>;
}

export async function generateCareerAnalysis(
  answers: RiasecQuizAnswer[],
  riasecScores: { R: number; I: number; A: number; S: number; E: number; C: number },
  hollandCode: string,
  suggestedCareers: { en: string; ru: string; kk: string }[],
  language: "en" | "ru" | "kk" = "ru"
): Promise<CareerAnalysisResult> {
  const langInstruction = {
    en: "Respond in English.",
    ru: "Отвечай на русском языке.",
    kk: "Қазақ тілінде жауап бер.",
  }[language];

  const dimensionNames: Record<string, string> = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional",
  };

  const scoresText = Object.entries(riasecScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dim, score]) => `  ${dimensionNames[dim]} (${dim}): ${score}/35`)
    .join("\n");

  const suggestedText = suggestedCareers.map((c) => c.en).join(", ");

  const prompt = `You are BagdarAI, a career guidance AI for students aged 14-18 in Kazakhstan. ${langInstruction}

The student completed a RIASEC (Holland Code) personality assessment with 42 questions rated 1-5.

RIASEC SCORES:
${scoresText}

HOLLAND CODE: ${hollandCode}
(First letter = strongest personality type, second = second strongest, etc.)

RIASEC-SUGGESTED CAREERS based on top 2 dimensions: ${suggestedText}

RIASEC DIMENSION MEANINGS:
- R (Realistic): Practical, hands-on, likes working with tools/machines/nature
- I (Investigative): Analytical, intellectual, loves research and problem-solving
- A (Artistic): Creative, expressive, prefers freedom and self-expression
- S (Social): Helping, teaching, working with people, empathetic
- E (Enterprising): Leadership, persuasion, business, entrepreneurship
- C (Conventional): Organized, detail-oriented, data, structured work

Based on this RIASEC profile, provide personalized career guidance for a student in Kazakhstan.

Respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "personalitySummary": "2-3 sentences describing their personality based on the Holland Code ${hollandCode} and their scores. Mention their dominant types.",
  "topCareers": [
    {"name": "Career Name in English", "nameRu": "Career Name in Russian", "nameKk": "Career Name in Kazakh", "match": 95, "description": "Why this career suits their RIASEC profile"},
    {"name": "...", "nameRu": "...", "nameKk": "...", "match": 88, "description": "..."},
    {"name": "...", "nameRu": "...", "nameKk": "...", "match": 82, "description": "..."}
  ],
  "strengths": ["strength1 based on RIASEC profile", "strength2", "strength3", "strength4"],
  "skillsToDevelop": ["skill1 to complement their profile", "skill2", "skill3"],
  "roadmap": [
    {"step": 1, "title": "Step title", "description": "What to do", "timeframe": "Now - 6 months"},
    {"step": 2, "title": "...", "description": "...", "timeframe": "6-18 months"},
    {"step": 3, "title": "...", "description": "...", "timeframe": "1-2 years"},
    {"step": 4, "title": "...", "description": "...", "timeframe": "2-4 years"},
    {"step": 5, "title": "...", "description": "...", "timeframe": "4+ years"}
  ]
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content || "{}";

  try {
    // Strip markdown code blocks if present
    const cleaned = content.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned) as CareerAnalysisResult;
  } catch {
    // Return a fallback structure if parsing fails
    return {
      personalitySummary: "You are a curious and analytical person with diverse interests.",
      topCareers: [
        { name: "Software Engineer", nameRu: "Инженер-программист", nameKk: "Бағдарламалық жасақтама инженері", match: 85, description: "Strong analytical skills match this field." },
        { name: "Data Analyst", nameRu: "Дата-аналитик", nameKk: "Деректер аналитигі", match: 78, description: "Your attention to detail is valuable here." },
        { name: "Project Manager", nameRu: "Менеджер проектов", nameKk: "Жоба менеджері", match: 72, description: "Leadership qualities suit this role." },
      ],
      strengths: ["Critical thinking", "Creativity", "Communication", "Adaptability"],
      skillsToDevelop: ["Technical skills", "Time management", "Public speaking"],
      roadmap: [
        { step: 1, title: "Foundation", description: "Build core academic skills", timeframe: "Now - 1 year" },
        { step: 2, title: "Exploration", description: "Try different activities and courses", timeframe: "1-2 years" },
        { step: 3, title: "Specialization", description: "Choose your field and go deeper", timeframe: "2-4 years" },
        { step: 4, title: "Experience", description: "Internships and real projects", timeframe: "4-6 years" },
        { step: 5, title: "Career Launch", description: "First professional role", timeframe: "6+ years" },
      ],
    };
  }
}

export async function careerChat(
  history: ChatMessage[],
  userMessage: string,
  language: "en" | "ru" | "kk" = "ru"
): Promise<string> {
  const langInstruction = {
    en: "You are BagdarAI, an AI career advisor. Always respond in English.",
    ru: "Ты BagdarAI, ИИ-советник по карьере. Всегда отвечай на русском языке.",
    kk: "Сен BagdarAI, мансап бойынша ИИ-кеңесшісің. Әрқашан қазақ тілінде жауап бер.",
  }[language];

  const systemPrompt = `${langInstruction}

You help students aged 14-18 in Kazakhstan discover their career paths. You know about:
- Career options and professions
- Universities in Kazakhstan (KBTU, Nazarbayev University, SDU, IITU, Astana IT University) and internationally
- Education paths and requirements
- Skills needed for different careers
- Scholarships and grants in Kazakhstan

Be encouraging, specific, and practical. Keep responses concise (2-4 paragraphs max).`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "user", content: systemPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
  });

  return response.choices[0].message.content || "I apologize, I couldn't generate a response. Please try again.";
}

export async function generateCareerRoadmap(
  career: string,
  language: "en" | "ru" | "kk" = "ru"
): Promise<RoadmapResult> {
  const langInstruction = {
    en: "Respond in English.",
    ru: "Отвечай на русском языке.",
    kk: "Қазақ тілінде жауап бер.",
  }[language];

  const prompt = `You are BagdarAI. ${langInstruction}

Create a detailed 7-step career roadmap for becoming a "${career}" for a student currently in high school in Kazakhstan.

Respond with valid JSON (no markdown):
{
  "career": "${career}",
  "steps": [
    {"step": 1, "title": "Step title", "description": "Detailed description of what to do", "timeframe": "When to do this", "resources": ["resource1", "resource2"]},
    ... (7 steps total)
  ]
}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content || "{}";

  try {
    const cleaned = content.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned) as RoadmapResult;
  } catch {
    return {
      career,
      steps: [
        { step: 1, title: "Foundation", description: "Build strong academic base", timeframe: "High school", resources: ["Khan Academy", "Coursera"] },
        { step: 2, title: "Skills", description: "Develop core skills for this career", timeframe: "Grade 10-11", resources: ["Online courses", "Books"] },
        { step: 3, title: "University", description: "Apply to relevant universities", timeframe: "Grade 11-12", resources: ["University websites", "Advisors"] },
        { step: 4, title: "Degree", description: "Complete your bachelor's degree", timeframe: "Years 1-4", resources: ["Professors", "Library"] },
        { step: 5, title: "Internship", description: "Gain practical experience", timeframe: "Year 3-4", resources: ["LinkedIn", "Career fairs"] },
        { step: 6, title: "Entry Level", description: "Land your first job", timeframe: "Year 4-5", resources: ["Job boards", "Network"] },
        { step: 7, title: "Growth", description: "Advance in your career", timeframe: "Years 5+", resources: ["Mentors", "Professional associations"] },
      ],
    };
  }
}

export async function npcChat(
  npcSystemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "user", content: npcSystemPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
  });

  return response.choices[0].message.content || "I apologize, I couldn't respond right now. Please try again.";
}

export async function explainProfession(
  professionName: string,
  language: "en" | "ru" | "kk" = "ru"
): Promise<string> {
  const langInstruction = {
    en: "Respond in English.",
    ru: "Отвечай на русском языке.",
    kk: "Қазақ тілінде жауап бер.",
  }[language];

  const prompt = `${langInstruction} Explain the profession "${professionName}" to a high school student in Kazakhstan. Include: what they do day-to-day, required skills, salary range in Kazakhstan (in KZT), future prospects, and top universities to study this in Kazakhstan. Keep it concise and motivating (3-4 paragraphs).`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "Unable to generate explanation.";
}
