"use client";

import { useEffect, useState } from "react";
import { 
  getGlobalLeaderboard, 
  getFriendsLeaderboard, 
  getFriendRequests, 
  sendFriendRequest, 
  respondToFriendRequest, 
  LeaderboardUser 
} from "@/server/actions/leaderboard";
import { Loader2, Trophy, Users, UserPlus, Check, X, Search, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"GLOBAL" | "FRIENDS" | "REQUESTS">("GLOBAL");
  
  const [globalRank, setGlobalRank] = useState<LeaderboardUser[]>([]);
  const [friendsRank, setFriendsRank] = useState<LeaderboardUser[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [searchName, setSearchName] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  const loadData = async () => {
    try {
      const [glob, fr, reqs] = await Promise.all([
        getGlobalLeaderboard(),
        getFriendsLeaderboard(),
        getFriendRequests(),
      ]);
      setGlobalRank(glob);
      setFriendsRank(fr);
      setRequests(reqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    setSendingRequest(true);
    try {
      await sendFriendRequest(searchName.trim());
      alert("Friend request sent successfully!");
      setSearchName("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send friend request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleRespond = async (requestId: string, status: "ACCEPTED" | "DECLINED") => {
    try {
      await respondToFriendRequest(requestId, status);
      // Remove from list
      setRequests(requests.filter((r) => r.id !== requestId));
      // Reload rankings
      const [glob, fr] = await Promise.all([
        getGlobalLeaderboard(),
        getFriendsLeaderboard(),
      ]);
      setGlobalRank(glob);
      setFriendsRank(fr);
    } catch (err) {
      console.error(err);
      alert("Failed to respond to request");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentList = activeTab === "GLOBAL" ? globalRank : friendsRank;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Social Leaderboard</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Sync solved metrics, compare global ratings, and challenge friends
            </p>
          </div>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleSendRequest} className="w-full md:w-auto flex gap-2">
          <input
            type="text"
            placeholder="Friend's email or name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full md:w-60 bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={sendingRequest}
            className="bg-primary hover:bg-primary/95 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
          >
            {sendingRequest ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            Add Friend
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {[
          { id: "GLOBAL", label: "Global Rankings", count: globalRank.length },
          { id: "FRIENDS", label: "Friends list", count: friendsRank.length },
          { 
            id: "REQUESTS", 
            label: "Friend Requests", 
            count: requests.length, 
            badge: requests.length > 0 ? requests.length : undefined 
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-primary text-white"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        {activeTab !== "REQUESTS" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-6 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Developer</th>
                  <th className="py-3.5 px-4 w-28 text-center">LeetCode</th>
                  <th className="py-3.5 px-4 w-28 text-center">Codeforces</th>
                  <th className="py-3.5 px-4 w-28 text-center">GFG & ByteCode</th>
                  <th className="py-3.5 px-6 w-32 text-center">Total Solved</th>
                </tr>
              </thead>
              <tbody>
                {currentList.length > 0 ? (
                  currentList.map((user, idx) => {
                    const rank = idx + 1;
                    const isTopThree = rank <= 3;
                    const rankStyle = 
                      rank === 1 ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" :
                      rank === 2 ? "text-zinc-300 bg-zinc-300/10 border-zinc-300/20" :
                      "text-amber-600 bg-amber-600/10 border-amber-600/20";

                    return (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                        {/* Rank Badge */}
                        <td className="py-4 px-6 text-center">
                          {isTopThree ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black border ${rankStyle}`}>
                              {rank}
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-mono font-semibold">{rank}</span>
                          )}
                        </td>

                        {/* Name Link */}
                        <td className="py-4 px-4">
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center gap-3 group text-left"
                          >
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-8 h-8 rounded-lg border border-white/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                {user.name.slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-white group-hover:text-primary transition-all block">
                                {user.name}
                              </span>
                              {user.cfRating && (
                                <span className="text-[9px] text-muted-foreground uppercase font-mono">
                                  CF Rating: {user.cfRating}
                                </span>
                              )}
                            </div>
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-center font-semibold text-white">
                          {user.leetcodeSolved}
                        </td>

                        <td className="py-4 px-4 text-center font-semibold text-white">
                          {user.codeforcesSolved}
                        </td>

                        <td className="py-4 px-4 text-center font-semibold text-white">
                          {user.geeksforgeeksSolved + user.bytecodeSolved}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className="text-xs font-black text-white px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            {user.totalSolved}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs sm:text-sm">
                      No developers on this ranking list yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-primary" />
              Pending Invitations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {req.sender.image ? (
                          <img
                            src={req.sender.image}
                            alt={req.sender.name}
                            className="w-10 h-10 rounded-xl border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm uppercase">
                            {req.sender.name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block text-xs sm:text-sm">{req.sender.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate block max-w-[150px] sm:max-w-xs">{req.sender.email}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleRespond(req.id, "ACCEPTED")}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRespond(req.id, "DECLINED")}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
                    No pending friend requests.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
