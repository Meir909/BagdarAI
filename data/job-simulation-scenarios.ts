export interface JobSimulationScenario {
  id: string;
  professionId: string;
  profession: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  difficulty: "easy" | "medium" | "hard";
  missions: Mission[];
}

export interface Mission {
  id: number;
  title: string;
  scenario: string;
  context: {
    goal: string;
    timeline?: string;
    stakeholders?: string[];
    constraints?: string[];
  };
  options: MissionOption[];
}

export interface MissionOption {
  id: string;
  text: string;
  icon?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const jobSimulationScenarios: JobSimulationScenario[] = [
  {
    id: "sim-soft-eng-1",
    professionId: "soft-engineer",
    profession: "Software Engineer",
    title: "Launch Day Crisis",
    titleRu: "День запуска - Кризис",
    titleKk: "Ағымдау күні - Дағдарыс",
    description: "It's 2 hours before launch and your team discovers a critical bug in the payment system. How do you handle it?",
    descriptionRu: "За 2 часа до запуска команда обнаружила критическую ошибку в системе платежей. Как вы действуете?",
    descriptionKk: "Ағымдау уақытына 2 сағат қалғанда команда төлем жүйесінде сыналы қателік тапты. Қалай іс-әрекет аласыз?",
    difficulty: "hard",
    missions: [
      {
        id: 1,
        title: "Assess the Situation",
        scenario: `Your team has found a bug in the payment processing module that causes transactions to fail randomly.

        Status: 2 hours until live launch
        Impact: ~5000 users affected when live
        Root cause: Not yet identified
        Your role: Lead developer on the project

        The team is panicked. Investors are watching. Your manager wants an update NOW.

        What do you do first?`,
        context: {
          goal: "Handle the crisis effectively without causing more damage",
          timeline: "2 hours before launch",
          stakeholders: ["Team members", "Product manager", "Investors", "Users"],
          constraints: [
            "Limited time for debugging",
            "High visibility to stakeholders",
            "Pressure to hit launch deadline",
            "Payment system is critical",
          ],
        },
        options: [
          {
            id: "a",
            text: "🚨 Immediately roll back the entire release and delay launch by a week",
            icon: "🚨",
            difficulty: "easy",
          },
          {
            id: "b",
            text: "🔍 Take 15 mins to understand the bug, create a mitigation plan, then update stakeholders",
            icon: "🔍",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "⚡ Launch with a warning that payments might fail and handle fixes post-launch",
            icon: "⚡",
            difficulty: "hard",
          },
          {
            id: "d",
            text: "😰 Panic and blame the QA team for missing the bug",
            icon: "😰",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 2,
        title: "Execute the Fix",
        scenario: `You've identified the issue: a race condition in the payment processing queue.

        Options on the table:
        1. Implement a full fix: 90 mins, but no time to test thoroughly
        2. Deploy a quick workaround: 30 mins, reduces failure rate by 60%
        3. Disable high-value transactions temporarily: 15 mins, prevents major losses

        The team is split. Some want to launch on time. Others want to be safe.
        Your decision will determine whether you hit the deadline.`,
        context: {
          goal: "Minimize risk while hitting the launch window",
          timeline: "90 minutes until launch",
          stakeholders: ["Engineering team", "Product team", "Finance", "Customers"],
          constraints: [
            "Very limited testing time",
            "Can't test with real payment processors",
            "Risk of user data exposure",
          ],
        },
        options: [
          {
            id: "a",
            text: "🎯 Implement full fix with rapid code review and automated tests only",
            icon: "🎯",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "⚠️ Deploy workaround, monitor closely, have rollback plan ready",
            icon: "⚠️",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "🛡️ Disable high-value transactions, protect against worst case",
            icon: "🛡️",
            difficulty: "easy",
          },
          {
            id: "d",
            text: "🤷 'Just ship it' - hope the bug doesn't affect too many users",
            icon: "🤷",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 3,
        title: "Communication & Follow-up",
        scenario: `The fix is deployed. Payment success rate is 98% (up from 85%).

        But now you need to:
        1. Communicate what happened to stakeholders
        2. Explain the risk/reward decision you made
        3. Plan the post-launch investigation
        4. Keep the team morale high

        A journalist from TechNews just called the CEO asking about the "payment system failure."
        Social media is starting to pick it up.`,
        context: {
          goal: "Manage the narrative and maintain trust with users",
          timeline: "2 hours after launch",
          stakeholders: ["Public", "Media", "Leadership", "Users", "Team"],
          constraints: [
            "Negative headlines are forming",
            "Limited information to share publicly",
            "Must maintain user confidence",
          ],
        },
        options: [
          {
            id: "a",
            text: "📢 Publish a transparent post about what happened and how it's fixed",
            icon: "📢",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "🤐 Say nothing publicly - don't draw more attention",
            icon: "🤐",
            difficulty: "hard",
          },
          {
            id: "c",
            text: "📹 Hold a press conference with engineers explaining the technical issue",
            icon: "📹",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "💬 Blame external vendors or infrastructure for the issue",
            icon: "💬",
            difficulty: "hard",
          },
        ],
      },
    ],
  },
  {
    id: "sim-designer-1",
    professionId: "ux-designer",
    profession: "UX Designer",
    title: "Redesigning a Legacy Product",
    titleRu: "Переделка устаревшего продукта",
    titleKk: "Ескі өнімді қайта жобалау",
    description: "Your company wants to modernize its 10-year-old e-commerce platform. The old interface works but users hate it.",
    descriptionRu: "Компания хочет модернизировать свою 10-летнюю платформу электронной коммерции.",
    descriptionKk: "Компания 10 жасар электрондық сауда платформасын жаңартқысы келеді.",
    difficulty: "medium",
    missions: [
      {
        id: 1,
        title: "Research & Discovery",
        scenario: `You have $50k budget and 8 weeks to redesign.

        Current problems (from user interviews):
        - Checkout takes 8 steps (industry standard: 3-4)
        - Mobile version is unusable
        - Product search doesn't work well
        - Confusing information hierarchy

        Your team is asking: "What should we redesign first?"

        But you also have constraints:
        - Legacy backend can't change
        - Must support IE11 browsers
        - Finance team needs to avoid refunds
        - CEO wants "just make it look modern"`,
        context: {
          goal: "Create a prioritized redesign roadmap that increases conversion",
          timeline: "8 weeks",
          stakeholders: ["Users", "Engineering", "Finance", "Leadership"],
          constraints: [
            "Technical debt in backend",
            "Browser compatibility needs",
            "Budget limitations",
            "Stakeholder misalignment",
          ],
        },
        options: [
          {
            id: "a",
            text: "📊 Run comprehensive user research first, let data guide priorities",
            icon: "📊",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "🎨 Start with visual redesign to make it look modern quickly",
            icon: "🎨",
            difficulty: "easy",
          },
          {
            id: "c",
            text: "🔄 Focus on checkout flow - it's the biggest pain point",
            icon: "🔄",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "⚡ Redesign everything at once - need to be efficient with time",
            icon: "⚡",
            difficulty: "hard",
          },
        ],
      },
    ],
  },
];
