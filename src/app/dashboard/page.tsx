"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getCodingProfile, getUserUsernames, getActivityLogs } from "@/server/actions/sync";
import { 
  Loader2, 
  AlertTriangle, 
  Play, 
  Code2, 
  Star, 
  GitPullRequest, 
  GitCommit, 
  Users, 
  Clock,
  Award,
  Terminal,
  Layers,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/shared/BrandIcons";

interface ProfileData {
  leetcodeSolved: number;
  leetcodeEasy: number;
  leetcodeMedium: number;
  leetcodeHard: number;
  leetcodeRating: number | null;
  leetcodeGlobalRank: number | null;
  githubRepoCount: number;
  githubFollowers: number;
  githubStars: number;
  githubCommits: number;
  githubPRs: number;
  githubIssues: number;
  codeforcesRating: number | null;
  codeforcesMaxRating: number | null;
  codeforcesRank: string | null;
  codeforcesSolved: number;
  codechefRating: number | null;
  codechefStars: string | null;
  codechefGlobalRank: number | null;
  geeksforgeeksSolved: number;
  bytecodeSolved: number;
}

interface UsernamesData {
  leetcodeUsername: string | null;
  githubUsername: string | null;
  codeforcesUsername: string | null;
  codechefUsername: string | null;
  geeksforgeeksUsername: string | null;
  bytecodeUsername: string | null;
}

interface ActivityLogItem {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [usernames, setUsernames] = useState<UsernamesData | null>(null);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profileRes, usernamesRes, logsRes] = await Promise.all([
          getCodingProfile(),
          getUserUsernames(),
          getActivityLogs(),
        ]);
        setProfile(profileRes as any);
        setUsernames(usernamesRes as any);
        setLogs(logsRes as any);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (!sessionPending && session) {
      loadDashboardData();
    }
  }, [session, sessionPending]);

  if (sessionPending || loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasConnectedProfiles = 
    usernames?.leetcodeUsername || 
    usernames?.githubUsername || 
    usernames?.codeforcesUsername || 
    usernames?.codechefUsername || 
    usernames?.geeksforgeeksUsername || 
    usernames?.bytecodeUsername;

  // Aggregate total solved problems
  const totalCPProblems = 
    (profile?.leetcodeSolved || 0) + 
    (profile?.codeforcesSolved || 0) + 
    (profile?.geeksforgeeksSolved || 0) + 
    (profile?.bytecodeSolved || 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl glass border border-white/5 bg-gradient-to-r from-violet-950/20 to-fuchsia-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome back, {session?.user?.name || "Developer"}! 👋</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Here is a summary of your coding progress and synced profiles.</p>
        </div>
        {hasConnectedProfiles && (
          <div className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground font-mono">
            Status: <span className="text-green-400 font-semibold">Synced</span>
          </div>
        )}
      </div>

      {/* Sync Warning Banner */}
      {!hasConnectedProfiles && (
        <div className="p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Profiles Not Connected</h3>
              <p className="text-xs text-muted-foreground mt-1">Connect your coding handles in settings to populate dashboards, charts, and metrics.</p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1.5 text-xs font-bold text-black bg-yellow-500 hover:bg-yellow-600 transition-all px-4 py-2.5 rounded-xl shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            Connect Profiles
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aggregated Solved</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalCPProblems}</span>
            <span className="text-xs text-muted-foreground">problems</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Across LeetCode, CF, GFG & ByteCode</p>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GitHub Commits</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{profile?.githubCommits || 0}</span>
            <span className="text-xs text-muted-foreground">total</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Contributions from public repos</p>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Stars</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{profile?.githubStars || 0}</span>
            <span className="text-xs text-muted-foreground">stars</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Earned across public repositories</p>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Codeforces Rating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{profile?.codeforcesRating || "N/A"}</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold text-primary">
            {profile?.codeforcesRank ? profile.codeforcesRank : "Unrated Profile"}
          </p>
        </div>
      </div>

      {hasConnectedProfiles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LeetCode Solved Widget */}
          {usernames?.leetcodeUsername && (
            <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="h-4.5 w-4.5 text-yellow-500" />
                  LeetCode Statistics
                </h3>
                <span className="text-[10px] font-semibold text-muted-foreground">@{usernames.leetcodeUsername}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-2xl font-extrabold text-white">{profile?.leetcodeSolved || 0}</span>
                  <p className="text-[10px] text-muted-foreground">Total Solved</p>
                </div>
                {/* Stats Breakdown */}
                <div className="flex-grow max-w-xs space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-green-400 font-semibold">Easy</span>
                      <span className="text-white font-medium">{profile?.leetcodeEasy || 0}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-green-400 h-full rounded-full" style={{ width: `${((profile?.leetcodeEasy || 0) / (profile?.leetcodeSolved || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-yellow-400 font-semibold">Medium</span>
                      <span className="text-white font-medium">{profile?.leetcodeMedium || 0}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${((profile?.leetcodeMedium || 0) / (profile?.leetcodeSolved || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-red-400 font-semibold">Hard</span>
                      <span className="text-white font-medium">{profile?.leetcodeHard || 0}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full" style={{ width: `${((profile?.leetcodeHard || 0) / (profile?.leetcodeSolved || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Metrics Widget */}
          {usernames?.githubUsername && (
            <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GithubIcon className="h-4.5 w-4.5 text-violet-400" />
                  GitHub Contribution
                </h3>
                <span className="text-[10px] font-semibold text-muted-foreground">@{usernames.githubUsername}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Stars</span>
                    <span className="text-sm font-bold text-white">{profile?.githubStars || 0}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                  <GitPullRequest className="h-5 w-5 text-green-400 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">PRs</span>
                    <span className="text-sm font-bold text-white">{profile?.githubPRs || 0}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                  <GitCommit className="h-5 w-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Commits</span>
                    <span className="text-sm font-bold text-white">{profile?.githubCommits || 0}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-3">
                  <Users className="h-5 w-5 text-pink-400 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Followers</span>
                    <span className="text-sm font-bold text-white">{profile?.githubFollowers || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Codeforces Widget */}
          {usernames?.codeforcesUsername && (
            <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-red-400" />
                  Codeforces Sync
                </h3>
                <span className="text-[10px] font-semibold text-muted-foreground">@{usernames.codeforcesUsername}</span>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Solved Problems</span>
                  <span className="text-white font-bold">{profile?.codeforcesSolved || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current Rating</span>
                  <span className="text-white font-bold">{profile?.codeforcesRating || "Unrated"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Peak Rating</span>
                  <span className="text-white font-bold">{profile?.codeforcesMaxRating || "Unrated"}</span>
                </div>
              </div>
            </div>
          )}

          {/* CodeChef Widget */}
          {usernames?.codechefUsername && (
            <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                  CodeChef Profile
                </h3>
                <span className="text-[10px] font-semibold text-muted-foreground">@{usernames.codechefUsername}</span>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current Rating</span>
                  <span className="text-white font-bold">{profile?.codechefRating || "Unrated"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Star Ranking</span>
                  <span className="text-primary font-extrabold">{profile?.codechefStars || "1★"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Global Rank</span>
                  <span className="text-white font-bold">
                    {profile?.codechefGlobalRank ? `#${profile.codechefGlobalRank}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Practice Portals Widget (GFG & ByteCode) */}
          {(usernames?.geeksforgeeksUsername || usernames?.bytecodeUsername) && (
            <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-sky-400" />
                  Practice Platforms
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                {usernames.geeksforgeeksUsername && (
                  <div className="flex justify-between text-xs items-center">
                    <div>
                      <span className="text-white font-medium block">GeeksforGeeks</span>
                      <span className="text-[9px] text-muted-foreground">@{usernames.geeksforgeeksUsername}</span>
                    </div>
                    <span className="text-sm font-extrabold text-white">{profile?.geeksforgeeksSolved || 0} Solved</span>
                  </div>
                )}
                {usernames.bytecodeUsername && (
                  <div className="flex justify-between text-xs items-center">
                    <div>
                      <span className="text-white font-medium block">ByteCode</span>
                      <span className="text-[9px] text-muted-foreground">@{usernames.bytecodeUsername}</span>
                    </div>
                    <span className="text-sm font-extrabold text-white">{profile?.bytecodeSolved || 0} Solved</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sync & Logs Widget */}
          <div className="glass border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Recent Activities
            </h3>
            
            <div className="space-y-3.5">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs font-semibold text-white leading-tight">{log.description}</p>
                      <span className="text-[9px] text-muted-foreground mt-0.5 block">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No sync activities logged yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
