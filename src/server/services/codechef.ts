interface CodeChefStats {
  rating: number | null;
  stars: string;
  globalRank: number | null;
}

export async function fetchCodeChefStats(username: string): Promise<CodeChefStats | null> {
  try {
    const res = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`CodeChef page returned status ${res.status}`);
    }

    const html = await res.text();

    // Extract Rating
    const ratingMatch = html.match(/class="rating-number">(\d+)/) || html.match(/rating-number">(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;

    // Extract Stars
    const starsMatch = html.match(/(\d+)★/) || html.match(/"rating-star">.*?(\d+)★/) || html.match(/rating-star">.*?<span>(\d+)/);
    const stars = starsMatch ? `${starsMatch[1]}★` : "1★";

    // Extract Global Rank
    const rankMatch = html.match(/class="global-rank">[\s\S]*?<a>(\d+)<\/a>/) || html.match(/global-rank font-bold">[\s\S]*?(\d+)/);
    const globalRank = rankMatch ? parseInt(rankMatch[1]) : null;

    return {
      rating,
      stars,
      globalRank,
    };
  } catch (error) {
    console.error("Error fetching CodeChef stats:", error);
    return null;
  }
}
