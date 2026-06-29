"use client";

import { useEffect, useState } from "react";
import { getContestSchedule, toggleContestReminder, getContestReminders, ContestItem } from "@/server/actions/contests";
import { Loader2, Calendar, Clock, Bell, ExternalLink, Filter, Search, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ContestsPage() {
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      const [schedule, userReminders] = await Promise.all([
        getContestSchedule(),
        getContestReminders(),
      ]);
      setContests(schedule);
      setReminders(userReminders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleReminder = async (contest: ContestItem) => {
    // Optimistic Update
    const isSet = reminders.includes(contest.id);
    if (isSet) {
      setReminders(reminders.filter((id) => id !== contest.id));
    } else {
      setReminders([...reminders, contest.id]);
    }

    try {
      const res = await toggleContestReminder({
        id: contest.id,
        name: contest.name,
        platform: contest.platform,
        startTime: contest.startTime,
      });

      // Verify state matches server
      if (res.enabled && !reminders.includes(contest.id)) {
        setReminders((prev) => [...prev, contest.id]);
      } else if (!res.enabled && reminders.includes(contest.id)) {
        setReminders((prev) => prev.filter((id) => id !== contest.id));
      }
    } catch (err) {
      console.error(err);
      // Revert on error
      if (isSet) {
        setReminders((prev) => [...prev, contest.id]);
      } else {
        setReminders((prev) => prev.filter((id) => id !== contest.id));
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter logic
  const filteredContests = contests.filter((contest) => {
    const matchesPlatform = filterPlatform === "ALL" || contest.platform === filterPlatform;
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const activeContests = filteredContests.filter((c) => c.status === "ACTIVE");
  const upcomingContests = filteredContests.filter((c) => c.status === "UPCOMING");

  const getPlatformStyles = (platform: string) => {
    switch (platform) {
      case "LEETCODE":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "CODEFORCES":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "CODECHEF":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "ATCODER":
        return "bg-sky-500/10 border-sky-500/20 text-sky-400";
      default:
        return "bg-zinc-500/10 border-zinc-500/20 text-zinc-400";
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Contests Schedule</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            View running and upcoming competitive programming contests across platforms
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["ALL", "LEETCODE", "CODEFORCES", "CODECHEF", "ATCODER"].map((platform) => (
            <button
              key={platform}
              onClick={() => setFilterPlatform(platform)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                filterPlatform === platform
                  ? "bg-primary border-primary/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                  : "bg-white/3 border-white/5 text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {platform === "ALL" ? "All Platforms" : platform}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all"
          />
        </div>
      </div>

      {/* Active Contests (if any) */}
      {activeContests.length > 0 && (
        <div className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-red-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Active Contests Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeContests.map((contest) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl glass border border-red-500/20 bg-red-500/2 relative overflow-hidden flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPlatformStyles(contest.platform)}`}>
                      {contest.platform}
                    </span>
                    <span className="text-[9px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">
                      Running
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base leading-snug">{contest.name}</h4>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Ends: {new Date(contest.endTime).toLocaleString()}</span>
                  </div>
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white hover:text-primary transition-all font-semibold"
                  >
                    Enter Contest
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Contests */}
      <div className="space-y-3 text-left">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-primary" />
          Upcoming Schedules
        </h3>

        {upcomingContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {upcomingContests.map((contest) => {
                const isReminderSet = reminders.includes(contest.id);
                return (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPlatformStyles(contest.platform)}`}>
                          {contest.platform}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDuration(contest.duration)}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                        {contest.name}
                      </h4>
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-3.5">
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex justify-between gap-2 items-center pt-1.5">
                        <button
                          onClick={() => handleToggleReminder(contest)}
                          className={`flex-grow flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isReminderSet
                              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-white/3 border-white/5 text-white hover:bg-white/5"
                          }`}
                        >
                          <Bell className={`h-3.5 w-3.5 ${isReminderSet ? "fill-yellow-400" : ""}`} />
                          {isReminderSet ? "Reminder Set" : "Notify Me"}
                        </button>

                        <a
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/3 border border-white/5 hover:bg-white/5 text-white rounded-xl transition-all"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl glass border border-white/5">
            <p className="text-muted-foreground text-xs sm:text-sm">No upcoming contests matching criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
