"use client";

import { useEffect, useState } from "react";
import { getCodingProfile, getUserUsernames } from "@/server/actions/sync";
import { Loader2, Code2, AlertTriangle, Medal, BarChart3 } from "lucide-react";
import Link from "next/link";

interface ProfileData {
  leetcodeSolved: number;
  leetcodeEasy: number;
  leetcodeMedium: number;
  leetcodeHard: number;
  leetcodeRating: number | null;
  leetcodeGlobalRank: number | null;
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [leetcodeUser, setLeetcodeUser] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, usernamesRes] = await Promise.all([
          getCodingProfile(),
          getUserUsernames(),
        ]);
        setProfile(profileRes as any);
        setLeetcodeUser(usernamesRes.leetcodeUsername);
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

  if (!leetcodeUser) {
    return (
      <div className="p-8 max-w-md mx-auto text-center glass border border-white/5 rounded-2xl space-y-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">LeetCode Not Connected</h3>
        <p className="text-xs text-muted-foreground">Please connect your LeetCode username in settings to view detailed problem-solving statistics.</p>
        <Link href="/dashboard/settings" className="inline-block text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-xl">
          Connect Profile
        </Link>
      </div>
    );
  }

  const totalSolved = profile?.leetcodeSolved || 0;
  const easy = profile?.leetcodeEasy || 0;
  const medium = profile?.leetcodeMedium || 0;
  const hard = profile?.leetcodeHard || 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          <Code2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Coding Progress</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">LeetCode profile metrics for @{leetcodeUser}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solved Stats Card */}
        <div className="md:col-span-2 glass border border-white/5 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-primary" />
            Problems Solved
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Big solved indicator */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/2 rounded-2xl border border-white/5 text-center">
              <span className="text-5xl font-black text-white">{totalSolved}</span>
              <span className="text-xs text-muted-foreground mt-1">Total Solved Problems</span>
            </div>

            {/* Difficulties */}
            <div className="space-y-4 text-left">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-green-400 font-semibold">Easy</span>
                  <span className="text-white font-medium">{easy}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full rounded-full" style={{ width: `${(easy / (totalSolved || 1)) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-yellow-400 font-semibold">Medium</span>
                  <span className="text-white font-medium">{medium}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${(medium / (totalSolved || 1)) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-red-400 font-semibold">Hard</span>
                  <span className="text-white font-medium">{hard}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full rounded-full" style={{ width: `${(hard / (totalSolved || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Rankings Card */}
        <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Medal className="h-4.5 w-4.5 text-yellow-500" />
              Contest Rankings
            </h3>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-muted-foreground">Rating</span>
                <span className="text-sm font-bold text-white">{profile?.leetcodeRating || "Unrated"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-muted-foreground">Global Rank</span>
                <span className="text-sm font-bold text-white">
                  {profile?.leetcodeGlobalRank ? `#${profile.leetcodeGlobalRank}` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-[10px] text-muted-foreground leading-relaxed">
            Participate in weekly contests on LeetCode to establish your official developer rank score and showcase it on your resume.
          </div>
        </div>
      </div>
    </div>
  );
}
