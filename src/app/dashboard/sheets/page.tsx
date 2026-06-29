"use client";

import { useEffect, useState } from "react";
import { getCodingSheets, createCustomSheet } from "@/server/actions/sheets";
import { Loader2, Plus, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SheetData {
  id: string;
  title: string;
  description: string | null;
  isCustom: boolean;
  totalProblems: number;
  solvedProblems: number;
}

export default function SheetsPage() {
  const [loading, setLoading] = useState(true);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSheets() {
    try {
      const res = await getCodingSheets();
      setSheets(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSheets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createCustomSheet({ title: newTitle, description: newDesc });
      setNewTitle("");
      setNewDesc("");
      setShowModal(false);
      await loadSheets();
    } catch (err: any) {
      setError(err.message || "Failed to create custom sheet");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Coding Sheets</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track curated interview sheets or create custom trackers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          <Plus className="h-4 w-4" />
          Create Sheet
        </button>
      </div>

      {/* Sheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.map((sheet) => {
          const percent = sheet.totalProblems > 0 
            ? Math.round((sheet.solvedProblems / sheet.totalProblems) * 100) 
            : 0;

          return (
            <Link
              key={sheet.id}
              href={`/dashboard/sheets/${sheet.id}`}
              className="p-6 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between space-y-6 group text-left"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    sheet.isCustom 
                      ? "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400" 
                      : "bg-primary/10 border-primary/20 text-primary-light"
                  }`}>
                    {sheet.isCustom ? "Custom" : "Standard"}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{sheet.totalProblems} Problems</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-all text-base sm:text-lg">{sheet.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {sheet.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-[10px]">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="text-white font-bold">{sheet.solvedProblems} / {sheet.totalProblems} Solved ({percent}%)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create Custom Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-lg font-bold text-white">Create Custom Sheet</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Define your own list to organize and practice targeted problems.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sheet Title</label>
                <input
                  type="text"
                  placeholder="e.g. My Recursion Practice"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Describe the target of this study list..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs sm:text-sm outline-none transition-all h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                >
                  {creating && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
