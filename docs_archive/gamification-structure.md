# Folder Structure for BagdarAI Gamified Platform

## Frontend Structure (Next.js)
```
app/
├── (dashboard)/
│   ├── gamification/
│   │   ├── skill-tree/
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── SkillNode.tsx
│   │   │   │   ├── SkillTree.tsx
│   │   │   │   └── ProgressLine.tsx
│   │   │   └── hooks/
│   │   │       └── useSkillTree.ts
│   │   ├── mini-games/
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   ├── GameInterface.tsx
│   │   │   │   └── TaskCard.tsx
│   │   │   └── games/
│   │   │       ├── SoftwareEngineer.tsx
│   │   │       ├── DataScientist.tsx
│   │   │       ├── UXDesigner.tsx
│   │   │       └── Entrepreneur.tsx
│   │   └── xp-progress/
│   │       ├── page.tsx
│   │       └── components/
│   │           ├── XPBar.tsx
│   │           └── LevelBadge.tsx
│   ├── mentor/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── MentorWidget.tsx
│   │       ├── ChatInterface.tsx
│   │       └── MessageBubble.tsx
│   └── layout.tsx
├── api/
│   ├── gamification/
│   │   ├── skill-tree/route.ts
│   │   ├── mini-games/route.ts
│   │   ├── xp/route.ts
│   │   └── progress/route.ts
│   ├── mentor/
│   │   └── chat/route.ts
│   └── auth/
├── components/
│   ├── ui/
│   ├── gamification/
│   │   ├── XPSystem.tsx
│   │   ├── SkillProgress.tsx
│   │   └── AchievementBadge.tsx
│   └── layout/
├── lib/
│   ├── gamification/
│   │   ├── skillTree.ts
│   │   ├── miniGames.ts
│   │   └── xpSystem.ts
│   └── mentor/
└── types/
    ├── gamification.ts
    ├── mentor.ts
    └── api.ts
```

## Backend Structure
```
lib/
├── gamification/
│   ├── skillTreeService.ts
│   ├── miniGameService.ts
│   ├── xpService.ts
│   └── mentorService.ts
├── ai/
│   ├── mentorPrompt.ts
│   └── openaiClient.ts
└── database/
    └── gamificationQueries.ts
```

## Database Structure
```
prisma/
├── schema.prisma (extended with gamification tables)
└── migrations/
```

## Data Files
```
data/
├── skill-trees/
│   ├── technology.json
│   ├── design.json
│   ├── business.json
│   ├── science.json
│   └── healthcare.json
├── mini-games/
│   ├── software-engineer.json
│   ├── data-scientist.json
│   ├── ux-designer.json
│   ├── entrepreneur.json
│   ├── psychologist.json
│   └── teacher.json
└── mentor/
    └── prompts.json
```
