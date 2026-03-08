import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { professionsData } from "../data/professions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create Admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "Admin@BagdarAI2024", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bagdarai.kz" },
    update: {},
    create: {
      role: "admin",
      name: "System Admin",
      email: "admin@bagdarai.kz",
      passwordHash: adminPassword,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // 2. Create Seed Schools
  const school1 = await prisma.school.upsert({
    where: { schoolCode: "SCHOOL-2024-ASTANA" },
    update: {},
    create: {
      name: "НИШ Астана",
      city: "Астана",
      schoolCode: "SCHOOL-2024-ASTANA",
      invitationCode: "INV-NIS-001",
      directorPhone: "+77001234567",
    },
  });

  const school2 = await prisma.school.upsert({
    where: { schoolCode: "SCHOOL-2024-ALMATY" },
    update: {},
    create: {
      name: "Лицей №1 Алматы",
      city: "Алматы",
      schoolCode: "SCHOOL-2024-ALMATY",
      invitationCode: "INV-LIC-002",
      directorPhone: "+77009876543",
    },
  });

  const school3 = await prisma.school.upsert({
    where: { schoolCode: "SCHOOL-2024-KRGNDA" },
    update: {},
    create: {
      name: "Гимназия №5 Караганда",
      city: "Караганда",
      schoolCode: "SCHOOL-2024-KRGNDA",
      invitationCode: "INV-GYM-003",
      directorPhone: "+77005551234",
    },
  });

  console.log("✅ Schools created:", school1.name, school2.name, school3.name);

  // 3. Create Seed Directors
  const dir1 = await prisma.user.upsert({
    where: { phone: "+77001234567" },
    update: {},
    create: {
      role: "director",
      name: "Назарбаева Айгүл Серікқызы",
      phone: "+77001234567",
      schoolId: school1.id,
    },
  });

  const dir2 = await prisma.user.upsert({
    where: { phone: "+77009876543" },
    update: {},
    create: {
      role: "director",
      name: "Ахметов Бауыржан Қалиұлы",
      phone: "+77009876543",
      schoolId: school2.id,
    },
  });

  console.log("✅ Directors created:", dir1.name, dir2.name);

  // 4. Create Seed Curators
  const curatorPwd = await bcrypt.hash("curator123", 10);

  const cur1 = await prisma.user.upsert({
    where: { email: "serikov@nis.edu.kz" },
    update: {},
    create: {
      role: "curator",
      name: "Сериков Данияр Ерланұлы",
      email: "serikov@nis.edu.kz",
      passwordHash: curatorPwd,
      schoolId: school1.id,
    },
  });

  const cur2 = await prisma.user.upsert({
    where: { email: "omarova@nis.edu.kz" },
    update: {},
    create: {
      role: "curator",
      name: "Омарова Жанна Бекболатқызы",
      email: "omarova@nis.edu.kz",
      passwordHash: curatorPwd,
      schoolId: school1.id,
    },
  });

  console.log("✅ Curators created:", cur1.name, cur2.name);

  // 5. Create Seed Students
  const stu1 = await prisma.user.upsert({
    where: { studentCode: "STU-00001" },
    update: {},
    create: {
      role: "student",
      name: "Айдар Серіков",
      schoolId: school1.id,
      studentClass: "10A",
      studentCode: "STU-00001",
      curatorId: cur1.id,
    },
  });

  const stu2 = await prisma.user.upsert({
    where: { studentCode: "STU-00002" },
    update: {},
    create: {
      role: "student",
      name: "Дана Жумабекова",
      schoolId: school1.id,
      studentClass: "10A",
      studentCode: "STU-00002",
      curatorId: cur1.id,
    },
  });

  const stu3 = await prisma.user.upsert({
    where: { studentCode: "STU-00003" },
    update: {},
    create: {
      role: "student",
      name: "Арман Нурланов",
      schoolId: school1.id,
      studentClass: "10B",
      studentCode: "STU-00003",
      curatorId: cur2.id,
    },
  });

  console.log("✅ Students created:", stu1.name, stu2.name, stu3.name);

  // 6. Create Seed Parent
  const parentPwd = await bcrypt.hash("parent123", 10);
  const parent1 = await prisma.user.upsert({
    where: { email: "serikov.parent@mail.kz" },
    update: {},
    create: {
      role: "parent",
      name: "Серіков Ерлан Маратұлы",
      email: "serikov.parent@mail.kz",
      passwordHash: parentPwd,
      childId: stu1.id,
    },
  });

  console.log("✅ Parent created:", parent1.name);

  // 7. Create Badges
  const badges = [
    { name: "First Step", nameRu: "Первый шаг", nameKk: "Бірінші қадам", icon: "🏆", trigger: "test_complete" },
    { name: "Explorer", nameRu: "Исследователь", nameKk: "Зерттеуші", icon: "🔍", trigger: "profession_explore" },
    { name: "Chat Master", nameRu: "Мастер чата", nameKk: "Чат шебері", icon: "💬", trigger: "chat_first" },
    { name: "Career Pro", nameRu: "Карьерный про", nameKk: "Мансап шебері", icon: "⭐", trigger: "profile_complete" },
    { name: "Knowledge Seeker", nameRu: "Искатель знаний", nameKk: "Білім іздеуші", icon: "📖", trigger: "roadmap_generated" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.trigger }, // use trigger as stable ID for upsert
      update: badge,
      create: { id: badge.trigger, ...badge },
    });
  }

  console.log("✅ Badges created:", badges.length);

  // 8. Seed Professions (300 professions from data file)
  console.log("🌱 Seeding professions...");
  let professionCount = 0;

  for (const prof of professionsData) {
    await prisma.profession.upsert({
      where: { id: `prof-${prof.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}` },
      update: {
        nameRu: prof.nameRu,
        nameKk: prof.nameKk,
        description: prof.description,
        descriptionRu: prof.descriptionRu,
        descriptionKk: prof.descriptionKk,
        salary: prof.salary,
        futureDemand: prof.futureDemand,
        skills: prof.skills,
        universities: prof.universities as object[],
      },
      create: {
        id: `prof-${prof.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
        name: prof.name,
        nameRu: prof.nameRu,
        nameKk: prof.nameKk,
        category: prof.category,
        description: prof.description,
        descriptionRu: prof.descriptionRu,
        descriptionKk: prof.descriptionKk,
        salary: prof.salary,
        futureDemand: prof.futureDemand,
        skills: prof.skills,
        universities: prof.universities as object[],
      },
    });
    professionCount++;
  }

  console.log(`✅ ${professionCount} professions seeded`);

  // 9. Create Audit Log for seeding
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "database_seeded",
      details: {
        schools: 3,
        directors: 2,
        curators: 2,
        students: 3,
        parents: 1,
        professions: professionCount,
        badges: badges.length,
      },
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Test Credentials:");
  console.log("  Admin: admin@bagdarai.kz / Admin@BagdarAI2024");
  console.log("  Curator: serikov@nis.edu.kz / curator123");
  console.log("  Parent: serikov.parent@mail.kz / parent123");
  console.log("  Director: Phone +77001234567, Code SCHOOL-2024-ASTANA, Inv INV-NIS-001");
  console.log("  Student: School Code SCHOOL-2024-ASTANA (register a new account)");
  console.log("  Student Code for parent: STU-00001");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
