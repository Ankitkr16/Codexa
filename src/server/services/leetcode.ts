interface LeetCodeStats {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating?: number;
  globalRank?: number;
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  const url = "https://leetcode.com/graphql";
  
  const query = `
    query getUserStats($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API returned status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.matchedUser) {
      return null;
    }

    const submissionNums = data.data.matchedUser.submitStats.acSubmissionNum;
    
    let solved = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    submissionNums.forEach((item: { difficulty: string; count: number }) => {
      if (item.difficulty === "All") solved = item.count;
      if (item.difficulty === "Easy") easy = item.count;
      if (item.difficulty === "Medium") medium = item.count;
      if (item.difficulty === "Hard") hard = item.count;
    });

    const contestRanking = data.data.userContestRanking;
    const rating = contestRanking?.rating ? Math.round(contestRanking.rating) : undefined;
    const globalRank = contestRanking?.globalRanking || undefined;

    return {
      solved,
      easy,
      medium,
      hard,
      rating,
      globalRank,
    };
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return null;
  }
}
