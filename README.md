# BagdarAI

Career guidance AI platform for students in Kazakhstan.

## Features
- AI-powered career analysis
- Personalized roadmaps
- Multi-language support (Kazakh, Russian, English)
- Real-time chat with AI advisor

## Tech Stack
- Next.js 15
- Supabase (Database + Auth)
- OpenAI
- Tailwind CSS
- TypeScript
- Prisma (legacy ORM)

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Copy `.env.example` to `.env.local` and fill in Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Environment Variables
See `.env.example` for required environment variables.

## Deployment
This project is configured for Render deployment.

### Setup on Render:
1. Connect your GitHub repository to Render
2. Render will automatically detect the Next.js app
3. Add environment variables in Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `NODE_ENV=production`

### Environment Variables
See `.env.example` for required environment variables.
