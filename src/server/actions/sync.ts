"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { fetchLeetCodeStats } from "../services/leetcode";
import { fetchGitHubStats } from "../services/github";
import { fetchCodeforcesStats } from "../services/codeforces";
import { fetchCodeChefStats } from "../services/codechef";
import { fetchGeeksforGeeksStats } from "../services/geeksforgeeks";
import { fetchByteCodeStats } from "../services/bytecode";
import { fetchAtCoderStats } from "../services/atcoder";
import { redis } from "@/lib/redis";
import { rateLimit } from "@/lib/rate-limit";

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
}

export async function saveUsernames(data: {
  githubUsername?: string;
  leetcodeUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  atcoderUsername?: string;
  geeksforgeeksUsername?: string;
  bytecodeUsername?: string;
}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Update usernames in database
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      githubUsername: data.githubUsername || null,
      leetcodeUsername: data.leetcodeUsername || null,
      codeforcesUsername: data.codeforcesUsername || null,
      codechefUsername: data.codechefUsername || null,
      atcoderUsername: data.atcoderUsername || null,
      geeksforgeeksUsername: data.geeksforgeeksUsername || null,
      bytecodeUsername: data.bytecodeUsername || null,
    },
  });

  return { success: true, user: updatedUser };
}

export async function triggerProfileSync() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // IP Rate limiting
  await rateLimit(5, 60000); // Max 5 sync triggers per IP per minute

  const cacheKey = `sync-lock:${user.id}`;
  const isLocked = await redis.get(cacheKey);
  if (isLocked) {
    throw new Error("You can only synchronize your profiles once every 15 minutes.");
  }

  // Fetch user profiles details from db
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  let leetcodeData = null;
  let githubData = null;
  let codeforcesData = null;
  let codechefData = null;
  let gfgData = null;
  let bytecodeData = null;
  let atcoderData = null;

  // 1. Sync LeetCode
  if (dbUser.leetcodeUsername) {
    leetcodeData = await fetchLeetCodeStats(dbUser.leetcodeUsername);
  }

  // 2. Sync GitHub
  if (dbUser.githubUsername) {
    githubData = await fetchGitHubStats(dbUser.githubUsername);
  }

  // 3. Sync Codeforces
  if (dbUser.codeforcesUsername) {
    codeforcesData = await fetchCodeforcesStats(dbUser.codeforcesUsername);
  }

  // 4. Sync CodeChef
  if (dbUser.codechefUsername) {
    codechefData = await fetchCodeChefStats(dbUser.codechefUsername);
  }

  // 5. Sync GeeksforGeeks
  if (dbUser.geeksforgeeksUsername) {
    gfgData = await fetchGeeksforGeeksStats(dbUser.geeksforgeeksUsername);
  }

  // 6. Sync ByteCode
  if (dbUser.bytecodeUsername) {
    bytecodeData = await fetchByteCodeStats(dbUser.bytecodeUsername);
  }

  // 7. Sync AtCoder
  if (dbUser.atcoderUsername) {
    atcoderData = await fetchAtCoderStats(dbUser.atcoderUsername);
  }

  // 7. Upsert Coding Profile details
  await db.codingProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      leetcodeSolved: leetcodeData?.solved || 0,
      leetcodeEasy: leetcodeData?.easy || 0,
      leetcodeMedium: leetcodeData?.medium || 0,
      leetcodeHard: leetcodeData?.hard || 0,
      leetcodeRating: leetcodeData?.rating || null,
      leetcodeGlobalRank: leetcodeData?.globalRank || null,
      leetcodeLastSynced: leetcodeData ? new Date() : null,

      githubRepoCount: githubData?.repos || 0,
      githubFollowers: githubData?.followers || 0,
      githubStars: githubData?.stars || 0,
      githubCommits: githubData?.commits || 0,
      githubPRs: githubData?.prs || 0,
      githubIssues: githubData?.issues || 0,
      githubLastSynced: githubData ? new Date() : null,

      codeforcesRating: codeforcesData?.rating || null,
      codeforcesMaxRating: codeforcesData?.maxRating || null,
      codeforcesRank: codeforcesData?.rank || null,
      codeforcesSolved: codeforcesData?.solved || 0,
      codeforcesLastSynced: codeforcesData ? new Date() : null,

      codechefRating: codechefData?.rating || null,
      codechefStars: codechefData?.stars || null,
      codechefGlobalRank: codechefData?.globalRank || null,
      codechefLastSynced: codechefData ? new Date() : null,

      geeksforgeeksSolved: gfgData?.solved || 0,
      geeksforgeeksLastSynced: gfgData ? new Date() : null,

      bytecodeSolved: bytecodeData?.solved || 0,
      bytecodeLastSynced: bytecodeData ? new Date() : null,

      atcoderRating: atcoderData?.rating || null,
      atcoderRank: atcoderData?.rank || null,
      atcoderLastSynced: atcoderData ? new Date() : null,
    },
    update: {
      leetcodeSolved: leetcodeData ? leetcodeData.solved : undefined,
      leetcodeEasy: leetcodeData ? leetcodeData.easy : undefined,
      leetcodeMedium: leetcodeData ? leetcodeData.medium : undefined,
      leetcodeHard: leetcodeData ? leetcodeData.hard : undefined,
      leetcodeRating: leetcodeData ? leetcodeData.rating : undefined,
      leetcodeGlobalRank: leetcodeData ? leetcodeData.globalRank : undefined,
      leetcodeLastSynced: leetcodeData ? new Date() : undefined,

      githubRepoCount: githubData ? githubData.repos : undefined,
      githubFollowers: githubData ? githubData.followers : undefined,
      githubStars: githubData ? githubData.stars : undefined,
      githubCommits: githubData ? githubData.commits : undefined,
      githubPRs: githubData ? githubData.prs : undefined,
      githubIssues: githubData ? githubData.issues : undefined,
      githubLastSynced: githubData ? new Date() : undefined,

      codeforcesRating: codeforcesData ? codeforcesData.rating : undefined,
      codeforcesMaxRating: codeforcesData ? codeforcesData.maxRating : undefined,
      codeforcesRank: codeforcesData ? codeforcesData.rank : undefined,
      codeforcesSolved: codeforcesData ? codeforcesData.solved : undefined,
      codeforcesLastSynced: codeforcesData ? new Date() : undefined,

      codechefRating: codechefData ? codechefData.rating : undefined,
      codechefStars: codechefData ? codechefData.stars : undefined,
      codechefGlobalRank: codechefData ? codechefData.globalRank : undefined,
      codechefLastSynced: codechefData ? new Date() : undefined,

      geeksforgeeksSolved: gfgData ? gfgData.solved : undefined,
      geeksforgeeksLastSynced: gfgData ? new Date() : undefined,

      bytecodeSolved: bytecodeData ? bytecodeData.solved : undefined,
      bytecodeLastSynced: bytecodeData ? new Date() : undefined,

      atcoderRating: atcoderData ? atcoderData.rating : undefined,
      atcoderRank: atcoderData ? atcoderData.rank : undefined,
      atcoderLastSynced: atcoderData ? new Date() : undefined,
    },
  });

  // 8. Log activity
  const platforms = [];
  if (leetcodeData) platforms.push("LeetCode");
  if (githubData) platforms.push("GitHub");
  if (codeforcesData) platforms.push("Codeforces");
  if (codechefData) platforms.push("CodeChef");
  if (gfgData) platforms.push("GeeksforGeeks");
  if (bytecodeData) platforms.push("ByteCode");
  if (atcoderData) platforms.push("AtCoder");

  if (platforms.length > 0) {
    await db.activityLog.create({
      data: {
        userId: user.id,
        type: "SYNC_COMPLETED",
        description: `Successfully synchronized statistics for: ${platforms.join(", ")}`,
      },
    });
  }

  await redis.set(cacheKey, "true", 900);
  return { success: true };
}

export async function getUserUsernames() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      githubUsername: true,
      leetcodeUsername: true,
      codeforcesUsername: true,
      codechefUsername: true,
      atcoderUsername: true,
      geeksforgeeksUsername: true,
      bytecodeUsername: true,
    },
  });

  return dbUser || {
    githubUsername: null,
    leetcodeUsername: null,
    codeforcesUsername: null,
    codechefUsername: null,
    atcoderUsername: null,
    geeksforgeeksUsername: null,
    bytecodeUsername: null,
  };
}

export async function getCodingProfile() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await db.codingProfile.findUnique({
    where: { userId: user.id },
  });

  return profile;
}

export async function getActivityLogs() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const logs = await db.activityLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return logs;
}
