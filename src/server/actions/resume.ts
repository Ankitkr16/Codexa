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

export async function saveResume(data: {
  id?: string;
  title: string;
  content: any;
}) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (data.id) {
    return await db.resume.update({
      where: { id: data.id, userId: user.id },
      data: {
        title: data.title,
        content: data.content,
      },
    });
  } else {
    return await db.resume.create({
      data: {
        userId: user.id,
        title: data.title,
        content: data.content,
      },
    });
  }
}

export async function getResume() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const resume = await db.resume.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return resume;
}

export async function deleteResume(id: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return await db.resume.delete({
    where: { id: id, userId: user.id },
  });
}
