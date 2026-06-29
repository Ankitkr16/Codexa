"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Menu, Bell, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/progress": "Coding Progress",
  "/dashboard/sheets": "Coding Sheets Tracker",
  "/dashboard/github": "GitHub Analytics",
  "/dashboard/contests": "Contest History",
  "/dashboard/calendar": "Coding Calendar",
  "/dashboard/achievements": "Achievements & Badges",
  "/dashboard/leaderboard": "Social Leaderboard",
  "/dashboard/resume": "ATS Resume Builder",
  "/dashboard/profile": "Profile Portfolio",
  "/dashboard/settings": "Account Settings",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const title = routeTitles[pathname] || "Dashboard";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-25 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-md border-b border-white/5">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 lg:hidden transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight sm:text-xl">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left"
          >
            {isPending ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-8 h-8 rounded-full border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {session?.user?.name ? session.user.name.slice(0, 2) : <UserIcon className="w-4 h-4" />}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl glass border border-white/5 p-1.5 shadow-xl">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-semibold text-white truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
              <div className="pt-1.5 space-y-0.5">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
