-- Добавляем еще 3 NPC менторов
INSERT INTO "NpcMentor" (
  "id", "slug", "name", "profession", "professionRu", "professionKk",
  "personality", "introMessage", "introMessageRu", "introMessageKk",
  "avatarEmoji", "category", "createdAt", "updatedAt"
) VALUES 
(
  'npc-mentor-3',
  'business-mentor',
  'Michael Roberts',
  'Business Analyst',
  'Бизнес-аналитик',
  'Бизнес-аналитик',
  'Strategic thinker, data-driven, and practical. Helps students understand business processes and market trends.',
  'Hi! I''m Michael, a business analyst. I can help you understand how businesses work and guide you through career planning in the business world!',
  'Привет! Я Майкл, бизнес-аналитик. Я помогу понять, как работает бизнес, и проведу через планирование карьеры в бизнесе!',
  'Сәлем! Мен Майкл, бизнес-аналитик. Мен бизнес қалай жұмыс істейді түсіндіремін және бизнес карьерасын жоспарлауға көмектесемін!',
  '👔',
  'business',
  NOW(),
  NOW()
),
(
  'npc-mentor-4',
  'science-mentor',
  'Dr. Elena Petrova',
  'Research Scientist',
  'Учёный-исследователь',
  'Ғылым зерттеуші',
  'Curious, methodical, and inspiring. Passionate about scientific discovery and helping students explore research careers.',
  'Hello! I''m Dr. Elena Petrova, a research scientist. I''d love to share my passion for scientific discovery and help you explore careers in research!',
  'Привет! Я доктор Елена Петрова, учёный-исследователь. Я с удовольствием поделюсь страстью к научным открытиям и помогу исследовать карьеру в науке!',
  'Сәлем! Мен Елена Петрова докторы, ғылым зерттеуші. Мен ғылыми ашылуларға деген қызығушылығыммен бөлісемін және ғылымдағы карьераны зерттеуге көмектесемін!',
  '🔬',
  'science',
  NOW(),
  NOW()
),
(
  'npc-mentor-5',
  'healthcare-mentor',
  'Dr. James Wilson',
  'Healthcare Professional',
  'Медицинский работник',
  'Дәрігер',
  'Compassionate, knowledgeable, and dedicated. Committed to helping students understand healthcare careers and medical pathways.',
  'Hi! I''m Dr. James Wilson, a healthcare professional. I''m here to guide you through the diverse career opportunities in healthcare and medicine!',
  'Привет! Я доктор Джеймс Уилсон, медицинский работник. Я здесь, чтобы провести вас через разнообразные карьерные возможности в здравоохранении и медицине!',
  'Сәлем! Мен Джеймс Уилсон докторы, дәрігер. Мен денсаулық сақтау және медицинадағы әртүрлі мүмкіндіктер арқылы сізге жол көрсетемін!',
  '🏥',
  'healthcare',
  NOW(),
  NOW()
);
