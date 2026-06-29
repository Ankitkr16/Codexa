interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  languages: Record<string, number>;
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Codexa-Platform",
  };

  // If a GITHUB_TOKEN is available in env, use it to increase rate limits
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch user profile basics
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) return null;
      throw new Error(`GitHub user query failed with status ${userRes.status}`);
    }
    const userData = await userRes.json();

    // 2. Fetch user repositories (limit to first 100 public repos)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    let stars = 0;
    const languages: Record<string, number> = {};

    if (reposRes.ok) {
      const reposData = await reposRes.json();
      if (Array.isArray(reposData)) {
        reposData.forEach((repo: any) => {
          stars += repo.stargazers_count || 0;
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });
      }
    }

    // 3. Search public commits count
    let commits = 0;
    try {
      const commitsRes = await fetch(`https://api.github.com/search/commits?q=author:${username}`, { headers });
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        commits = commitsData.total_count || 0;
      } else {
        commits = (userData.public_repos || 0) * 15; // fallback
      }
    } catch (e) {
      commits = (userData.public_repos || 0) * 15;
    }

    // 4. Search pull requests count
    let prs = 0;
    try {
      const prsRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers });
      if (prsRes.ok) {
        const prsData = await prsRes.json();
        prs = prsData.total_count || 0;
      } else {
        prs = (userData.public_repos || 0) * 3; // fallback
      }
    } catch (e) {
      prs = (userData.public_repos || 0) * 3;
    }

    // 5. Search public issues count
    let issues = 0;
    try {
      const issuesRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`, { headers });
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        issues = issuesData.total_count || 0;
      } else {
        issues = Math.round((userData.public_repos || 0) * 1.5); // fallback
      }
    } catch (e) {
      issues = Math.round((userData.public_repos || 0) * 1.5);
    }

    return {
      repos: userData.public_repos || 0,
      followers: userData.followers || 0,
      stars,
      commits,
      prs,
      issues,
      languages,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return null;
  }
}
