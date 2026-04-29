-- =====================================================
-- BagdarAI Supabase Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE role_enum AS ENUM ('admin', 'director', 'curator', 'student', 'parent');
CREATE TYPE subscription_plan_enum AS ENUM ('FREE', 'PRO', 'SCHOOL');

-- =====================================================
-- TABLES
-- =====================================================

-- Schools
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    school_code TEXT UNIQUE NOT NULL,
    invitation_code TEXT UNIQUE NOT NULL,
    director_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role role_enum NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    student_class TEXT,
    student_code TEXT UNIQUE,
    subscription_plan subscription_plan_enum DEFAULT 'FREE',
    ai_requests_used INTEGER DEFAULT 0,
    curator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    child_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Tests
CREATE TABLE career_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Results
CREATE TABLE career_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id UUID UNIQUE REFERENCES career_tests(id) ON DELETE CASCADE,
    personality_summary TEXT NOT NULL,
    top_careers JSONB NOT NULL,
    strengths JSONB NOT NULL,
    skills_to_develop JSONB NOT NULL,
    roadmap JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professions
CREATE TABLE professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_kk TEXT NOT NULL,
    salary TEXT NOT NULL,
    future_demand INTEGER NOT NULL,
    skills JSONB NOT NULL,
    universities JSONB DEFAULT '[]'::jsonb
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    icon TEXT NOT NULL,
    trigger TEXT NOT NULL
);

-- Student Badges
CREATE TABLE student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User XP (Gamification)
CREATE TABLE user_xp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Simulations
CREATE TABLE career_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_kk TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_kk TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_time INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 50,
    scenarios JSONB NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simulation Results
CREATE TABLE simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    simulation_id UUID NOT NULL REFERENCES career_simulations(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    choices JSONB NOT NULL,
    xp_earned INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, simulation_id)
);

-- Daily Quests
CREATE TABLE daily_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_kk TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_kk TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    icon TEXT DEFAULT '⚡'
);

-- User Quests
CREATE TABLE user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES daily_quests(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(user_id, quest_id, assigned_at)
);

-- NPC Mentors
CREATE TABLE npc_mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    profession_ru TEXT NOT NULL,
    profession_kk TEXT NOT NULL,
    personality TEXT NOT NULL,
    intro_message TEXT NOT NULL,
    intro_message_ru TEXT NOT NULL,
    intro_message_kk TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '🤖',
    category TEXT NOT NULL
);

-- NPC Messages
CREATE TABLE npc_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    npc_id UUID NOT NULL REFERENCES npc_mentors(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Roadmap
CREATE TABLE career_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_id UUID UNIQUE NOT NULL REFERENCES professions(id) ON DELETE CASCADE,
    stages JSONB NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    universities JSONB,
    salary_info JSONB,
    timeline INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Simulations
CREATE TABLE job_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_id UUID NOT NULL REFERENCES professions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_kk TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_kk TEXT NOT NULL,
    missions JSONB NOT NULL,
    difficulty TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Simulation Results
CREATE TABLE user_simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    simulation_id UUID NOT NULL REFERENCES job_simulations(id) ON DELETE CASCADE,
    mission_results JSONB NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    feedback TEXT,
    strengths TEXT[] DEFAULT '{}',
    improvements TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, simulation_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_career_tests_user_id ON career_tests(user_id);
CREATE INDEX idx_career_results_user_id ON career_results(user_id);
CREATE INDEX idx_career_results_is_active ON career_results(is_active);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_professions_category ON professions(category);
CREATE INDEX idx_student_badges_user_id ON student_badges(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_user_xp_xp ON user_xp(xp);
CREATE INDEX idx_career_simulations_career_id ON career_simulations(career_id);
CREATE INDEX idx_career_simulations_category ON career_simulations(category);
CREATE INDEX idx_simulation_results_user_id ON simulation_results(user_id);
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_user_quests_expires_at ON user_quests(expires_at);
CREATE INDEX idx_npc_messages_user_npc ON npc_messages(user_id, npc_id);
CREATE INDEX idx_career_roadmaps_profession_id ON career_roadmaps(profession_id);
CREATE INDEX idx_job_simulations_profession_id ON job_simulations(profession_id);
CREATE INDEX idx_user_simulation_results_user_id ON user_simulation_results(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_simulation_results ENABLE ROW LEVEL SECURITY;

-- Users: Admins see all, users see only themselves
CREATE POLICY users_admin_all ON users FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY users_self ON users FOR ALL TO authenticated USING (auth.uid() = id);

-- Career Tests: Users see only their own
CREATE POLICY career_tests_self ON career_tests FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Career Results: Users see only their own
CREATE POLICY career_results_self ON career_results FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Chat Messages: Users see only their own
CREATE POLICY chat_messages_self ON chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Student Badges: Users see only their own
CREATE POLICY student_badges_self ON student_badges FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User XP: Users see only their own
CREATE POLICY user_xp_self ON user_xp FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Simulation Results: Users see only their own
CREATE POLICY simulation_results_self ON simulation_results FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User Quests: Users see only their own
CREATE POLICY user_quests_self ON user_quests FOR ALL TO authenticated USING (auth.uid() = user_id);

-- NPC Messages: Users see only their own
CREATE POLICY npc_messages_self ON npc_messages FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User Simulation Results: Users see only their own
CREATE POLICY user_simulation_results_self ON user_simulation_results FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Professions, Badges, Schools, NPC Mentors, Career Simulations, Daily Quests, Job Simulations: Public read
CREATE POLICY professions_public_read ON professions FOR SELECT TO authenticated USING (true);
CREATE POLICY badges_public_read ON badges FOR SELECT TO authenticated USING (true);
CREATE POLICY schools_public_read ON schools FOR SELECT TO authenticated USING (true);
CREATE POLICY npc_mentors_public_read ON npc_mentors FOR SELECT TO authenticated USING (true);
CREATE POLICY career_simulations_public_read ON career_simulations FOR SELECT TO authenticated USING (true);
CREATE POLICY daily_quests_public_read ON daily_quests FOR SELECT TO authenticated USING (true);
CREATE POLICY job_simulations_public_read ON job_simulations FOR SELECT TO authenticated USING (true);
CREATE POLICY career_roadmaps_public_read ON career_roadmaps FOR SELECT TO authenticated USING (true);

-- Audit Logs: Only admins
CREATE POLICY audit_logs_admin ON audit_logs FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_xp_updated_at BEFORE UPDATE ON user_xp
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (Optional - run separately if needed)
-- =====================================================

-- Insert default badges
INSERT INTO badges (name, name_ru, name_kk, icon, trigger) VALUES
('First Step', 'Первый шаг', 'Бірінші қадам', '🏆', 'test_complete'),
('Explorer', 'Исследователь', 'Зерттеуші', '🔍', 'profession_explore'),
('Chat Master', 'Мастер чата', 'Чат шебері', '💬', 'chat_first'),
('Career Pro', 'Карьерный про', 'Мансап шебері', '⭐', 'profile_complete'),
('Knowledge Seeker', 'Искатель знаний', 'Білім іздеуші', '📖', 'roadmap_generated');
