import { use } from "react";
import { getPublicProfile } from "@/server/actions/profile";
import { notFound } from "next/navigation";
import { Loader2, Globe, Award, Code, BookOpen, Briefcase, GraduationCap, CheckCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/BrandIcons";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const profile = await getPublicProfile(userId);

  if (!profile) {
    notFound();
  }

  const { user, codingProfile, resumeContent } = profile;

  // Extract resume content fields if available
  const rc = (resumeContent as any) || {};
  const skillsList: string[] = rc.skills
    ? rc.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];
  const experience = rc.experience || [];
  const projects = rc.projects || [];
  const education = rc.education || [];

  // Aggregate stats
  const totalSolved =
    (codingProfile?.leetcodeSolved || 0) +
    (codingProfile?.codeforcesSolved || 0) +
    (codingProfile?.geeksforgeeksSolved || 0) +
    (codingProfile?.bytecodeSolved || 0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 z-0">
        <div className="absolute -top-[10%] left-[5%] w-[40%] h-[60%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full bg-violet-600 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Back Link or Logo */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            <span className="p-1 rounded bg-primary/10 text-primary border border-primary/20 text-xs">C</span>
            Codexa<span className="text-primary">.</span>
          </Link>
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider bg-white/3 border border-white/5 px-3 py-1 rounded-full">
            Verified Developer Portfolio
          </span>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass border border-white/5 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-3xl uppercase shrink-0">
              {user.name.slice(0, 2)}
            </div>
          )}

          <div className="space-y-4 flex-grow">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio || "Full-stack developer syncing coding achievements and projects via Codexa."}
              </p>
            </div>

            {/* Social handles */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              {user.githubUsername && (
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white bg-white/3 border border-white/5 px-3 py-1.5 rounded-xl transition-all"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  @{user.githubUsername}
                </a>
              )}
              {rc.personal?.linkedin && (
                <a
                  href={`https://${rc.personal.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white bg-white/3 border border-white/5 px-3 py-1.5 rounded-xl transition-all"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
              {rc.personal?.website && (
                <a
                  href={`https://${rc.personal.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white bg-white/3 border border-white/5 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Aggregated platform stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Solved</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white block">{totalSolved}</span>
            <span className="text-[9px] text-muted-foreground">across platforms</span>
          </div>

          <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">LeetCode Solved</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white block">{codingProfile?.leetcodeSolved || 0}</span>
            <span className="text-[9px] text-yellow-400 font-semibold">
              {codingProfile?.leetcodeRating ? `${codingProfile.leetcodeRating} Rating` : "GraphQL verified"}
            </span>
          </div>

          <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Codeforces Rating</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white block">{codingProfile?.codeforcesRating || "N/A"}</span>
            <span className="text-[9px] text-red-400 font-semibold uppercase">{codingProfile?.codeforcesRank || "Unranked"}</span>
          </div>

          <div className="p-5 rounded-2xl glass border border-white/5 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">GitHub Commits</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white block">{codingProfile?.githubCommits || 0}</span>
            <span className="text-[9px] text-violet-400 font-semibold">{codingProfile?.githubRepoCount || 0} Repositories</span>
          </div>
        </div>

        {/* Bottom grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left panel: Skills & Platform Links */}
          <div className="md:col-span-1 space-y-6">
            {/* Skills Card */}
            {skillsList.length > 0 && (
              <div className="p-6 rounded-3xl glass border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-primary" /> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[10px] font-bold text-white bg-white/5 border border-white/5 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Platform handles details */}
            <div className="p-6 rounded-3xl glass border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" /> Connected Handles
              </h3>
              <div className="space-y-3.5 text-xs">
                {user.leetcodeUsername && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">LeetCode</span>
                    <span className="text-white font-semibold">@{user.leetcodeUsername}</span>
                  </div>
                )}
                {user.codeforcesUsername && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Codeforces</span>
                    <span className="text-white font-semibold">@{user.codeforcesUsername}</span>
                  </div>
                )}
                {user.codechefUsername && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">CodeChef</span>
                    <span className="text-white font-semibold">@{user.codechefUsername}</span>
                  </div>
                )}
                {user.geeksforgeeksUsername && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">GeeksforGeeks</span>
                    <span className="text-white font-semibold">@{user.geeksforgeeksUsername}</span>
                  </div>
                )}
                {user.atcoderUsername && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">AtCoder</span>
                    <span className="text-white font-semibold">@{user.atcoderUsername}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Experience & Projects */}
          <div className="md:col-span-2 space-y-6">
            {/* Experience Card */}
            {experience.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl glass border border-white/5 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-4.5 w-4.5 text-primary" /> Work History
                </h3>
                <div className="space-y-6">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className="relative pl-6 border-l border-white/10 space-y-2">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 text-xs">
                        <span className="font-bold text-white">{exp.company}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-primary/80 italic">{exp.role}</div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line pr-2">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Card */}
            {projects.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl glass border border-white/5 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-primary" /> Key Projects
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((p: any) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {p.title}
                          <span className="text-[9px] font-normal text-muted-foreground px-1.5 py-0.5 rounded bg-white/5">
                            {p.technologies}
                          </span>
                        </h4>
                        {p.link && (
                          <a
                            href={`https://${p.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-primary hover:underline font-bold"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Card */}
            {education.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl glass border border-white/5 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="h-4.5 w-4.5 text-primary" /> Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="flex justify-between items-start gap-4 text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{edu.institution}</span>
                        <span className="text-[11px] text-muted-foreground block">{edu.degree}</span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-mono block">{edu.startDate} – {edu.endDate}</span>
                        {edu.grade && <span className="text-[10px] text-primary/80 italic block">GPA: {edu.grade}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
