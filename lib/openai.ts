import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSimulationFeedback(
  scenario: string,
  userAnswer: string,
  correctAnswer: string,
  profession: string,
  language: "en" | "ru" | "kk" = "en"
): Promise<{
  feedback: string;
  explanation: string;
  isCorrect: boolean;
  tips?: string[];
}> {
  try {
    const prompt = `You are an expert career mentor for a ${profession}.

A student was presented with this scenario:
"${scenario}"

They chose: "${userAnswer}"
The correct approach was: "${correctAnswer}"

Provide constructive feedback on their choice:
1. Was it a good decision? (true/false)
2. Give 2-3 sentences of encouraging feedback
3. Explain why the correct answer is better
4. Give 1 practical tip for improvement

Respond in ${language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English"}.

Format your response as JSON:
{
  "isCorrect": boolean,
  "feedback": "Your encouraging feedback here",
  "explanation": "Why the correct answer is better",
  "tip": "One practical tip"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career guidance mentor. Always be encouraging and constructive.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(content);
      return {
        feedback: parsed.feedback || "Good thinking!",
        explanation: parsed.explanation || "",
        isCorrect: parsed.isCorrect || false,
        tips: parsed.tip ? [parsed.tip] : undefined,
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        feedback: content.substring(0, 200),
        explanation: "Great effort!",
        isCorrect: userAnswer === correctAnswer,
      };
    }
  } catch (error) {
    console.error("OpenAI error in generateSimulationFeedback:", error);
    return {
      feedback: "Keep practicing! Every attempt helps you learn.",
      explanation: "Learning takes practice and persistence.",
      isCorrect: false,
    };
  }
}

export async function generateCareerAnalysis(
  userProfile: {
    mbtiType?: string;
    interests?: string[];
    skills?: string[];
    testScores?: Record<string, number>;
  },
  profession: string,
  language: "en" | "ru" | "kk" = "en"
): Promise<{
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  advice: string;
  alternativeProfessions?: string[];
}> {
  try {
    const prompt = `You are a career advisor analyzing a student's profile.

Student Profile:
- MBTI Type: ${userProfile.mbtiType || "Unknown"}
- Interests: ${userProfile.interests?.join(", ") || "Not specified"}
- Skills: ${userProfile.skills?.join(", ") || "Not specified"}
- Test Scores: ${JSON.stringify(userProfile.testScores || {})}

Target Profession: ${profession}

Analyze the match between this student's profile and the profession:
1. What's the match percentage (0-100)?
2. What are their key strengths for this profession?
3. What should they improve?
4. Personalized advice for success
5. 2-3 alternative professions they might like

Respond in ${language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English"}.

Format as JSON:
{
  "matchPercentage": number,
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["area1", "area2", ...],
  "advice": "Personalized advice text",
  "alternatives": ["prof1", "prof2", "prof3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor. Provide accurate, encouraging career guidance.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(content);
      return {
        matchPercentage: Math.min(100, Math.max(0, parsed.matchPercentage || 75)),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Good fit"],
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : ["Keep learning"],
        advice:
          parsed.advice ||
          "You have potential in this field. Keep developing your skills!",
        alternativeProfessions: Array.isArray(parsed.alternatives)
          ? parsed.alternatives.slice(0, 3)
          : undefined,
      };
    } catch {
      return {
        matchPercentage: 75,
        strengths: ["Analytical thinking", "Problem-solving"],
        improvements: ["Technical skills", "Experience"],
        advice: "You have good potential in this field. Focus on continuous learning.",
      };
    }
  } catch (error) {
    console.error("OpenAI error in generateCareerAnalysis:", error);
    return {
      matchPercentage: 70,
      strengths: ["Adaptability", "Learning ability"],
      improvements: ["Experience", "Specialization"],
      advice: "You have potential. Focus on gaining relevant experience.",
    };
  }
}

export async function generateTestFeedback(
  testType: "mbti" | "aptitude" | "career",
  results: any,
  language: "en" | "ru" | "kk" = "en"
): Promise<{
  interpretation: string;
  strengths: string[];
  recommendations: string[];
  nextSteps: string[];
}> {
  try {
    const prompt = `You are an educational assessor providing feedback on ${testType} test results.

Test Results:
${JSON.stringify(results, null, 2)}

Provide encouraging, personalized feedback in ${language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English"}:
1. Interpret the results (what do they mean?)
2. Highlight 2-3 key strengths
3. Give 2-3 recommendations for growth
4. Suggest 2-3 concrete next steps

Format as JSON:
{
  "interpretation": "What these results mean",
  "strengths": ["strength1", "strength2", "strength3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "nextSteps": ["step1", "step2", "step3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a supportive educational counselor. Always provide constructive, encouraging feedback.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(content);
      return {
        interpretation:
          parsed.interpretation || "Great effort on the test!",
        strengths: Array.isArray(parsed.strengths)
          ? parsed.strengths
          : ["Thoughtfulness", "Self-reflection"],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : ["Continue learning", "Practice regularly"],
        nextSteps: Array.isArray(parsed.nextSteps)
          ? parsed.nextSteps
          : ["Explore related careers", "Take more assessments"],
      };
    } catch {
      return {
        interpretation: "You've completed the assessment! Review your results to learn more about yourself.",
        strengths: ["Completion", "Self-awareness"],
        recommendations: ["Explore your interests", "Seek mentorship"],
        nextSteps: ["View career paths", "Practice skills"],
      };
    }
  } catch (error) {
    console.error("OpenAI error in generateTestFeedback:", error);
    return {
      interpretation: "You've completed the assessment successfully.",
      strengths: ["Participation", "Growth mindset"],
      recommendations: ["Keep exploring", "Learn continuously"],
      nextSteps: ["Review results", "Explore careers"],
    };
  }
}
