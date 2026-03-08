# BagdarAI

Career guidance AI platform for students in Kazakhstan.

## Features
- AI-powered career analysis
- Personalized roadmaps
- Multi-language support (Kazakh, Russian, English)
- Real-time chat with AI advisor

## Tech Stack
- Next.js 15
- Supabase
- OpenAI
- Tailwind CSS
- TypeScript

## Environment Variables
See `.env.example` for required environment variables.

## Deployment
This project is configured for Render deployment.

### Setup on Render:
1. Connect your GitHub repository to Render
2. Render will automatically detect the Next.js app
3. Add environment variables in Render dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `NODE_ENV=production`

### Environment Variables
See `.env.example` for required environment variables.
