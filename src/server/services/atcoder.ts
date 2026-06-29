interface AtCoderStats {
  rating: number | null;
  rank: number | null;
}

export async function fetchAtCoderStats(username: string): Promise<AtCoderStats | null> {
  try {
    const res = await fetch(`https://atcoder.jp/users/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`AtCoder page returned status ${res.status}`);
    }

    const html = await res.text();

    // Extract Rating
    // Typically: <tr><th class="no-break">Rating</th><td><span class="user-green">1042</span></td></tr>
    const ratingMatch = html.match(/Rating<\/th>\s*<td>\s*<span[^>]*>(\d+)<\/span>/i) ||
                        html.match(/Rating<\/th>[\s\S]*?(\d+)<\/span>/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;

    // Extract Rank
    // Typically: <tr><th class="no-break">Rank</th><td>3821st</td></tr> or <tr><th class="no-break">Rank</th><td>421</td></tr>
    const rankMatch = html.match(/Rank<\/th>\s*<td>\s*(\d+)/i) ||
                      html.match(/Rank<\/th>[\s\S]*?<td>\s*(\d+)/i);
    const rank = rankMatch ? parseInt(rankMatch[1]) : null;

    return {
      rating,
      rank,
    };
  } catch (error) {
    console.error("Error fetching AtCoder stats:", error);
    return null;
  }
}
