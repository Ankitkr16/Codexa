"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Code2, 
  Terminal, 
  TrendingUp, 
  Check, 
  Users, 
  Layers, 
  FileText, 
  Calendar, 
  Award,
  Zap
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 z-0">
        <div className="absolute -top-[10%] left-[5%] w-[40%] h-[60%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full bg-violet-600 blur-[120px]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs text-primary mb-6"
        >
          <Award className="h-3.5 w-3.5" />
          <span className="font-semibold">Introducing Codexa 1.0</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] text-white"
        >
          The Ultimate Platform for <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-primary to-fuchsia-400">Developer Growth</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed"
        >
          Combine your LeetCode, Codeforces, and GitHub metrics into one dashboard. Solve standard sheets, track submissions, and generate ATS-friendly resumes effortlessly.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto"
        >
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary/95 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border border-primary/20"
          >
            Start For Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 glass text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >
            View Demo Dashboard
          </Link>
        </motion.div>

        {/* Demo Dashboard Preview Card */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 sm:mt-24 w-full max-w-5xl rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 relative"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500" />
          <div className="flex items-center space-x-2 pb-4 border-b border-white/5 text-muted-foreground text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="pl-2 font-mono">dashboard.codexa.dev</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-5 rounded-xl bg-white/2 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">LeetCode Tracker</span>
                <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Solved Problems</span>
                  <span className="font-bold text-white">412 / 800</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "51.5%" }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground">
                <div className="bg-white/3 p-2 rounded">
                  <div className="text-green-400 font-bold text-xs">142</div>
                  Easy
                </div>
                <div className="bg-white/3 p-2 rounded">
                  <div className="text-yellow-400 font-bold text-xs">210</div>
                  Medium
                </div>
                <div className="bg-white/3 p-2 rounded">
                  <div className="text-red-400 font-bold text-xs">60</div>
                  Hard
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/2 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">GitHub Contribution</span>
                <span className="text-xs text-violet-500 font-bold bg-violet-500/10 px-2 py-0.5 rounded">Synced</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-2xl font-bold text-white">1,492 Commits</span>
                <span className="text-xs text-muted-foreground">Across 24 active repositories this year</span>
              </div>
              <div className="flex items-center space-x-1.5 h-12">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm h-8 ${
                      i % 4 === 0 
                        ? "bg-primary" 
                        : i % 3 === 0 
                        ? "bg-primary/60" 
                        : i % 2 === 0 
                        ? "bg-primary/20" 
                        : "bg-white/5"
                    }`} 
                  />
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/2 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">Daily Streak</span>
                <span className="text-xs text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded">🔥 Streak</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white">42 Days</span>
                <p className="text-xs text-muted-foreground">Keep coding to maintain your global rank!</p>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-3">
                <span>Rank: <strong className="text-white">#124 (Global)</strong></span>
                <span className="text-primary font-bold">Top 1.2%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-white/[0.01] relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Supercharge Your Developer Workflow
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Everything you need to track coding growth, showcase profile statistics, and level up your career.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 w-fit">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Profile Synchronizer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect LeetCode, Codeforces, CodeChef, AtCoder, and GitHub. Gather all ratings, active badges, and statistics instantly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 w-fit">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Coding Sheet Tracker</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Support for Blind 75, NeetCode 150, Striver SDE Sheet, Love Babbar, and custom sheets. Tag, search, bookmark, and review questions.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 w-fit">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">GitHub Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Beautiful visualization of commits, pull requests, issues raised, repository stars, language breakdowns, and contribution timeline.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">ATS Resume Builder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Auto-fill your experience, projects, and achievements directly from GitHub and coding profiles. Export print-ready PDFs.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Coding Calendar</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never miss a contest. View upcoming schedules, set push reminders, and keep tabs on revision intervals.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Social Leaderboard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Compete with friends, check weekly/monthly global ranks, share achievements, and stay motivated together.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-white/5 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Start free and scale up as you grow. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl glass border border-white/5 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-muted-foreground">Free Developer</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-sm text-muted-foreground ml-2">/ lifetime</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for beginners and single profile trackers.</p>
                <div className="border-t border-white/5 my-4" />
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Sync 1 Coding Profile</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Track Standard Coding Sheets</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-muted-foreground/60">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Basic Resume Builder (1 template)</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-muted-foreground/60">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Weekly Global Leaderboard</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl glass border border-primary/30 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-bl-xl border-l border-b border-primary/20">
                Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">Pro Coding</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$4.99</span>
                  <span className="text-sm text-muted-foreground ml-2">/ month</span>
                </div>
                <p className="text-sm text-muted-foreground">For active job hunters and competitive programmers.</p>
                <div className="border-t border-white/5 my-4" />
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Sync Unlimited Coding Profiles</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Custom Coding Sheets & Revision Scheduler</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Premium ATS Resumes & PDF Exports</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Real-time Discord/Email Contest Reminders</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Custom Domain / Profile Sharing</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-xl bg-primary hover:bg-primary/95 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Go Pro Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-white/5 bg-white/[0.01] relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Which coding platforms are supported?",
                a: "Currently, Codexa supports seamless username syncing and statistics scraping for LeetCode, Codeforces, CodeChef, AtCoder, and GitHub."
              },
              {
                q: "How does the ATS Resume Builder work?",
                a: "The system fetches your public projects, contributions, stars, and code metrics from GitHub, combines them with your solved count and ratings from competitive sites, and generates an ATS-parsed resume template."
              },
              {
                q: "Is my account security guaranteed?",
                a: "Yes. Codexa uses Better Auth which conforms to secure cookie practices, CSRF protection, and handles third-party OAuth logins directly through Google and GitHub endpoints."
              },
              {
                q: "Can I create and share custom coding sheets?",
                a: "Absolutely! Under the Pro plan, you can build custom lists of problems, arrange them by topic or difficulty, and publish them for other developers to track."
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl glass border border-white/5 space-y-2.5 text-left">
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="p-1 rounded bg-primary/10 text-primary text-xs">Q</span>
                  {faq.q}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 relative z-10 w-full border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center glass border border-white/5 p-12 rounded-3xl relative">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to track your coding journey?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Create an account in less than 30 seconds and start syncing your competitive programming and GitHub profiles today.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 transition-all font-bold px-8 py-3.5 rounded-xl text-sm"
            >
              Sign Up Now
              <Zap className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
