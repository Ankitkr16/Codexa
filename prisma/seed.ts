import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding started...");

  try {
    // 1. Check or Create Blind 75 Sheet
    let blind75 = await db.codingSheet.findFirst({
      where: { title: "Blind 75", isCustom: false },
    });

    if (!blind75) {
      blind75 = await db.codingSheet.create({
        data: {
          title: "Blind 75",
          description: "The classic collection of 75 essential LeetCode questions to master coding interviews.",
          isCustom: false,
      },
    });
  }

  const blind75Problems = [
    { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "EASY", platform: "LEETCODE", tags: ["Arrays & Hashing"] },
    { title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", difficulty: "EASY", platform: "LEETCODE", tags: ["Arrays & Hashing"] },
    { title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays & Hashing"] },
    { title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "EASY", platform: "LEETCODE", tags: ["Arrays & Hashing"] },
    { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Two Pointers"] },
    { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Two Pointers"] },
    { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "EASY", platform: "LEETCODE", tags: ["Stack"] },
    { title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "EASY", platform: "LEETCODE", tags: ["Linked List"] },
    { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "EASY", platform: "LEETCODE", tags: ["Linked List"] },
    { title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "EASY", platform: "LEETCODE", tags: ["Trees"] },
    { title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "EASY", platform: "LEETCODE", tags: ["Trees"] },
    { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "EASY", platform: "LEETCODE", tags: ["Dynamic Programming"] },
  ];

  for (const prob of blind75Problems) {
    const existing = await db.problem.findFirst({
      where: { sheetId: blind75.id, title: prob.title },
    });

    if (!existing) {
      await db.problem.create({
        data: {
          sheetId: blind75.id,
          title: prob.title,
          url: prob.url,
          difficulty: prob.difficulty,
          platform: prob.platform,
          tags: prob.tags,
        },
      });
    }
  }

  // 2. Check or Create Strivers SDE Sheet
  let strivers = await db.codingSheet.findFirst({
    where: { title: "Strivers SDE Sheet", isCustom: false },
  });

  if (!strivers) {
    strivers = await db.codingSheet.create({
      data: {
        title: "Strivers SDE Sheet",
        description: "Highly curated list of 180+ questions for product-based company interview preparation.",
        isCustom: false,
      },
    });
  }

  const striverProblems = [
    { title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays"] },
    { title: "Pascal's Triangle", url: "https://leetcode.com/problems/pascals-triangle/", difficulty: "EASY", platform: "LEETCODE", tags: ["Arrays"] },
    { title: "Next Permutation", url: "https://leetcode.com/problems/next-permutation/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays"] },
    { title: "Kadane's Algorithm", url: "https://leetcode.com/problems/maximum-subarray/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays"] },
    { title: "Sort an Array of 0s, 1s, and 2s", url: "https://leetcode.com/problems/sort-colors/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays"] },
    { title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/", difficulty: "MEDIUM", platform: "LEETCODE", tags: ["Arrays"] },
  ];

  for (const prob of striverProblems) {
    const existing = await db.problem.findFirst({
      where: { sheetId: strivers.id, title: prob.title },
    });

    if (!existing) {
      await db.problem.create({
        data: {
          sheetId: strivers.id,
          title: prob.title,
          url: prob.url,
          difficulty: prob.difficulty,
          platform: prob.platform,
          tags: prob.tags,
        },
      });
    }
  }

  console.log("Seeding completed successfully!");
  } catch (error: any) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection") || error.message?.includes("Can't reach database")) {
      console.warn("\n⚠️ WARNING: Database connection failed (ECONNREFUSED).");
      console.warn("Please verify that your PostgreSQL database is running and DATABASE_URL in `.env` is configured correctly.");
      console.warn("Seeding has been skipped for now, but your app structure is fully ready!\n");
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await db.$disconnect();
    } catch (e) {}
  });
