"use client";

import { useEffect, useState } from "react";
import { getCodingProfile } from "@/server/actions/sync";
import { Loader2, Trophy, Star, ShieldCheck, Flame, GitCommit, Code, Compass } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  leetcodeSolved: number;
  leetcodeEasy: number;
  leetcodeMedium: number;
  leetcodeHard: number;
  leetcodeRating: number | null;
  codeforcesRating: number | null;
  codeforcesSolved: number;
  codechefRating: number | null;
  codechefStars: string | null;
  atcoderRating: number | null;
  geeksforgeeksSolved: number;
  bytecodeSolved: number;
  githubCommits: number;
  githubPRs: number;
  githubStars: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  color: string;
}

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getCodingProfile();
        setProfile(res as any);
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

  // Calculate achievements based on user metrics
  const leetcodeSolved = profile?.leetcodeSolved || 0;
  const cfSolved = profile?.codeforcesSolved || 0;
  const cfRating = profile?.codeforcesRating || 0;
  const commits = profile?.githubCommits || 0;
  const prs = profile?.githubPRs || 0;
  const stars = profile?.githubStars || 0;
  const ccRating = profile?.codechefRating || 0;

  // Platforms count
  let connectedPlatforms = 0;
  if (profile?.leetcodeSolved) connectedPlatforms++;
  if (profile?.codeforcesSolved) connectedPlatforms++;
  if (profile?.codechefRating) connectedPlatforms++;
  if (profile?.atcoderRating) connectedPlatforms++;
  if (profile?.geeksforgeeksSolved) connectedPlatforms++;
  if (profile?.bytecodeSolved) connectedPlatforms++;
  if (profile?.githubCommits) connectedPlatforms++;

  const list: Achievement[] = [
    {
      id: "lc_10",
      title: "LeetCode Explorer",
      description: "Solve 10+ problems on LeetCode to build fundamentals.",
      icon: Code,
      currentValue: leetcodeSolved,
      targetValue: 10,
      unit: "solved",
      unlocked: leetcodeSolved >= 10,
      color: "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 text-yellow-400",
    },
    {
      id: "lc_100",
      title: "LeetCode Specialist",
      description: "Solve 100+ problems on LeetCode.",
      icon: Trophy,
      currentValue: leetcodeSolved,
      targetValue: 100,
      unit: "solved",
      unlocked: leetcodeSolved >= 100,
      color: "from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-400",
    },
    {
      id: "lc_500",
      title: "LeetCode Wizard",
      description: "Solve 500+ problems on LeetCode.",
      icon: Star,
      currentValue: leetcodeSolved,
      targetValue: 500,
      unit: "solved",
      unlocked: leetcodeSolved >= 500,
      color: "from-red-500/10 to-red-600/10 border-red-500/20 text-red-400",
    },
    {
      id: "cf_specialist",
      title: "Codeforces Specialist",
      description: "Reach Codeforces contest rating of 1400+.",
      icon: ShieldCheck,
      currentValue: cfRating,
      targetValue: 1400,
      unit: "rating",
      unlocked: cfRating >= 1400,
      color: "from-cyan-500/10 to-cyan-600/10 border-cyan-500/20 text-cyan-400",
    },
    {
      id: "github_100",
      title: "Commit Machine",
      description: "Log 100+ commits to public repositories.",
      icon: GitCommit,
      currentValue: commits,
      targetValue: 100,
      unit: "commits",
      unlocked: commits >= 100,
      color: "from-violet-500/10 to-violet-600/10 border-violet-500/20 text-violet-400",
    },
    {
      id: "github_prs",
      title: "PR Prodigy",
      description: "Log 10+ public pull requests.",
      icon: Compass,
      currentValue: prs,
      targetValue: 10,
      unit: "PRs",
      unlocked: prs >= 10,
      color: "from-fuchsia-500/10 to-fuchsia-600/10 border-fuchsia-500/20 text-fuchsia-400",
    },
    {
      id: "platforms_3",
      title: "Polyglot Coder",
      description: "Connect 3+ development & coding platforms in settings.",
      icon: Flame,
      currentValue: connectedPlatforms,
      targetValue: 3,
      unit: "platforms",
      unlocked: connectedPlatforms >= 3,
      color: "from-green-500/10 to-green-600/10 border-green-500/20 text-green-400",
    },
    {
      id: "cc_star",
      title: "CodeChef Star Coder",
      description: "Reach CodeChef contest rating of 1600+.",
      icon: Trophy,
      currentValue: ccRating,
      targetValue: 1600,
      unit: "rating",
      unlocked: ccRating >= 1600,
      color: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400",
    },
  ];

  const unlockedCount = list.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Achievements & Badges</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Unlock milestones by syncing profiles and completing challenges
            </p>
          </div>
        </div>

        {/* Counter */}
        <div className="px-4 py-2.5 rounded-xl bg-white/2 border border-white/5 text-xs text-muted-foreground font-semibold flex items-center gap-2">
          <span>Unlocked:</span>
          <span className="text-white font-extrabold text-sm">{unlockedCount} / {list.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((badge) => {
          const IconComponent = badge.icon;
          const percent = Math.min(Math.round((badge.currentValue / badge.targetValue) * 100), 100);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-2xl border bg-gradient-to-br flex flex-col justify-between gap-4 text-left transition-all ${
                badge.unlocked
                  ? `${badge.color} shadow-[0_4px_20px_rgba(255,255,255,0.02)]`
                  : "from-zinc-950/20 to-zinc-900/20 border-white/5 opacity-50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className={`p-2.5 rounded-xl border ${
                    badge.unlocked
                      ? "bg-white/5 border-white/10"
                      : "bg-white/2 border-white/5"
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 uppercase tracking-wider">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground uppercase tracking-wider">
                      Locked
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm sm:text-base leading-snug">{badge.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-bold text-white">
                    {badge.currentValue} / {badge.targetValue} {badge.unit} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? "bg-primary" : "bg-zinc-700"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
