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

export async function updateProfileBio(bio: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return await db.user.update({
    where: { id: user.id },
    data: { bio },
  });
}

export async function getPublicProfile(userId: string) {
  // Fetch user basics
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      githubUsername: true,
      leetcodeUsername: true,
      codeforcesUsername: true,
      codechefUsername: true,
      atcoderUsername: true,
      geeksforgeeksUsername: true,
      bytecodeUsername: true,
    },
  });

  if (!user) {
    return null;
  }

  // Fetch coding profile stats
  const codingProfile = await db.codingProfile.findUnique({
    where: { userId: user.id },
  });

  // Fetch their latest resume for experience, projects, skills, education
  const resume = await db.resume.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      content: true,
    },
  });

  return {
    user,
    codingProfile,
    resumeContent: resume?.content || null,
  };
}
