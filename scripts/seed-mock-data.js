/**
 * BagdarAI Mock Data Seed Script
 * ================================
 * Creates test accounts in Supabase Auth + Prisma DB
 *
 * Run:
 *   node scripts/seed-mock-data.js
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← Admin key (not anon key!)
 *   DATABASE_URL
 */

const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const prisma = new PrismaClient()

// ─── Mock accounts ──────────────────────────────────────────────────────────

const SUPABASE_USERS = [
  {
    email: 'director@bagdarai.kz',
    password: 'Director2024!',
    meta: { role: 'director', name: 'Назарбаева Айгүл Серікқызы' },
  },
  {
    email: 'curator@bagdarai.kz',
    password: 'Curator2024!',
    meta: { role: 'curator', name: 'Сериков Данияр Ерланұлы' },
  },
  {
    email: 'curator2@bagdarai.kz',
    password: 'Curator2024!',
    meta: { role: 'curator', name: 'Омарова Жанна Бекболатқызы' },
  },
  {
    email: 'parent@bagdarai.kz',
    password: 'Parent2024!',
    meta: { role: 'parent', name: 'Серіков Ерлан Маратұлы' },
  },
  {
    email: 'student.b2c@bagdarai.kz',
    password: 'Student2024!',
    meta: { role: 'student', name: 'Алибек Жансейтов (B2C)', subscription_plan: 'FREE' },
  },
  {
    email: 'admin@bagdarai.kz',
    password: 'Admin2024!BagdarAI',
    meta: { role: 'admin', name: 'System Admin' },
  },
]

// School students — no Supabase account, login by studentCode
const SCHOOL_STUDENTS = [
  { name: 'Айдар Серіков',      studentClass: '10A', studentCode: 'STU-00001' },
  { name: 'Дана Жумабекова',    studentClass: '10A', studentCode: 'STU-00002' },
  { name: 'Арман Нурланов',     studentClass: '10B', studentCode: 'STU-00003' },
  { name: 'Айжан Қасымова',     studentClass: '11A', studentCode: 'STU-00004' },
  { name: 'Бекзат Әлімов',      studentClass: '11A', studentCode: 'STU-00005' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsertSupabaseUser({ email, password, meta }) {
  // Try to create
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  })

  if (error) {
    if (error.message?.includes('already been registered') || error.code === 'email_exists') {
      console.log(`  ⚠️  Already exists: ${email}`)
      // List users to find existing
      const { data: list } = await supabase.auth.admin.listUsers()
      const existing = list?.users?.find(u => u.email === email)
      if (existing) {
        // Update metadata
        await supabase.auth.admin.updateUserById(existing.id, { user_metadata: meta })
        console.log(`  ✓ Updated metadata: ${email}`)
        return existing
      }
    } else {
      console.error(`  ✗ Error creating ${email}:`, error.message)
    }
    return null
  }

  console.log(`  ✓ Created Supabase user: ${email}`)
  return data.user
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 BagdarAI Mock Data Seed\n')

  // 1. Create/ensure school in Prisma
  console.log('📚 Creating school...')
  const school = await prisma.school.upsert({
    where: { schoolCode: 'SCH-ASTANA-01' },
    create: {
      name: 'НИШ Астана',
      city: 'Астана',
      schoolCode: 'SCH-ASTANA-01',
      invitationCode: 'INV-NIS-2024',
      directorPhone: '+77001234567',
    },
    update: {},
  })
  console.log(`  ✓ School: ${school.name} (code: ${school.schoolCode})`)

  const school2 = await prisma.school.upsert({
    where: { schoolCode: 'SCH-ALMATY-01' },
    create: {
      name: 'Лицей №1 Алматы',
      city: 'Алматы',
      schoolCode: 'SCH-ALMATY-01',
      invitationCode: 'INV-LIC-2024',
      directorPhone: '+77009876543',
    },
    update: {},
  })
  console.log(`  ✓ School: ${school2.name} (code: ${school2.schoolCode})`)

  // 2. Create Supabase Auth users
  console.log('\n👤 Creating Supabase Auth accounts...')
  const supabaseUserMap = {}
  for (const u of SUPABASE_USERS) {
    const created = await upsertSupabaseUser(u)
    if (created) supabaseUserMap[u.email] = created.id
  }

  // 3. Upsert Prisma users (director, curator, parent, b2c student, admin)
  console.log('\n🗄️  Syncing Prisma users...')

  // Director
  if (supabaseUserMap['director@bagdarai.kz']) {
    await prisma.user.upsert({
      where: { id: supabaseUserMap['director@bagdarai.kz'] },
      create: {
        id: supabaseUserMap['director@bagdarai.kz'],
        role: 'director',
        name: 'Назарбаева Айгүл Серікқызы',
        email: 'director@bagdarai.kz',
        schoolId: school.id,
        subscriptionPlan: 'SCHOOL',
      },
      update: { schoolId: school.id },
    })
    console.log('  ✓ Director synced')
  }

  // Curator 1
  let curatorId = null
  if (supabaseUserMap['curator@bagdarai.kz']) {
    curatorId = supabaseUserMap['curator@bagdarai.kz']
    await prisma.user.upsert({
      where: { id: curatorId },
      create: {
        id: curatorId,
        role: 'curator',
        name: 'Сериков Данияр Ерланұлы',
        email: 'curator@bagdarai.kz',
        schoolId: school.id,
        subscriptionPlan: 'SCHOOL',
      },
      update: { schoolId: school.id },
    })
    console.log('  ✓ Curator 1 synced')
  }

  // Curator 2
  if (supabaseUserMap['curator2@bagdarai.kz']) {
    await prisma.user.upsert({
      where: { id: supabaseUserMap['curator2@bagdarai.kz'] },
      create: {
        id: supabaseUserMap['curator2@bagdarai.kz'],
        role: 'curator',
        name: 'Омарова Жанна Бекболатқызы',
        email: 'curator2@bagdarai.kz',
        schoolId: school.id,
        subscriptionPlan: 'SCHOOL',
      },
      update: { schoolId: school.id },
    })
    console.log('  ✓ Curator 2 synced')
  }

  // B2C Student
  if (supabaseUserMap['student.b2c@bagdarai.kz']) {
    const b2cStudent = await prisma.user.upsert({
      where: { id: supabaseUserMap['student.b2c@bagdarai.kz'] },
      create: {
        id: supabaseUserMap['student.b2c@bagdarai.kz'],
        role: 'student',
        name: 'Алибек Жансейтов (B2C)',
        email: 'student.b2c@bagdarai.kz',
        studentClass: 'Individual',
        studentCode: 'STU-B2C-01',
        subscriptionPlan: 'FREE',
      },
      update: {},
    })
    // XP
    await prisma.userXP.upsert({
      where: { userId: b2cStudent.id },
      create: { userId: b2cStudent.id, xp: 250, level: 2 },
      update: {},
    })
    console.log('  ✓ B2C Student synced')
  }

  // Parent
  if (supabaseUserMap['parent@bagdarai.kz']) {
    await prisma.user.upsert({
      where: { id: supabaseUserMap['parent@bagdarai.kz'] },
      create: {
        id: supabaseUserMap['parent@bagdarai.kz'],
        role: 'parent',
        name: 'Серіков Ерлан Маратұлы',
        email: 'parent@bagdarai.kz',
        subscriptionPlan: 'FREE',
      },
      update: {},
    })
    console.log('  ✓ Parent synced')
  }

  // Admin
  if (supabaseUserMap['admin@bagdarai.kz']) {
    await prisma.user.upsert({
      where: { id: supabaseUserMap['admin@bagdarai.kz'] },
      create: {
        id: supabaseUserMap['admin@bagdarai.kz'],
        role: 'admin',
        name: 'System Admin',
        email: 'admin@bagdarai.kz',
        subscriptionPlan: 'PRO',
      },
      update: {},
    })
    console.log('  ✓ Admin synced')
  }

  // 4. School students (Prisma only — no Supabase account)
  console.log('\n🎓 Creating school students...')
  for (const s of SCHOOL_STUDENTS) {
    const student = await prisma.user.upsert({
      where: { studentCode: s.studentCode },
      create: {
        role: 'student',
        name: s.name,
        studentClass: s.studentClass,
        studentCode: s.studentCode,
        schoolId: school.id,
        curatorId: curatorId,
        subscriptionPlan: 'SCHOOL',
      },
      update: {},
    })
    // XP
    await prisma.userXP.upsert({
      where: { userId: student.id },
      create: { userId: student.id, xp: Math.floor(Math.random() * 400) + 50, level: 1 },
      update: {},
    })
    console.log(`  ✓ ${s.name} (${s.studentCode})`)
  }

  // 5. Summary
  console.log('\n✅ Seed complete!\n')
  console.log('═══════════════════════════════════════════════════════')
  console.log('  LOGIN CREDENTIALS')
  console.log('═══════════════════════════════════════════════════════')
  console.log('')
  console.log('  🏫 SCHOOL CODES')
  console.log('  НИШ Астана    → SCH-ASTANA-01')
  console.log('  Лицей Алматы  → SCH-ALMATY-01')
  console.log('  Invitation    → INV-NIS-2024')
  console.log('')
  console.log('  👤 PERSONAL ACCOUNTS (email + password)')
  console.log('  ┌─────────────────────────────────────────────────┐')
  console.log('  │ Role      │ Email                  │ Password   │')
  console.log('  ├─────────────────────────────────────────────────┤')
  console.log('  │ Admin     │ admin@bagdarai.kz       │ Admin2024!BagdarAI │')
  console.log('  │ Director  │ director@bagdarai.kz   │ Director2024! │')
  console.log('  │ Curator   │ curator@bagdarai.kz    │ Curator2024! │')
  console.log('  │ Curator 2 │ curator2@bagdarai.kz   │ Curator2024! │')
  console.log('  │ Parent    │ parent@bagdarai.kz     │ Parent2024!  │')
  console.log('  │ Student   │ student.b2c@bagdarai.kz│ Student2024! │')
  console.log('  └─────────────────────────────────────────────────┘')
  console.log('')
  console.log('  🎓 SCHOOL STUDENTS (code only, no password)')
  console.log('  ┌───────────────────────────────────────────┐')
  console.log('  │ Name               │ Class │ Code        │')
  console.log('  ├───────────────────────────────────────────┤')
  SCHOOL_STUDENTS.forEach(s => {
    console.log(`  │ ${s.name.padEnd(18)} │ ${s.studentClass.padEnd(5)} │ ${s.studentCode} │`)
  })
  console.log('  └───────────────────────────────────────────┘')
  console.log('')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
