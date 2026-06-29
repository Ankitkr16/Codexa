"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

async function verifyAdminUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    throw new Error("Forbidden: Admin privileges required");
  }

  return session.user;
}

export async function getAdminStats() {
  await verifyAdminUser();

  const [totalUsers, totalSheets, totalProblems, totalLogs] = await Promise.all([
    db.user.count(),
    db.codingSheet.count(),
    db.problem.count(),
    db.activityLog.count(),
  ]);

  const activeSyncs = await db.activityLog.count({
    where: { type: "SYNC_COMPLETED" },
  });

  return {
    totalUsers,
    totalSheets,
    totalProblems,
    totalLogs,
    activeSyncs,
  };
}

export async function getAllUsers() {
  await verifyAdminUser();

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      githubUsername: true,
      leetcodeUsername: true,
      codeforcesUsername: true,
      codechefUsername: true,
      atcoderUsername: true,
      geeksforgeeksUsername: true,
      bytecodeUsername: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const admin = await verifyAdminUser();
  if (targetUserId === admin.id) {
    throw new Error("You cannot change your own admin role status");
  }

  return await db.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });
}

export async function deleteUserAccount(targetUserId: string) {
  const admin = await verifyAdminUser();
  if (targetUserId === admin.id) {
    throw new Error("You cannot delete your own admin account");
  }

  return await db.user.delete({
    where: { id: targetUserId },
  });
}

export async function getSystemLogs() {
  await verifyAdminUser();

  const logs = await db.activityLog.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return logs;
}
