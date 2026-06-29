"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
}

export async function getCodingSheets() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch all sheets (global sheets and user's custom sheets)
  const sheets = await db.codingSheet.findMany({
    where: {
      OR: [
        { isCustom: false },
        { userId: user.id }
      ]
    },
    include: {
      problems: {
        select: {
          id: true,
          difficulty: true,
        }
      }
    }
  });

  // Fetch user's progress records
  const progressList = await db.userProblemProgress.findMany({
    where: { userId: user.id },
    select: {
      problemId: true,
      isSolved: true,
    }
  });

  const solvedMap = new Set(
    progressList.filter(p => p.isSolved).map(p => p.problemId)
  );

  return sheets.map(sheet => {
    const total = sheet.problems.length;
    const solved = sheet.problems.filter(p => solvedMap.has(p.id)).length;
    return {
      id: sheet.id,
      title: sheet.title,
      description: sheet.description,
      isCustom: sheet.isCustom,
      totalProblems: total,
      solvedProblems: solved,
    };
  });
}

export async function getSheetDetails(sheetId: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const sheet = await db.codingSheet.findUnique({
    where: { id: sheetId },
    include: {
      problems: true
    }
  });

  if (!sheet) {
    throw new Error("Sheet not found");
  }

  // Get user's progress on these problems
  const progressList = await db.userProblemProgress.findMany({
    where: {
      userId: user.id,
      problemId: {
        in: sheet.problems.map(p => p.id)
      }
    }
  });

  const progressMap = new Map(progressList.map(p => [p.problemId, p]));

  const problemsWithProgress = sheet.problems.map(problem => {
    const progress = progressMap.get(problem.id);
    return {
      ...problem,
      isSolved: progress?.isSolved || false,
      isBookmarked: progress?.isBookmarked || false,
      notes: progress?.notes || null,
      personalRating: progress?.personalRating || null,
      nextRevisionDate: progress?.nextRevisionDate || null,
    };
  });

  return {
    id: sheet.id,
    title: sheet.title,
    description: sheet.description,
    isCustom: sheet.isCustom,
    problems: problemsWithProgress,
  };
}

export async function updateProblemProgress(
  problemId: string,
  data: {
    isSolved?: boolean;
    isBookmarked?: boolean;
    notes?: string | null;
    personalRating?: number | null;
    nextRevisionDate?: Date | null;
  }
) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const progress = await db.userProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId: user.id,
        problemId: problemId,
      }
    },
    create: {
      userId: user.id,
      problemId: problemId,
      isSolved: data.isSolved ?? false,
      isBookmarked: data.isBookmarked ?? false,
      notes: data.notes ?? null,
      personalRating: data.personalRating ?? null,
      nextRevisionDate: data.nextRevisionDate ?? null,
    },
    update: {
      isSolved: data.isSolved !== undefined ? data.isSolved : undefined,
      isBookmarked: data.isBookmarked !== undefined ? data.isBookmarked : undefined,
      notes: data.notes !== undefined ? data.notes : undefined,
      personalRating: data.personalRating !== undefined ? data.personalRating : undefined,
      nextRevisionDate: data.nextRevisionDate !== undefined ? data.nextRevisionDate : undefined,
    }
  });

  // Log activity if problem is solved
  if (data.isSolved) {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { title: true }
    });
    if (problem) {
      await db.activityLog.create({
        data: {
          userId: user.id,
          type: "PROBLEM_SOLVED",
          description: `Solved problem: "${problem.title}"`,
        }
      });
    }
  }

  return progress;
}

export async function createCustomSheet(data: { title: string; description?: string }) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const sheet = await db.codingSheet.create({
    data: {
      title: data.title,
      description: data.description || null,
      isCustom: true,
      userId: user.id,
    }
  });

  return sheet;
}

export async function addProblemToSheet(
  sheetId: string,
  data: {
    title: string;
    url: string;
    difficulty: string;
    platform: string;
    tags?: string[];
  }
) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure sheet belongs to user or is custom
  const sheet = await db.codingSheet.findFirst({
    where: { id: sheetId, userId: user.id }
  });

  if (!sheet) {
    throw new Error("Sheet not found or access denied");
  }

  const problem = await db.problem.create({
    data: {
      sheetId,
      title: data.title,
      url: data.url,
      difficulty: data.difficulty,
      platform: data.platform,
      tags: data.tags || [],
    }
  });

  return problem;
}
