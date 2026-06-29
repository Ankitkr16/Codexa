"use client";

import { useEffect, useState } from "react";
import { saveUsernames, triggerProfileSync, getUserUsernames } from "@/server/actions/sync";
import { Loader2, CheckCircle2, AlertCircle, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const [leetcode, setLeetcode] = useState("");
  const [github, setGithub] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [codechef, setCodechef] = useState("");
  const [atcoder, setAtcoder] = useState("");
  const [geeksforgeeks, setGeeksforgeeks] = useState("");
  const [bytecode, setBytecode] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadUsernames() {
      try {
        const res = await getUserUsernames();
        setLeetcode(res.leetcodeUsername || "");
        setGithub(res.githubUsername || "");
        setCodeforces(res.codeforcesUsername || "");
        setCodechef(res.codechefUsername || "");
        setAtcoder(res.atcoderUsername || "");
        setGeeksforgeeks(res.geeksforgeeksUsername || "");
        setBytecode(res.bytecodeUsername || "");
      } catch (err) {
        console.error("Failed to load usernames", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsernames();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveUsernames({
        leetcodeUsername: leetcode,
        githubUsername: github,
        codeforcesUsername: codeforces,
        codechefUsername: codechef,
        atcoderUsername: atcoder,
        geeksforgeeksUsername: geeksforgeeks,
        bytecodeUsername: bytecode,
      });
      setMessage({ type: "success", text: "Usernames saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save usernames" });
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      await triggerProfileSync();
      setMessage({ type: "success", text: "Profiles synchronized successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to synchronize profiles" });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSyncDisabled = !leetcode && !github && !codeforces && !codechef && !geeksforgeeks && !bytecode;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Connections</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Connect your coding handles to sync ratings and code statistics automatically.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" 
            ? "bg-green-500/10 border-green-500/20 text-green-400" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="md:col-span-2 glass border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">GitHub Username</label>
                <input
                  type="text"
                  placeholder="octocat"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">LeetCode Username</label>
                <input
                  type="text"
                  placeholder="leetcode_coder"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Codeforces Username</label>
                <input
                  type="text"
                  placeholder="tourist"
                  value={codeforces}
                  onChange={(e) => setCodeforces(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">CodeChef Username</label>
                <input
                  type="text"
                  placeholder="gennady"
                  value={codechef}
                  onChange={(e) => setCodechef(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">GeeksforGeeks Username</label>
                <input
                  type="text"
                  placeholder="gfg_user"
                  value={geeksforgeeks}
                  onChange={(e) => setGeeksforgeeks(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">ByteCode Username</label>
                <input
                  type="text"
                  placeholder="bytecode_user"
                  value={bytecode}
                  onChange={(e) => setBytecode(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">AtCoder Username</label>
                <input
                  type="text"
                  placeholder="chokudai"
                  value={atcoder}
                  onChange={(e) => setAtcoder(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Handles
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Manual Synchronisation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once you save your usernames, trigger a manual sync to pull statistics and store them in the Codexa platform cache.
            </p>
            <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-[10px] text-muted-foreground font-mono space-y-1.5">
              <div>• LeetCode: GraphQL public sync</div>
              <div>• GitHub: Commits, stars, PRs</div>
              <div>• Codeforces: Solved count & rating</div>
              <div>• CodeChef: Ratings & stars</div>
              <div>• GeeksforGeeks: Solved count</div>
              <div>• ByteCode: Connection index</div>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing || isSyncDisabled}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl border border-white/10 transition-all disabled:opacity-50 text-sm"
          >
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sync Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
