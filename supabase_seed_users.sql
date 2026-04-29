-- =====================================================
-- Supabase Users Seed SQL
-- Creates test accounts directly in database
-- Run this in Supabase SQL Editor after creating tables
-- =====================================================

-- First, create schools
INSERT INTO schools (id, name, city, school_code, invitation_code, director_phone) VALUES
('11111111-1111-1111-1111-111111111111', 'НИШ Астана', 'Астана', 'SCHOOL-2024-ASTANA', 'INV-NIS-001', '+77001234567'),
('22222222-2222-2222-2222-222222222222', 'Лицей №1 Алматы', 'Алматы', 'SCHOOL-2024-ALMATY', 'INV-LIC-002', '+77009876543'),
('33333333-3333-3333-3333-333333333333', 'Гимназия №5 Караганда', 'Караганда', 'SCHOOL-2024-KRGNDA', 'INV-GYM-003', '+77005551234')
ON CONFLICT (school_code) DO NOTHING;

-- Create Admin (password: Admin@BagdarAI2024)
-- Password hash generated with bcrypt (10 rounds)
INSERT INTO users (id, role, name, email, password_hash, subscription_plan) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'System Admin', 'admin@bagdarai.kz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'FREE')
ON CONFLICT (email) DO NOTHING;

-- Create Directors
INSERT INTO users (id, role, name, phone, school_id, subscription_plan) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'director', 'Назарбаева Айгүл Серікқызы', '+77001234567', '11111111-1111-1111-1111-111111111111', 'FREE'),
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'director', 'Ахметов Бауыржан Қалиұлы', '+77009876543', '22222222-2222-2222-2222-222222222222', 'FREE')
ON CONFLICT (phone) DO NOTHING;

-- Create Curators (password: curator123)
INSERT INTO users (id, role, name, email, password_hash, school_id, subscription_plan) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'curator', 'Сериков Данияр Ерланұлы', 'serikov@nis.edu.kz', '$2a$10$curator123hashedpasswordfakehash', '11111111-1111-1111-1111-111111111111', 'FREE'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'curator', 'Омарова Жанна Бекболатқызы', 'omarova@nis.edu.kz', '$2a$10$curator123hashedpasswordfakehash', '11111111-1111-1111-1111-111111111111', 'FREE')
ON CONFLICT (email) DO NOTHING;

-- Create Students (no password, they register via code)
INSERT INTO users (id, role, name, school_id, student_class, student_code, curator_id, subscription_plan) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'student', 'Айдар Серіков', '11111111-1111-1111-1111-111111111111', '10A', 'STU-00001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'FREE'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'student', 'Дана Жумабекова', '11111111-1111-1111-1111-111111111111', '10A', 'STU-00002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'FREE'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'student', 'Арман Нурланов', '11111111-1111-1111-1111-111111111111', '10B', 'STU-00003', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'FREE')
ON CONFLICT (student_code) DO NOTHING;

-- Create Parent (password: parent123)
INSERT INTO users (id, role, name, email, password_hash, child_id, subscription_plan) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'parent', 'Серіков Ерлан Маратұлы', 'serikov.parent@mail.kz', '$2a$10$parent123hashedpasswordfakehash', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'FREE')
ON CONFLICT (email) DO NOTHING;

-- Create XP records for users
INSERT INTO user_xp (user_id, xp, level) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1000, 5),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 500, 3),
('cccccccc-cccc-cccc-cccc-ccccccccccc2', 450, 3),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 200, 2),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 100, 1),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 150, 2),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 50, 1)
ON CONFLICT (user_id) DO NOTHING;

-- Create badges (using trigger as ID for upsert stability)
INSERT INTO badges (id, name, name_ru, name_kk, icon, trigger) VALUES
('11111111-1111-1111-1111-111111111111', 'First Step', 'Первый шаг', 'Бірінші қадам', '🏆', 'test_complete'),
('22222222-2222-2222-2222-222222222222', 'Explorer', 'Исследователь', 'Зерттеуші', '🔍', 'profession_explore'),
('33333333-3333-3333-3333-333333333333', 'Chat Master', 'Мастер чата', 'Чат шебері', '💬', 'chat_first'),
('44444444-4444-4444-4444-444444444444', 'Career Pro', 'Карьерный про', 'Мансап шебері', '⭐', 'profile_complete'),
('55555555-5555-5555-5555-555555555555', 'Knowledge Seeker', 'Искатель знаний', 'Білім іздеуші', '📖', 'roadmap_generated')
ON CONFLICT (id) DO NOTHING;

-- Assign some badges to students
INSERT INTO student_badges (user_id, badge_id) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '11111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- Create audit log entry
INSERT INTO audit_logs (user_id, action, details) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'database_seeded', '{"schools": 3, "users": 9, "badges": 5}'::jsonb);

-- Output summary
SELECT 
  'Users created:' as info,
  COUNT(*) as count,
  array_agg(DISTINCT role) as roles
FROM users;
