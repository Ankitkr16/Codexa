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

export interface LeaderboardUser {
  id: string;
  name: string;
  image: string | null;
  leetcodeSolved: number;
  codeforcesSolved: number;
  geeksforgeeksSolved: number;
  bytecodeSolved: number;
  totalSolved: number;
  cfRating: number | null;
}

export async function getGlobalLeaderboard(): Promise<LeaderboardUser[]> {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      codingProfile: {
        select: {
          leetcodeSolved: true,
          codeforcesSolved: true,
          geeksforgeeksSolved: true,
          bytecodeSolved: true,
          codeforcesRating: true,
        },
      },
    },
  });

  const parsed = users.map((u) => {
    const cp = u.codingProfile;
    const leetcode = cp?.leetcodeSolved || 0;
    const cf = cp?.codeforcesSolved || 0;
    const gfg = cp?.geeksforgeeksSolved || 0;
    const bytecode = cp?.bytecodeSolved || 0;
    const total = leetcode + cf + gfg + bytecode;

    return {
      id: u.id,
      name: u.name,
      image: u.image,
      leetcodeSolved: leetcode,
      codeforcesSolved: cf,
      geeksforgeeksSolved: gfg,
      bytecodeSolved: bytecode,
      totalSolved: total,
      cfRating: cp?.codeforcesRating || null,
    };
  });

  // Sort by totalSolved descending
  return parsed.sort((a, b) => b.totalSolved - a.totalSolved);
}

export async function getFriendsLeaderboard(): Promise<LeaderboardUser[]> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch friendships where status is ACCEPTED
  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { senderId: user.id, status: "ACCEPTED" },
        { receiverId: user.id, status: "ACCEPTED" },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          codingProfile: {
            select: {
              leetcodeSolved: true,
              codeforcesSolved: true,
              geeksforgeeksSolved: true,
              bytecodeSolved: true,
              codeforcesRating: true,
            },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          codingProfile: {
            select: {
              leetcodeSolved: true,
              codeforcesSolved: true,
              geeksforgeeksSolved: true,
              bytecodeSolved: true,
              codeforcesRating: true,
            },
          },
        },
      },
    },
  });

  const friendMap = new Map<string, any>();

  // Add current user to their friends leaderboard
  const currentUserProfile = await db.user.findUnique({
    where: { id: user.id },
    include: { codingProfile: true },
  });
  if (currentUserProfile) {
    const cp = currentUserProfile.codingProfile;
    const leetcode = cp?.leetcodeSolved || 0;
    const cf = cp?.codeforcesSolved || 0;
    const gfg = cp?.geeksforgeeksSolved || 0;
    const bytecode = cp?.bytecodeSolved || 0;
    const total = leetcode + cf + gfg + bytecode;

    friendMap.set(user.id, {
      id: user.id,
      name: currentUserProfile.name,
      image: currentUserProfile.image,
      leetcodeSolved: leetcode,
      codeforcesSolved: cf,
      geeksforgeeksSolved: gfg,
      bytecodeSolved: bytecode,
      totalSolved: total,
      cfRating: cp?.codeforcesRating || null,
    });
  }

  friendships.forEach((f) => {
    const friend = f.senderId === user.id ? f.receiver : f.sender;
    const cp = friend.codingProfile;
    const leetcode = cp?.leetcodeSolved || 0;
    const cf = cp?.codeforcesSolved || 0;
    const gfg = cp?.geeksforgeeksSolved || 0;
    const bytecode = cp?.bytecodeSolved || 0;
    const total = leetcode + cf + gfg + bytecode;

    friendMap.set(friend.id, {
      id: friend.id,
      name: friend.name,
      image: friend.image,
      leetcodeSolved: leetcode,
      codeforcesSolved: cf,
      geeksforgeeksSolved: gfg,
      bytecodeSolved: bytecode,
      totalSolved: total,
      cfRating: cp?.codeforcesRating || null,
    });
  });

  return Array.from(friendMap.values()).sort((a, b) => b.totalSolved - a.totalSolved);
}

export async function sendFriendRequest(emailOrName: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Find user to add
  const receiver = await db.user.findFirst({
    where: {
      OR: [
        { email: emailOrName },
        { name: emailOrName },
      ],
    },
  });

  if (!receiver) {
    throw new Error("User not found");
  }

  if (receiver.id === user.id) {
    throw new Error("You cannot send a friend request to yourself");
  }

  // Check if friendship already exists
  const existing = await db.friendship.findFirst({
    where: {
      OR: [
        { senderId: user.id, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: user.id },
      ],
    },
  });

  if (existing) {
    throw new Error(`Friend request status: ${existing.status}`);
  }

  return await db.friendship.create({
    data: {
      senderId: user.id,
      receiverId: receiver.id,
      status: "PENDING",
    },
  });
}

export async function getFriendRequests() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return await db.friendship.findMany({
    where: {
      receiverId: user.id,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function respondToFriendRequest(requestId: string, status: "ACCEPTED" | "DECLINED") {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const request = await db.friendship.findUnique({
    where: { id: requestId },
  });

  if (!request || request.receiverId !== user.id) {
    throw new Error("Request not found or unauthorized");
  }

  if (status === "ACCEPTED") {
    return await db.friendship.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });
  } else {
    return await db.friendship.delete({
      where: { id: requestId },
    });
  }
}
