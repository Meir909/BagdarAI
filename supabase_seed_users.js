// =====================================================
// Supabase User Seed Script
// Creates test accounts in Supabase Auth
// Run: node supabase_seed_users.js
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials (from .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Test accounts to create
const testUsers = [
  {
    email: 'admin@bagdarai.kz',
    password: 'Admin@BagdarAI2024',
    user_metadata: {
      role: 'admin',
      name: 'System Admin'
    }
  },
  {
    email: 'serikov@nis.edu.kz',
    password: 'curator123',
    user_metadata: {
      role: 'curator',
      name: 'Сериков Данияр Ерланұлы',
      school_id: 'school-nis-astana'
    }
  },
  {
    email: 'omarova@nis.edu.kz',
    password: 'curator123',
    user_metadata: {
      role: 'curator',
      name: 'Омарова Жанна Бекболатқызы',
      school_id: 'school-nis-astana'
    }
  },
  {
    email: 'serikov.parent@mail.kz',
    password: 'parent123',
    user_metadata: {
      role: 'parent',
      name: 'Серіков Ерлан Маратұлы',
      child_code: 'STU-00001'
    }
  },
  {
    email: 'student1@example.kz',
    password: 'student123',
    user_metadata: {
      role: 'student',
      name: 'Айдар Серіков',
      student_class: '10A',
      student_code: 'STU-00001',
      school_code: 'SCHOOL-2024-ASTANA',
      curator_email: 'serikov@nis.edu.kz'
    }
  },
  {
    email: 'student2@example.kz',
    password: 'student123',
    user_metadata: {
      role: 'student',
      name: 'Дана Жумабекова',
      student_class: '10A',
      student_code: 'STU-00002',
      school_code: 'SCHOOL-2024-ASTANA',
      curator_email: 'serikov@nis.edu.kz'
    }
  },
  {
    email: 'student3@example.kz',
    password: 'student123',
    user_metadata: {
      role: 'student',
      name: 'Арман Нурланов',
      student_class: '10B',
      student_code: 'STU-00003',
      school_code: 'SCHOOL-2024-ASTANA',
      curator_email: 'omarova@nis.edu.kz'
    }
  },
  {
    email: 'director1@example.kz',
    password: 'director123',
    user_metadata: {
      role: 'director',
      name: 'Назарбаева Айгүл Серікқызы',
      phone: '+77001234567',
      school_code: 'SCHOOL-2024-ASTANA',
      invitation_code: 'INV-NIS-001'
    }
  },
  {
    email: 'director2@example.kz',
    password: 'director123',
    user_metadata: {
      role: 'director',
      name: 'Ахметов Бауыржан Қалиұлы',
      phone: '+77009876543',
      school_code: 'SCHOOL-2024-ALMATY',
      invitation_code: 'INV-LIC-002'
    }
  }
];

async function seedUsers() {
  console.log('🌱 Creating Supabase test accounts...\n');

  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existing } = await supabase.auth.admin.getUserByEmail(user.email);
      
      if (existing?.user) {
        console.log(`⚠️  ${user.email} - already exists, skipping`);
        continue;
      }

      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.user_metadata
      });

      if (error) {
        console.error(`❌ ${user.email} - ${error.message}`);
      } else {
        console.log(`✅ ${user.email} - created (${user.user_metadata.role})`);
      }
    } catch (err) {
      console.error(`❌ ${user.email} - ${err.message}`);
    }
  }

  console.log('\n📋 Test Accounts Summary:');
  console.log('========================');
  console.log('\n👤 Admin:');
  console.log('  Email: admin@bagdarai.kz');
  console.log('  Password: Admin@BagdarAI2024');
  console.log('\n👨‍🏫 Curators:');
  console.log('  serikov@nis.edu.kz / curator123');
  console.log('  omarova@nis.edu.kz / curator123');
  console.log('\n👨‍👩‍👧 Parent:');
  console.log('  serikov.parent@mail.kz / parent123');
  console.log('\n🎓 Students:');
  console.log('  student1@example.kz / student123');
  console.log('  student2@example.kz / student123');
  console.log('  student3@example.kz / student123');
  console.log('\n🏫 Directors:');
  console.log('  director1@example.kz / director123');
  console.log('  director2@example.kz / director123');
  console.log('\n✨ Seed complete!');
}

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, testUsers };
