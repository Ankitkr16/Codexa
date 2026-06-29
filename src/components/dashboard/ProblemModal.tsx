"use client";

import { useState } from "react";
import { Loader2, X, Star, Save, ExternalLink } from "lucide-react";
import { updateProblemProgress } from "@/server/actions/sheets";

interface ProblemData {
  id: string;
  title: string;
  url: string;
  difficulty: string;
  platform: string;
  isSolved: boolean;
  isBookmarked: boolean;
  notes: string | null;
  personalRating: number | null;
  nextRevisionDate: Date | null;
  videoUrl?: string | null;
  articleUrl?: string | null;
}

interface ProblemModalProps {
  problem: ProblemData;
  onClose: () => void;
  onSave: () => void;
}

export default function ProblemModal({ problem, onClose, onSave }: ProblemModalProps) {
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState(problem.notes || "");
  const [rating, setRating] = useState<number | null>(problem.personalRating);
  const [revisionDate, setRevisionDate] = useState<string>(
    problem.nextRevisionDate ? new Date(problem.nextRevisionDate).toISOString().split("T")[0] : ""
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProblemProgress(problem.id, {
        notes: notes || null,
        personalRating: rating,
        nextRevisionDate: revisionDate ? new Date(revisionDate) : null,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      {/* Drawer Panel */}
      <div className="w-full max-w-lg h-full bg-zinc-950 border-l border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                problem.difficulty === "EASY" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                problem.difficulty === "MEDIUM" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {problem.difficulty}
              </span>
              <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-1.5">
                {problem.title}
                <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-all">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Platform: {problem.platform}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-left">
            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Difficulty Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-muted-foreground hover:text-yellow-500 transition-all"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        rating !== null && rating >= star ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Notes / Solution Approach</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes, complexity analysis, or optimal code approach here..."
                className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all h-48 resize-none font-mono"
              />
            </div>

            {/* Revision Date */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Next Revision Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={revisionDate}
                  onChange={(e) => setRevisionDate(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Reference URLs */}
            {(problem.videoUrl || problem.articleUrl) && (
              <div className="border-t border-white/5 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Helpful Resources</h4>
                <div className="space-y-1">
                  {problem.videoUrl && (
                    <a href={problem.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-light hover:underline flex items-center gap-1.5">
                      • Video Solution
                    </a>
                  )}
                  {problem.articleUrl && (
                    <a href={problem.articleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-light hover:underline flex items-center gap-1.5">
                      • Article Explanation
                    </a>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="border-t border-white/5 pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold text-xs sm:text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 text-xs sm:text-sm"
          >
            {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
