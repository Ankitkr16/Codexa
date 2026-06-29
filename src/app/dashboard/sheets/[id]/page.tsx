"use client";

import { use, useEffect, useState } from "react";
import { getSheetDetails, updateProblemProgress, addProblemToSheet } from "@/server/actions/sheets";
import { Loader2, ArrowLeft, Search, Plus, Star, Bookmark, Edit, ExternalLink, CheckSquare, Square, FileText } from "lucide-react";
import Link from "next/link";
import ProblemModal from "@/components/dashboard/ProblemModal";

interface ProblemItem {
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
  tags: string[];
}

interface SheetDetails {
  id: string;
  title: string;
  description: string | null;
  isCustom: boolean;
  problems: ProblemItem[];
}

export default function SheetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sheetId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState<SheetDetails | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  // Problem Drawer
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem | null>(null);

  // Add Custom Problem (only for custom sheets)
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addDifficulty, setAddDifficulty] = useState("EASY");
  const [addPlatform, setAddPlatform] = useState("LEETCODE");
  const [addTag, setAddTag] = useState("");
  const [addingProblem, setAddingProblem] = useState(false);

  async function loadDetails() {
    try {
      const res = await getSheetDetails(sheetId);
      setSheet(res as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [sheetId]);

  const handleToggleSolved = async (probId: string, currentSolved: boolean) => {
    if (!sheet) return;
    
    // Optimistic Update
    const updatedProblems = sheet.problems.map(p => 
      p.id === probId ? { ...p, isSolved: !currentSolved } : p
    );
    setSheet({ ...sheet, problems: updatedProblems });

    try {
      await updateProblemProgress(probId, { isSolved: !currentSolved });
    } catch (err) {
      // Revert on error
      console.error(err);
      const revertedProblems = sheet.problems.map(p => 
        p.id === probId ? { ...p, isSolved: currentSolved } : p
      );
      setSheet({ ...sheet, problems: revertedProblems });
    }
  };

  const handleToggleBookmark = async (probId: string, currentBookmarked: boolean) => {
    if (!sheet) return;

    // Optimistic Update
    const updatedProblems = sheet.problems.map(p => 
      p.id === probId ? { ...p, isBookmarked: !currentBookmarked } : p
    );
    setSheet({ ...sheet, problems: updatedProblems });

    try {
      await updateProblemProgress(probId, { isBookmarked: !currentBookmarked });
    } catch (err) {
      // Revert on error
      console.error(err);
      const revertedProblems = sheet.problems.map(p => 
        p.id === probId ? { ...p, isBookmarked: currentBookmarked } : p
      );
      setSheet({ ...sheet, problems: revertedProblems });
    }
  };

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheet || !addTitle.trim() || !addUrl.trim()) return;
    setAddingProblem(true);
    try {
      await addProblemToSheet(sheetId, {
        title: addTitle,
        url: addUrl,
        difficulty: addDifficulty,
        platform: addPlatform,
        tags: addTag.trim() ? [addTag.trim()] : [],
      });
      setAddTitle("");
      setAddUrl("");
      setAddTag("");
      setShowAddProblem(false);
      await loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProblem(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground text-sm">Sheet not found.</p>
        <Link href="/dashboard/sheets" className="text-primary hover:underline text-xs mt-2 inline-block">
          Back to Sheets
        </Link>
      </div>
    );
  }

  // Get unique category tags for the filter dropdown
  const allTags = new Set<string>();
  sheet.problems.forEach(p => p.tags.forEach(t => allTags.add(t)));
  const tagsList = Array.from(allTags);

  // Filter problems list
  const filteredProblems = sheet.problems.filter(prob => {
    const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === "ALL" || prob.difficulty === difficultyFilter;
    const matchesBookmark = !bookmarkedOnly || prob.isBookmarked;
    const matchesTag = selectedTag === "ALL" || prob.tags.includes(selectedTag);

    return matchesSearch && matchesDifficulty && matchesBookmark && matchesTag;
  });

  const total = sheet.problems.length;
  const solved = sheet.problems.filter(p => p.isSolved).length;
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6 text-left">
        <div className="space-y-2">
          <Link href="/dashboard/sheets" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-all">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Coding Sheets
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              {sheet.title}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                sheet.isCustom ? "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400" : "bg-primary/10 border-primary/20 text-primary-light"
              }`}>
                {sheet.isCustom ? "Custom" : "Standard"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed max-w-3xl">
              {sheet.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Circular or linear progress widget */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-muted-foreground font-semibold">Problems Tracker</span>
            <span className="text-white font-bold">{solved} / {total} Solved ({percent}%)</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      {/* Custom Problem Drawer for Custom Sheets */}
      {sheet.isCustom && (
        <div className="text-left">
          <button
            onClick={() => setShowAddProblem(!showAddProblem)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus className="h-4 w-4" />
            {showAddProblem ? "Hide Custom Form" : "Add Custom Problem"}
          </button>

          {showAddProblem && (
            <form onSubmit={handleAddProblem} className="mt-4 p-5 rounded-2xl glass border border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Reverse a String"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Problem Link (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={addUrl}
                  onChange={(e) => setAddUrl(e.target.value)}
                  className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Difficulty</label>
                  <select
                    value={addDifficulty}
                    onChange={(e) => setAddDifficulty(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Platform</label>
                  <select
                    value={addPlatform}
                    onChange={(e) => setAddPlatform(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none"
                  >
                    <option value="LEETCODE">LeetCode</option>
                    <option value="CODEFORCES">Codeforces</option>
                    <option value="CODECHEF">CodeChef</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Topic Tag</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Recursion"
                    value={addTag}
                    onChange={(e) => setAddTag(e.target.value)}
                    className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={addingProblem}
                    className="bg-primary hover:bg-primary/95 text-white font-bold p-2.5 rounded-xl transition-all shrink-0"
                  >
                    {addingProblem ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl pl-11 pr-4 py-3 text-xs outline-none transition-all"
          />
        </div>

        {/* Difficulty Selector */}
        <div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="HARD">Hard Only</option>
          </select>
        </div>

        {/* Tag Selector */}
        {tagsList.length > 0 && (
          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none"
            >
              <option value="ALL">All Topics</option>
              {tagsList.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center text-left">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={bookmarkedOnly}
            onChange={(e) => setBookmarkedOnly(e.target.checked)}
            className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary h-4 w-4"
          />
          Show Bookmarked Only
        </label>
      </div>

      {/* Problem Checklist Table */}
      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Problem Name</th>
                <th className="py-3 px-4 w-28">Difficulty</th>
                <th className="py-3 px-4 w-36">Topic Category</th>
                <th className="py-3 px-4 w-28">Rating</th>
                <th className="py-3 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((prob) => (
                  <tr key={prob.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                    {/* Status Solved Check */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleSolved(prob.id, prob.isSolved)}
                        className="text-muted-foreground hover:text-white transition-all"
                      >
                        {prob.isSolved ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-zinc-700" />
                        )}
                      </button>
                    </td>

                    {/* Problem Name Link */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          {prob.title}
                          <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                        </a>
                      </div>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prob.difficulty === "EASY" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        prob.difficulty === "MEDIUM" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Topic Tags */}
                    <td className="py-4 px-4 text-muted-foreground text-xs">
                      {prob.tags.join(", ") || "General"}
                    </td>

                    {/* Custom Stars Rating */}
                    <td className="py-4 px-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              prob.personalRating && prob.personalRating >= star 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Actions: Bookmark & Edit */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Bookmark button */}
                        <button
                          onClick={() => handleToggleBookmark(prob.id, prob.isBookmarked)}
                          className="p-1 rounded-lg hover:bg-white/5 transition-all text-muted-foreground"
                        >
                          <Bookmark
                            className={`h-4.5 w-4.5 ${
                              prob.isBookmarked ? "text-yellow-500 fill-yellow-500" : "text-zinc-500"
                            }`}
                          />
                        </button>

                        {/* Edit Notes button */}
                        <button
                          onClick={() => setSelectedProblem(prob)}
                          className="p-1 rounded-lg hover:bg-white/5 transition-all text-muted-foreground hover:text-white"
                        >
                          {prob.notes ? (
                            <FileText className="h-4.5 w-4.5 text-primary" />
                          ) : (
                            <Edit className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs sm:text-sm">
                    No problems match the current filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem Notes Slider Drawer */}
      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSave={loadDetails}
        />
      )}
    </div>
  );
}
