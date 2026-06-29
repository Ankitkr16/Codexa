interface CodeforcesStats {
  rating: number | null;
  maxRating: number | null;
  rank: string;
  solved: number;
}

export async function fetchCodeforcesStats(username: string): Promise<CodeforcesStats | null> {
  try {
    // 1. Fetch user base info
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    if (!infoRes.ok) return null;
    const infoData = await infoRes.json();
    if (infoData.status !== "OK" || !infoData.result?.[0]) return null;

    const userInfo = infoData.result[0];

    // 2. Fetch submissions to calculate unique solved problems
    let solved = 0;
    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`);
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === "OK") {
        const solvedProblems = new Set<string>();
        statusData.result.forEach((submission: any) => {
          if (submission.verdict === "OK" && submission.problem) {
            const key = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(key);
          }
        });
        solved = solvedProblems.size;
      }
    }

    return {
      rating: userInfo.rating ? Math.round(userInfo.rating) : null,
      maxRating: userInfo.maxRating ? Math.round(userInfo.maxRating) : null,
      rank: userInfo.rank || "unranked",
      solved,
    };
  } catch (error) {
    console.error("Error fetching Codeforces stats:", error);
    return null;
  }
}
