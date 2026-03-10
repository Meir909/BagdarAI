import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { professionsData } from "@/data/professions";
import { simulations } from "@/data/simulations";
import { npcMentors } from "@/data/npc-mentors";
import { questTemplates } from "@/data/daily-quests";

// POST /api/admin/seed — seed professions, simulations, NPCs, quests
// Requires admin session OR secret key header
export async function POST(request: NextRequest) {
  try {
    // Allow either admin session or a secret key for Render deploy
    const secretKey = request.headers.get("x-seed-key");
    const isSecretValid = secretKey === (process.env.SEED_SECRET_KEY || "bagdarai-seed-2024");

    if (!isSecretValid) {
      const session = await getSession();
      if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results: Record<string, number> = {};

    // 1. Seed professions
    let profCount = 0;
    for (const prof of professionsData) {
      const id = `prof-${prof.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
      await prisma.profession.upsert({
        where: { id },
        update: {
          nameRu: prof.nameRu, nameKk: prof.nameKk,
          description: prof.description, descriptionRu: prof.descriptionRu, descriptionKk: prof.descriptionKk,
          salary: prof.salary, futureDemand: prof.futureDemand,
          skills: prof.skills, universities: prof.universities as object[],
        },
        create: {
          id, name: prof.name, nameRu: prof.nameRu, nameKk: prof.nameKk,
          category: prof.category,
          description: prof.description, descriptionRu: prof.descriptionRu, descriptionKk: prof.descriptionKk,
          salary: prof.salary, futureDemand: prof.futureDemand,
          skills: prof.skills, universities: prof.universities as object[],
        },
      });
      profCount++;
    }
    results.professions = profCount;

    // 2. Seed simulations
    let simCount = 0;
    for (const sim of simulations) {
      const simId = `sim-${sim.careerId}`;
      await prisma.careerSimulation.upsert({
        where: { id: simId },
        update: {
          title: sim.title, titleRu: sim.titleRu, titleKk: sim.titleKk,
          description: sim.description, descriptionRu: sim.descriptionRu, descriptionKk: sim.descriptionKk,
          difficulty: sim.difficulty, estimatedTime: sim.estimatedTime,
          xpReward: sim.xpReward, scenarios: sim.scenarios as object[], category: sim.category,
        },
        create: {
          id: simId, careerId: sim.careerId,
          title: sim.title, titleRu: sim.titleRu, titleKk: sim.titleKk,
          description: sim.description, descriptionRu: sim.descriptionRu, descriptionKk: sim.descriptionKk,
          difficulty: sim.difficulty, estimatedTime: sim.estimatedTime,
          xpReward: sim.xpReward, scenarios: sim.scenarios as object[], category: sim.category,
        },
      });
      simCount++;
    }
    results.simulations = simCount;

    // 3. Seed NPC mentors
    let npcCount = 0;
    for (const npc of npcMentors) {
      await prisma.npcMentor.upsert({
        where: { slug: npc.slug },
        update: {
          name: npc.name, profession: npc.profession, professionRu: npc.professionRu, professionKk: npc.professionKk,
          personality: npc.personality,
          introMessage: npc.introMessage, introMessageRu: npc.introMessageRu, introMessageKk: npc.introMessageKk,
          avatarEmoji: npc.avatarEmoji, category: npc.category,
        },
        create: {
          slug: npc.slug, name: npc.name, profession: npc.profession,
          professionRu: npc.professionRu, professionKk: npc.professionKk,
          personality: npc.personality,
          introMessage: npc.introMessage, introMessageRu: npc.introMessageRu, introMessageKk: npc.introMessageKk,
          avatarEmoji: npc.avatarEmoji, category: npc.category,
        },
      });
      npcCount++;
    }
    results.npcs = npcCount;

    // 4. Seed daily quest templates
    let questCount = 0;
    for (const q of questTemplates) {
      const questId = `quest-${q.type}-${q.title.toLowerCase().replace(/\s+/g, "-")}`;
      await prisma.dailyQuest.upsert({
        where: { id: questId },
        update: {
          type: q.type, title: q.title, titleRu: q.titleRu, titleKk: q.titleKk,
          description: q.description, descriptionRu: q.descriptionRu, descriptionKk: q.descriptionKk,
          xpReward: q.xpReward, icon: q.icon,
        },
        create: {
          id: questId, type: q.type, title: q.title, titleRu: q.titleRu, titleKk: q.titleKk,
          description: q.description, descriptionRu: q.descriptionRu, descriptionKk: q.descriptionKk,
          xpReward: q.xpReward, icon: q.icon,
        },
      });
      questCount++;
    }
    results.quests = questCount;

    return NextResponse.json({ success: true, seeded: results });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
