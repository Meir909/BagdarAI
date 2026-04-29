export type MbtiDichotomy = "EI" | "SN" | "TF" | "JP";
export type MbtiPole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface MbtiQuestion {
  id: number;
  dichotomy: MbtiDichotomy;
  pole: MbtiPole;
  en: string;
  ru: string;
  kk: string;
}

export interface MbtiScores {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
}

export const mbtiQuestions: MbtiQuestion[] = [
  // EI — Energy (4 questions)
  { id: 1, dichotomy: "EI", pole: "E", en: "I feel energized after spending time with a large group of people.", ru: "Я чувствую прилив энергии после общения с большой группой людей.", kk: "Үлкен топпен уақыт өткізгеннен кейін энергиям артады." },
  { id: 2, dichotomy: "EI", pole: "E", en: "I enjoy being the center of attention in social situations.", ru: "Мне нравится быть в центре внимания в социальных ситуациях.", kk: "Әлеуметтік жағдайларда назардың орталығында болуды ұнатамын." },
  { id: 3, dichotomy: "EI", pole: "I", en: "I prefer spending quiet time alone to recharge after a busy day.", ru: "Я предпочитаю тихое одиночество, чтобы восстановить силы после насыщенного дня.", kk: "Қызулы күннен кейін жалғыз тыныш уақыт өткізіп қалпыма келуді жөн көремін." },
  { id: 4, dichotomy: "EI", pole: "I", en: "I find large social gatherings exhausting rather than exciting.", ru: "Большие социальные мероприятия меня утомляют, а не воодушевляют.", kk: "Үлкен жиындар мені қозғандырудан гөрі шаршатады." },

  // SN — Information (4 questions)
  { id: 5, dichotomy: "SN", pole: "S", en: "I focus on concrete facts and real-world details rather than abstract theories.", ru: "Я сосредоточен на конкретных фактах и реальных деталях, а не на абстрактных теориях.", kk: "Мен абстрактты теориялардан гөрі нақты фактілер мен шынайы егжей-тегжейлерге назар аударамын." },
  { id: 6, dichotomy: "SN", pole: "S", en: "I trust proven methods and experience over new untested ideas.", ru: "Я доверяю проверенным методам и опыту больше, чем новым непроверенным идеям.", kk: "Жаңа тексерілмеген идеялардан гөрі тексерілген әдістер мен тәжірибеге сенемін." },
  { id: 7, dichotomy: "SN", pole: "N", en: "I enjoy imagining future possibilities and exploring abstract concepts.", ru: "Мне нравится представлять будущие возможности и исследовать абстрактные концепции.", kk: "Болашақ мүмкіндіктерді елестету және абстрактты ұғымдарды зерттеу ұнайды." },
  { id: 8, dichotomy: "SN", pole: "N", en: "I am more interested in underlying patterns and theories than in practical details.", ru: "Меня больше интересуют скрытые закономерности и теории, чем практические детали.", kk: "Мені практикалық егжей-тегжейлерден гөрі жасырын заңдылықтар мен теориялар қызықтырады." },

  // TF — Decisions (4 questions)
  { id: 9, dichotomy: "TF", pole: "T", en: "When making decisions, I rely primarily on logic and objective analysis.", ru: "При принятии решений я опираюсь прежде всего на логику и объективный анализ.", kk: "Шешім қабылдағанда мен негізінен логика мен объективті талдауға сүйенемін." },
  { id: 10, dichotomy: "TF", pole: "T", en: "I prefer honest and direct feedback over diplomatic but vague responses.", ru: "Я предпочитаю честную и прямую обратную связь дипломатичным, но расплывчатым ответам.", kk: "Дипломатиялық бірақ түсініксіз жауаптардан гөрі шынайы және тікелей кері байланысты жөн көремін." },
  { id: 11, dichotomy: "TF", pole: "F", en: "I consider how my decisions will affect other people's feelings before deciding.", ru: "Я думаю о том, как мои решения повлияют на чувства других людей, прежде чем принять их.", kk: "Шешім қабылдамас бұрын менің шешімдерім басқа адамдардың сезімдеріне қалай әсер ететінін ойлаймын." },
  { id: 12, dichotomy: "TF", pole: "F", en: "Maintaining harmony in relationships is very important to me.", ru: "Поддержание гармонии в отношениях очень важно для меня.", kk: "Қарым-қатынастарда үйлесімділікті сақтау маған өте маңызды." },

  // JP — Lifestyle (4 questions)
  { id: 13, dichotomy: "JP", pole: "J", en: "I prefer to have a clear plan and follow a schedule rather than improvise.", ru: "Я предпочитаю иметь чёткий план и следовать расписанию, а не импровизировать.", kk: "Мен жоспарды орнатпастан ойдан шығарудан гөрі нақты жоспарды ұстануды жөн көремін." },
  { id: 14, dichotomy: "JP", pole: "J", en: "I feel uncomfortable when things are left unresolved or deadlines are missed.", ru: "Мне некомфортно, когда дела остаются незавершёнными или сроки нарушаются.", kk: "Істер аяқталмай қалса немесе мерзімдер бұзылса, маған ыңғайсыз." },
  { id: 15, dichotomy: "JP", pole: "P", en: "I like to keep my options open and adapt to new information as it comes.", ru: "Мне нравится сохранять гибкость и адаптироваться к новой информации по мере её поступления.", kk: "Мен икемділікті сақтап, жаңа ақпарат келген сайын бейімделуді ұнатамын." },
  { id: 16, dichotomy: "JP", pole: "P", en: "I enjoy starting new projects and exploring new ideas, even if old ones are unfinished.", ru: "Мне нравится начинать новые проекты и исследовать новые идеи, даже если старые незакончены.", kk: "Ескілері аяқталмаса да, жаңа жобаларды бастау және жаңа идеяларды зерттеу ұнайды." },
];

export function calculateMbtiScores(answers: Record<number, number>): MbtiScores {
  const scores: MbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  for (const q of mbtiQuestions) {
    const rating = answers[q.id] ?? 3;
    scores[q.pole] += rating;
  }
  return scores;
}

export function getMbtiType(scores: MbtiScores): string {
  return (
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P")
  );
}

export const DICHOTOMY_LABELS: Record<MbtiDichotomy, { en: string; ru: string; kk: string }> = {
  EI: { en: "Energy", ru: "Энергия", kk: "Энергия" },
  SN: { en: "Information", ru: "Информация", kk: "Ақпарат" },
  TF: { en: "Decisions", ru: "Решения", kk: "Шешімдер" },
  JP: { en: "Lifestyle", ru: "Образ жизни", kk: "Өмір салты" },
};

export const DICHOTOMY_COLORS: Record<MbtiDichotomy, string> = {
  EI: "bg-blue-500",
  SN: "bg-green-500",
  TF: "bg-orange-500",
  JP: "bg-purple-500",
};

export const DICHOTOMY_BG: Record<MbtiDichotomy, string> = {
  EI: "bg-blue-500/10 border-blue-500/30",
  SN: "bg-green-500/10 border-green-500/30",
  TF: "bg-orange-500/10 border-orange-500/30",
  JP: "bg-purple-500/10 border-purple-500/30",
};

export const MBTI_DESCRIPTIONS: Record<string, { nickname: string; en: string; ru: string; kk: string }> = {
  INTJ: { nickname: "The Architect", en: "Strategic and independent thinker. Natural leader who plans ahead and values competence.", ru: "Стратегический и независимый мыслитель. Прирождённый лидер, который планирует заранее.", kk: "Стратегиялық және тәуелсіз ойшыл. Алдын ала жоспарлайтын табиғи көшбасшы." },
  INTP: { nickname: "The Logician", en: "Innovative inventor with unquenchable thirst for knowledge and logical thinking.", ru: "Инновационный изобретатель с неутолимой жаждой знаний и логического мышления.", kk: "Білімге деген сусындамас шөлі бар инновациялық өнертапқыш." },
  ENTJ: { nickname: "The Commander", en: "Bold and imaginative leader who always finds a way — or makes one.", ru: "Смелый и творческий лидер, который всегда находит путь — или создаёт его.", kk: "Жол табатын немесе жасайтын батыл және шығармашыл көшбасшы." },
  ENTP: { nickname: "The Debater", en: "Smart and curious thinker who cannot resist an intellectual challenge.", ru: "Умный и любознательный мыслитель, который не может устоять перед интеллектуальным вызовом.", kk: "Зияткерлік қиындыққа тойтаруы қиын ақылды және қызығушылы ойшыл." },
  INFJ: { nickname: "The Advocate", en: "Quiet and mystical, yet very inspiring and tireless idealist.", ru: "Тихий и мистический, но очень вдохновляющий и неутомимый идеалист.", kk: "Тыныш және сырлы, бірақ өте шабыттандырушы және шаршамас идеалист." },
  INFP: { nickname: "The Mediator", en: "Poetic, kind and altruistic person, always eager to help a good cause.", ru: "Поэтичный, добрый и альтруистичный человек, всегда готовый помочь.", kk: "Поэтикалық, мейірімді және альтруистік адам, әрдайым көмектесуге дайын." },
  ENFJ: { nickname: "The Protagonist", en: "Charismatic and inspiring leader who mesmerizes their listeners.", ru: "Харизматичный и вдохновляющий лидер, который завораживает слушателей.", kk: "Тыңдаушыларды таңдандыратын харизматикалық және шабыттандырушы көшбасшы." },
  ENFP: { nickname: "The Campaigner", en: "Enthusiastic, creative and sociable free spirit who sees life as full of possibilities.", ru: "Энтузиаст, творческий и общительный свободный дух, видящий жизнь полной возможностей.", kk: "Өмірді мүмкіндіктерге толы деп санайтын энтузиаст, шығармашыл және қоғамдасқан." },
  ISTJ: { nickname: "The Logistician", en: "Practical and fact-minded individual whose reliability cannot be doubted.", ru: "Практичный и реалистичный человек, чья надёжность не вызывает сомнений.", kk: "Сенімділігіне күмән болмайтын практикалық және нақты ойлы тұлға." },
  ISFJ: { nickname: "The Defender", en: "Dedicated and warm protector, always ready to defend loved ones.", ru: "Преданный и тёплый защитник, всегда готовый защитить близких.", kk: "Жақындарын қорғауға әрдайым дайын берілген және жылы қорғаушы." },
  ESTJ: { nickname: "The Executive", en: "Excellent administrator, unsurpassed at managing things and people.", ru: "Превосходный администратор, непревзойдённый в управлении делами и людьми.", kk: "Істер мен адамдарды басқаруда теңдесі жоқ керемет әкімші." },
  ESFJ: { nickname: "The Consul", en: "Extraordinarily caring, social and popular person, always eager to help.", ru: "Необычайно заботливый, общительный и популярный человек.", kk: "Ерекше қамқор, қоғамдасқан және танымал адам." },
  ISTP: { nickname: "The Virtuoso", en: "Bold and practical experimenter, master of all kinds of tools.", ru: "Смелый и практичный экспериментатор, мастер всевозможных инструментов.", kk: "Батыл және практикалық эксперимент жасаушы, барлық құралдардың шебері." },
  ISFP: { nickname: "The Adventurer", en: "Flexible and charming artist who lives ready to explore new things.", ru: "Гибкий и очаровательный художник, живущий в готовности исследовать новое.", kk: "Жаңаны зерттеуге дайын икемді және сиқырлы суретші." },
  ESTP: { nickname: "The Entrepreneur", en: "Smart, energetic and perceptive who truly enjoys living on the edge.", ru: "Умный, энергичный и проницательный, кто действительно любит жизнь на острие.", kk: "Шекте өмір сүруді шынымен ұнататын ақылды, энергиялы және сезімтал." },
  ESFP: { nickname: "The Entertainer", en: "Spontaneous, energetic and enthusiastic entertainer who loves life.", ru: "Спонтанный, энергичный и энтузиастичный артист, любящий жизнь.", kk: "Өмірді жақсы көретін стихиялы, энергиялы және энтузиаст артист." },
};
