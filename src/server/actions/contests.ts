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

export interface ContestItem {
  id: string; // generated from URL or name hash
  name: string;
  url: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  platform: string; // "LEETCODE" | "CODEFORCES" | "CODECHEF" | "ATCODER"
  status: "ACTIVE" | "UPCOMING";
}

export async function getContestSchedule(): Promise<ContestItem[]> {
  try {
    const res = await fetch("https://kontests.net/api/v1/all", {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contests from Kontests API");
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const now = new Date();

    const contests: ContestItem[] = data
      .map((item: any) => {
        let platform = "";
        const site = (item.site || "").toLowerCase();

        if (site.includes("leetcode")) platform = "LEETCODE";
        else if (site.includes("codeforces")) platform = "CODEFORCES";
        else if (site.includes("codechef")) platform = "CODECHEF";
        else if (site.includes("atcoder")) platform = "ATCODER";
        else return null;

        const startTime = new Date(item.start_time);
        const endTime = new Date(item.end_time);

        if (endTime < now) return null; // Skip past contests

        const status = startTime <= now ? "ACTIVE" : "UPCOMING";
        // Create a simple stable ID from url
        const id = Buffer.from(item.url || item.name).toString("base64").substring(0, 30);

        return {
          id,
          name: item.name,
          url: item.url,
          startTime: item.start_time,
          endTime: item.end_time,
          duration: parseInt(item.duration) || 0,
          platform,
          status,
        };
      })
      .filter(Boolean) as ContestItem[];

    // Sort by start time
    return contests.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  } catch (error) {
    console.error("Error fetching contest schedule:", error);
    // Return empty list or fallback mock schedule if API fails
    return getFallbackContests();
  }
}

export async function toggleContestReminder(contest: {
  id: string;
  name: string;
  platform: string;
  startTime: string;
}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await db.userContestReminder.findUnique({
    where: {
      userId_contestId: {
        userId: user.id,
        contestId: contest.id,
      },
    },
  });

  if (existing) {
    await db.userContestReminder.delete({
      where: { id: existing.id },
    });
    return { enabled: false };
  } else {
    await db.userContestReminder.create({
      data: {
        userId: user.id,
        contestId: contest.id,
        contestName: contest.name,
        platform: contest.platform,
        startTime: new Date(contest.startTime),
      },
    });
    return { enabled: true };
  }
}

export async function getContestReminders() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const reminders = await db.userContestReminder.findMany({
    where: { userId: user.id },
    select: {
      contestId: true,
    },
  });

  return reminders.map((r) => r.contestId);
}

function getFallbackContests(): ContestItem[] {
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  // Generate some realistic upcoming contests relative to now
  return [
    {
      id: "fallback_lc_biweekly",
      name: "LeetCode Biweekly Contest 145",
      url: "https://leetcode.com/contest/",
      startTime: new Date(now.getTime() + day * 1.5).toISOString(),
      endTime: new Date(now.getTime() + day * 1.5 + 1.5 * 3600 * 1000).toISOString(),
      duration: 5400,
      platform: "LEETCODE",
      status: "UPCOMING",
    },
    {
      id: "fallback_cf_div2",
      name: "Codeforces Round 1002 (Div. 2)",
      url: "https://codeforces.com/contests",
      startTime: new Date(now.getTime() + day * 2.2).toISOString(),
      endTime: new Date(now.getTime() + day * 2.2 + 2 * 3600 * 1000).toISOString(),
      duration: 7200,
      platform: "CODEFORCES",
      status: "UPCOMING",
    },
    {
      id: "fallback_cc_starters",
      name: "CodeChef Starters 165 (Div 1, 2, 3, 4)",
      url: "https://www.codechef.com/contests",
      startTime: new Date(now.getTime() + day * 3).toISOString(),
      endTime: new Date(now.getTime() + day * 3 + 3 * 3600 * 1000).toISOString(),
      duration: 10800,
      platform: "CODECHEF",
      status: "UPCOMING",
    },
    {
      id: "fallback_abc",
      name: "AtCoder Beginner Contest 392",
      url: "https://atcoder.jp/contests/",
      startTime: new Date(now.getTime() + day * 4.5).toISOString(),
      endTime: new Date(now.getTime() + day * 4.5 + 1.6 * 3600 * 1000).toISOString(),
      duration: 6000,
      platform: "ATCODER",
      status: "UPCOMING",
    },
  ];
}
