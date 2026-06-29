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

export interface CalendarEvent {
  id: string;
  type: "REVISION" | "CONTEST_REMINDER" | "PROBLEM_SOLVED";
  title: string;
  date: string; // ISO Date String (yyyy-mm-dd)
  url?: string;
  platform?: string;
}

export async function getCalendarSchedule(): Promise<CalendarEvent[]> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const events: CalendarEvent[] = [];

  // 1. Fetch Problem Revisions
  const revisions = await db.userProblemProgress.findMany({
    where: {
      userId: user.id,
      nextRevisionDate: { not: null },
    },
    include: {
      problem: {
        select: {
          title: true,
          url: true,
          platform: true,
        },
      },
    },
  });

  revisions.forEach((rev) => {
    if (rev.nextRevisionDate) {
      events.push({
        id: `rev-${rev.id}`,
        type: "REVISION",
        title: `Review: ${rev.problem.title}`,
        date: rev.nextRevisionDate.toISOString().split("T")[0],
        url: rev.problem.url,
        platform: rev.problem.platform,
      });
    }
  });

  // 2. Fetch User Contest Reminders
  const reminders = await db.userContestReminder.findMany({
    where: { userId: user.id },
  });

  reminders.forEach((rem) => {
    events.push({
      id: `rem-${rem.id}`,
      type: "CONTEST_REMINDER",
      title: `Contest: ${rem.contestName}`,
      date: rem.startTime.toISOString().split("T")[0],
      platform: rem.platform,
    });
  });

  // 3. Fetch Solved Problem Logs
  const activityLogs = await db.activityLog.findMany({
    where: {
      userId: user.id,
      type: "PROBLEM_SOLVED",
    },
  });

  activityLogs.forEach((log) => {
    events.push({
      id: `log-${log.id}`,
      type: "PROBLEM_SOLVED",
      title: log.description,
      date: log.createdAt.toISOString().split("T")[0],
    });
  });

  return events;
}
