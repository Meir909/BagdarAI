import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Get skill trees
    let whereClause = {};
    if (category) {
      whereClause = { category };
    }

    const skills = await prisma.Skill.findMany({
      where: whereClause,
      orderBy: { level: "asc" },
    });

    // Get user's progress
    const userSkills = await prisma.UserSkill.findMany({
      where: { userId: session.userId },
      include: { skill: true },
    });

    // Build skill tree structure
    const skillMap = new Map();
    skills.forEach(skill => skillMap.set(skill.id, { ...skill, children: [] }));
    
    // Build hierarchy
    skills.forEach(skill => {
      if (skill.parentId) {
        const parent = skillMap.get(skill.parentId);
        if (parent) {
          parent.children.push(skillMap.get(skill.id));
        }
      }
    });

    // Get root nodes (no parent)
    const rootSkills = skills.filter(skill => !skill.parentId)
      .map(skill => skillMap.get(skill.id));

    // Mark unlocked skills
    userSkills.forEach(userSkill => {
      const skill = skillMap.get(userSkill.skillId);
      if (skill) {
        skill.unlocked = true;
        skill.progress = userSkill.progress;
        skill.xpEarned = userSkill.xpEarned;
        skill.completedAt = userSkill.completedAt;
      }
    });

    return NextResponse.json({
      skillTree: rootSkills,
      userProgress: userSkills,
      totalSkills: skills.length,
      unlockedSkills: userSkills.length,
    });
  } catch (error) {
    console.error("Skill tree error:", error);
    return NextResponse.json(
      { error: "Failed to get skill tree" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { skillId, action } = body;

    if (action === "unlock") {
      // Check if user can unlock this skill
      const skill = await prisma.Skill.findUnique({
        where: { id: skillId },
        include: { parent: true },
      });

      if (!skill) {
        return NextResponse.json({ error: "Skill not found" }, { status: 404 });
      }

      // Check prerequisites
      const userXP = await getUserXP(session.userId);
      if (userXP.totalXP < skill.xpRequired) {
        return NextResponse.json(
          { error: "Insufficient XP to unlock this skill" },
          { status: 400 }
        );
      }

      // Check if parent skill is unlocked
      if (skill.parentId) {
        const parentProgress = await prisma.UserSkill.findUnique({
          where: { userId_skillId: { userId: session.userId, skillId: skill.parentId } },
        });
        if (!parentProgress) {
          return NextResponse.json(
            { error: "Must unlock parent skill first" },
            { status: 400 }
          );
        }
      }

      // Unlock the skill
      await prisma.UserSkill.create({
        data: {
          userId: session.userId,
          skillId,
          unlockedAt: new Date(),
          progress: 0,
          xpEarned: 0,
        },
      });

      // Award XP for unlocking skill
      await awardXP(session.userId, 20, "skill_unlock");

      return NextResponse.json({
        success: true,
        message: "Skill unlocked successfully!",
        xpEarned: 20,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Skill tree action error:", error);
    return NextResponse.json(
      { error: "Failed to process skill action" },
      { status: 500 }
    );
  }
}

async function getUserXP(userId: string) {
  const xpProgress = await prisma.XPProgress.findUnique({
    where: { userId },
  });
  return xpProgress || { totalXP: 0, currentLevel: 1 };
}

async function awardXP(userId: string, amount: number, reason: string) {
  // Implementation for awarding XP
  // This would update the XPProgress table
  console.log(`Awarding ${amount} XP to user ${userId} for ${reason}`);
}
