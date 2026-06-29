"use client";

import { useEffect, useState } from "react";
import { saveResume, getResume } from "@/server/actions/resume";
import { getCodingProfile, getUserUsernames } from "@/server/actions/sync";
import { Loader2, Save, Download, Plus, Trash2, Sparkles, FileText, Briefcase, GraduationCap, Code, User } from "lucide-react";
import { motion } from "framer-motion";

interface ResumeContent {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    technologies: string;
    link: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    grade: string;
  }>;
  skills: string;
}

const initialResumeContent: ResumeContent = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  projects: [],
  education: [],
  skills: "",
};

export default function ResumePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [content, setContent] = useState<ResumeContent>(initialResumeContent);
  const [syncStats, setSyncStats] = useState<{ leetcodeSolved: number; cfRating: string; ghRepos: number } | null>(null);

  // Load initial resume
  const loadResumeData = async () => {
    try {
      const [res, profile, usernames] = await Promise.all([
        getResume(),
        getCodingProfile(),
        getUserUsernames(),
      ]);

      if (res) {
        setResumeId(res.id);
        setResumeTitle(res.title);
        setContent(res.content as any);
      } else {
        // Pre-fill personal from session handles
        setContent((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            github: usernames.githubUsername ? `github.com/${usernames.githubUsername}` : "",
          },
        }));
      }

      if (profile) {
        setSyncStats({
          leetcodeSolved: profile.leetcodeSolved || 0,
          cfRating: profile.codeforcesRating ? `${profile.codeforcesRating} Rating` : "Unrated",
          ghRepos: profile.githubRepoCount || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveResume({
        id: resumeId,
        title: resumeTitle,
        content: content,
      });
      setResumeId(res.id);
      alert("Resume saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handleAutofillStats = () => {
    if (!syncStats) return;
    const summaryFill = `Experienced Developer with a track record of solving ${syncStats.leetcodeSolved}+ algorithmic problems on LeetCode. Active contributor on GitHub with ${syncStats.ghRepos} public repositories. Strong focus on backend architecture, competitive programming (Codeforces: ${syncStats.cfRating}), and clean code principles.`;
    
    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        summary: summaryFill,
      },
      skills: prev.skills || "Data Structures, Algorithms, TypeScript, React, Next.js, Node.js, PostgreSQL, Git",
    }));
  };

  const addExperience = () => {
    setContent((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Math.random().toString(),
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addProject = () => {
    setContent((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Math.random().toString(),
          title: "",
          technologies: "",
          link: "",
          description: "",
        },
      ],
    }));
  };

  const removeProject = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addEducation = () => {
    setContent((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Math.random().toString(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          grade: "",
        },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setContent((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handlePrint = () => {
    window.print();
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6 text-left print:hidden">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">ATS Resume Builder</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Build a professional, single-page resume populated from your linked developer profiles
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {syncStats && (
            <button
              onClick={handleAutofillStats}
              className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
              Autofill Profile Stats
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Resume
          </button>

          <button
            onClick={handlePrint}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start text-left">
        {/* Editor (Hidden on print) */}
        <div className="space-y-6 print:hidden">
          {/* Resume Title Input */}
          <div className="p-5 glass border border-white/5 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume Title</label>
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
          </div>

          {/* Personal Info */}
          <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Personal details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={content.personal.fullName}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, fullName: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={content.personal.email}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, email: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={content.personal.phone}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, phone: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="text"
                placeholder="Location (e.g. San Francisco, CA)"
                value={content.personal.location}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, location: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="text"
                placeholder="Personal Website URL"
                value={content.personal.website}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, website: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="text"
                placeholder="GitHub Profile URL (e.g. github.com/...)"
                value={content.personal.github}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, github: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
              <input
                type="text"
                placeholder="LinkedIn Profile URL (e.g. linkedin.com/in/...)"
                value={content.personal.linkedin}
                onChange={(e) => setContent({ ...content, personal: { ...content.personal, linkedin: e.target.value } })}
                className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full"
              />
            </div>
            <textarea
              placeholder="Professional Summary (brief bio)"
              value={content.personal.summary}
              onChange={(e) => setContent({ ...content, personal: { ...content.personal, summary: e.target.value } })}
              rows={3}
              className="bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none w-full resize-none"
            />
          </div>

          {/* Experience Section */}
          <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-primary" />
                Work Experience
              </h3>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3 w-3" /> Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {content.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 relative">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[idx].company = e.target.value;
                        setContent({ ...content, experience: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Job Title / Role"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[idx].role = e.target.value;
                        setContent({ ...content, experience: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Start Date (e.g. Jan 2025)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[idx].startDate = e.target.value;
                        setContent({ ...content, experience: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="End Date (e.g. Present)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[idx].endDate = e.target.value;
                        setContent({ ...content, experience: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                  </div>
                  <textarea
                    placeholder="Description (use bullet points or key duties)"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...content.experience];
                      updated[idx].description = e.target.value;
                      setContent({ ...content, experience: updated });
                    }}
                    rows={2}
                    className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="h-4.5 w-4.5 text-primary" />
                Projects
              </h3>
              <button
                onClick={addProject}
                className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3 w-3" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {content.projects.map((p, idx) => (
                <div key={p.id} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 relative">
                  <button
                    onClick={() => removeProject(p.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={p.title}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[idx].title = e.target.value;
                        setContent({ ...content, projects: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (e.g. Next.js, Postgres)"
                      value={p.technologies}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[idx].technologies = e.target.value;
                        setContent({ ...content, projects: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Project Link"
                      value={p.link}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[idx].link = e.target.value;
                        setContent({ ...content, projects: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                  </div>
                  <textarea
                    placeholder="Brief details of your contributions / features"
                    value={p.description}
                    onChange={(e) => {
                      const updated = [...content.projects];
                      updated[idx].description = e.target.value;
                      setContent({ ...content, projects: updated });
                    }}
                    rows={2}
                    className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-primary" />
                Education
              </h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3 w-3" /> Add Education
              </button>
            </div>

            <div className="space-y-4">
              {content.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 relative">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <input
                      type="text"
                      placeholder="School / University"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[idx].institution = e.target.value;
                        setContent({ ...content, education: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Degree / Major"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[idx].degree = e.target.value;
                        setContent({ ...content, education: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Start Year"
                      value={edu.startDate}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[idx].startDate = e.target.value;
                        setContent({ ...content, education: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="End Year / Expected"
                      value={edu.endDate}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[idx].endDate = e.target.value;
                        setContent({ ...content, education: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full"
                    />
                    <input
                      type="text"
                      placeholder="Grade / GPA (e.g. 3.8/4.0)"
                      value={edu.grade}
                      onChange={(e) => {
                        const updated = [...content.education];
                        updated[idx].grade = e.target.value;
                        setContent({ ...content, education: updated });
                      }}
                      className="bg-white/3 border border-white/5 text-white rounded-xl px-3 py-2 text-xs outline-none w-full sm:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 glass border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="h-4.5 w-4.5 text-primary" />
              Technical Skills
            </h3>
            <input
              type="text"
              placeholder="e.g. React, Python, PostgreSQL, Data Structures (comma separated)"
              value={content.skills}
              onChange={(e) => setContent({ ...content, skills: e.target.value })}
              className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* ATS Resume Preview Sheet (Visible both on desktop editor + printable) */}
        <div className="p-8 bg-white text-zinc-900 border border-zinc-200 rounded-2xl shadow-xl min-h-[1100px] w-full font-serif mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
          <div className="space-y-6">
            {/* Header info */}
            <div className="text-center space-y-1.5 border-b-2 border-zinc-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 uppercase">
                {content.personal.fullName || "Your Full Name"}
              </h2>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-600 font-mono">
                {content.personal.email && <span>{content.personal.email}</span>}
                {content.personal.phone && <span>{content.personal.phone}</span>}
                {content.personal.location && <span>{content.personal.location}</span>}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-zinc-500 font-mono">
                {content.personal.website && <span>{content.personal.website}</span>}
                {content.personal.github && <span>{content.personal.github}</span>}
                {content.personal.linkedin && <span>{content.personal.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {content.personal.summary && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-300 pb-0.5">Professional Summary</h3>
                <p className="text-xs text-zinc-700 leading-relaxed font-sans">{content.personal.summary}</p>
              </div>
            )}

            {/* Experience */}
            {content.experience.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-300 pb-0.5">Work Experience</h3>
                <div className="space-y-3">
                  {content.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-sans text-xs font-bold">
                        <span>{exp.company}</span>
                        <span className="text-[10px] font-normal text-zinc-500 font-mono">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-zinc-700 italic">{exp.role}</div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed pl-3 font-sans whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {content.projects.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-300 pb-0.5">Key Projects</h3>
                <div className="space-y-3">
                  {content.projects.map((p) => (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-sans text-xs font-bold">
                        <span>{p.title} <span className="text-[10px] font-normal text-zinc-500">({p.technologies})</span></span>
                        {p.link && <span className="text-[10px] font-normal text-zinc-400 font-mono">{p.link}</span>}
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed pl-3 font-sans whitespace-pre-line">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {content.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-300 pb-0.5">Education</h3>
                <div className="space-y-3">
                  {content.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-sans text-xs font-bold">
                        <span>{edu.institution}</span>
                        <span className="text-[10px] font-normal text-zinc-500 font-mono">{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <div className="text-[11px] text-zinc-700 flex justify-between font-sans">
                        <span>{edu.degree}</span>
                        {edu.grade && <span className="italic text-zinc-500">GPA: {edu.grade}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {content.skills && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-300 pb-0.5">Technical Skills</h3>
                <p className="text-[11px] text-zinc-700 font-sans leading-relaxed">
                  {content.skills}
                </p>
              </div>
            )}

            {/* Synced Verification Tag */}
            {syncStats && (
              <div className="text-[8px] text-zinc-400 font-mono text-center pt-8 border-t border-zinc-100 flex justify-center gap-4 uppercase print:hidden">
                <span>Verified solve count: {syncStats.leetcodeSolved}</span>
                <span>•</span>
                <span>Codeforces status: {syncStats.cfRating}</span>
                <span>•</span>
                <span>Autogenerated by Codexa</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
