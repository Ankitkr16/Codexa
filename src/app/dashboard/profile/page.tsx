"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { updateProfileBio, getPublicProfile } from "@/server/actions/profile";
import { Loader2, Save, Share2, Eye, Clipboard, CheckCircle2, User } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user) return;
      try {
        const publicProfile = await getPublicProfile(session.user.id);
        if (publicProfile) {
          setBio(publicProfile.user.bio || "");
        }
        
        const host = window.location.origin;
        setPortfolioUrl(`${host}/profile/${session.user.id}`);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (!isPending && session) {
      loadProfile();
    }
  }, [session, isPending]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileBio(bio);
      alert("Bio updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update bio");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPending || loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Portfolio Settings</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your developer bio and generate your public portfolio link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Bio Form */}
        <div className="md:col-span-2 glass border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Public Bio details
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">About You</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief professional summary about your developer background and career goals..."
                rows={6}
                className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box & Link Copy */}
        <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="h-4.5 w-4.5 text-primary" />
              Share Portfolio
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your public portfolio compiles all verified coding ratings, solved counts, and active resume templates into a single shareable link.
            </p>
            <div className="p-3 rounded-xl bg-white/2 border border-white/5 text-[10px] text-muted-foreground font-mono truncate">
              {portfolioUrl}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl border border-white/10 transition-all text-xs"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
              {copied ? "Copied Link!" : "Copy Portfolio Link"}
            </button>

            <Link
              href={`/profile/${session?.user?.id}`}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-white font-semibold py-3 rounded-xl transition-all text-xs"
            >
              <Eye className="h-4 w-4" />
              View Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
