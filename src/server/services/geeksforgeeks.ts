interface GeeksforGeeksStats {
  solved: number;
}

export async function fetchGeeksforGeeksStats(username: string): Promise<GeeksforGeeksStats | null> {
  try {
    const res = await fetch(`https://www.geeksforgeeks.org/user/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`GeeksforGeeks page returned status ${res.status}`);
    }

    const html = await res.text();

    // Extract Problems Solved
    const solvedMatch = html.match(/<span>Problems Solved:<\/span>[\s\S]*?(\d+)/) || 
                        html.match(/problem_solved_value[\s\S]*?(\d+)/) || 
                        html.match(/Problems Solved[\s\S]*?(\d+)/) || 
                        html.match(/"score_card_value">(\d+)/);
                        
    const solved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    return {
      solved,
    };
  } catch (error) {
    console.error("Error fetching GeeksforGeeks stats:", error);
    return null;
  }
}
