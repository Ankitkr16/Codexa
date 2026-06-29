"use client";

import { useEffect, useState } from "react";
import { getCodingProfile, getUserUsernames } from "@/server/actions/sync";
import { Loader2, AlertTriangle, Star, BookOpen } from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import Link from "next/link";

interface ProfileData {
  githubRepoCount: number;
  githubFollowers: number;
  githubStars: number;
  githubCommits: number;
  githubPRs: number;
  githubIssues: number;
}

export default function GitHubPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [githubUser, setGithubUser] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, usernamesRes] = await Promise.all([
          getCodingProfile(),
          getUserUsernames(),
        ]);
        setProfile(profileRes as any);
        setGithubUser(usernamesRes.githubUsername);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!githubUser) {
    return (
      <div className="p-8 max-w-md mx-auto text-center glass border border-white/5 rounded-2xl space-y-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">GitHub Not Connected</h3>
        <p className="text-xs text-muted-foreground">Please connect your GitHub username in settings to view detailed contribution analytics.</p>
        <Link href="/dashboard/settings" className="inline-block text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-xl">
          Connect Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
          <GithubIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">GitHub Analytics</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Showing public repository insights for @{githubUser}</p>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
          <span className="text-xs text-muted-foreground block">Public Repositories</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.githubRepoCount || 0}</span>
        </div>
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
          <span className="text-xs text-muted-foreground block">Total Stars</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.githubStars || 0}</span>
        </div>
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
          <span className="text-xs text-muted-foreground block">Total Commits</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.githubCommits || 0}</span>
        </div>
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
          <span className="text-xs text-muted-foreground block">Followers</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.githubFollowers || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pull Requests & Issues */}
        <div className="p-6 rounded-2xl glass border border-white/5 space-y-4 text-left">
          <h3 className="text-sm font-bold text-white">Collaboration Metrics</h3>
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Pull Requests Submitted</span>
                <span className="text-white font-bold">{profile?.githubPRs || 0}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(((profile?.githubPRs || 0) / 100) * 100, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Issues Raised</span>
                <span className="text-white font-bold">{profile?.githubIssues || 0}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: `${Math.min(((profile?.githubIssues || 0) / 100) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-6 rounded-2xl glass border border-white/5 flex flex-col justify-between space-y-4 text-left">
          <h3 className="text-sm font-bold text-white">Repository Health</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Codexa automatically parses repository statistics to assess repository maintenance, language usage diversity, and code contributions.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{profile?.githubStars || 0} Stars</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{profile?.githubRepoCount || 0} Repos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
