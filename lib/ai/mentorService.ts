import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MentorContext {
  message: string;
  context?: string;
  userProgress: any;
  conversationHistory: any[];
}

interface MentorResponse {
  content: string;
  xpReward: number;
  suggestions?: string[];
}

export async function generateMentorResponse({
  message,
  context,
  userProgress,
  conversationHistory,
}: MentorContext): Promise<MentorResponse> {
  try {
    // Load mentor prompts
    const prompts = await import('@/data/mentor/prompts.json');
    const mentorProfile = prompts.default.mentor_profile;
    const systemPrompt = prompts.default.prompt_templates.system_prompt;

    // Build context-aware prompt
    const contextPrompt = prompts.default.prompt_templates.context_aware
      .replace('{context}', context || 'general conversation')
      .replace('{student_profile}', JSON.stringify(userProgress || {}))
      .replace('{recent_activity}', JSON.stringify(conversationHistory.slice(-5) || []))
      .replace('{progress_summary}', `Level ${userProgress?.currentLevel || 1}, ${userProgress?.totalXP || 0} XP`);

    // Build conversation history
    const conversationHistoryStr = conversationHistory
      .slice(-10)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\n${contextPrompt}\n\nRecent conversation:\n${conversationHistoryStr}\n\nCurrent message: ${message}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "I'm here to help! Could you tell me more about what you'd like to know?";
    
    // Award XP for meaningful interactions
    const xpReward = message.length > 10 ? 5 : 0;

    return {
      content,
      xpReward,
      suggestions: generateSuggestions(content, userProgress),
    };
  } catch (error) {
    console.error('Mentor service error:', error);
    return {
      content: "I'm having trouble connecting right now, but I'm still here to help! Try asking me about careers, skills, or what you're interested in learning about.",
      xpReward: 0,
      suggestions: [],
    };
  }
}

function generateSuggestions(content: string, userProgress: any): string[] {
  const suggestions: string[] = [];
  
  // Basic suggestions based on content
  if (content.toLowerCase().includes('career') || content.toLowerCase().includes('job')) {
    suggestions.push('Try a mini-game to explore different careers');
    suggestions.push('Check out the skill tree for related skills');
  }
  
  if (content.toLowerCase().includes('skill') || content.toLowerCase().includes('learn')) {
    suggestions.push('Unlock new skills in the skill tree');
    suggestions.push('Practice with mini-games');
  }
  
  if (content.toLowerCase().includes('help') || content.toLowerCase().includes('stuck')) {
    suggestions.push('Try the software engineer mini-game');
    suggestions.push('Chat with me about your interests');
  }
  
  return suggestions.slice(0, 2); // Return max 2 suggestions
}
