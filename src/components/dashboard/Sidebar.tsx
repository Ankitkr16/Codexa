"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Terminal, 
  LayoutDashboard, 
  BarChart3, 
  Layers, 
  Award, 
  Calendar, 
  Trophy, 
  FileText, 
  Settings, 
  User,
  Users,
  ShieldAlert
} from "lucide-react";
import { GithubIcon } from "@/components/shared/BrandIcons";
import { useSession } from "@/lib/auth-client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Coding Progress", href: "/dashboard/progress", icon: BarChart3 },
  { name: "Coding Sheets", href: "/dashboard/sheets", icon: Layers },
  { name: "GitHub Analytics", href: "/dashboard/github", icon: GithubIcon },
  { name: "Contest History", href: "/dashboard/contests", icon: Award },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Users },
  { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldAlert },
  { name: "Resume", href: "/dashboard/resume", icon: FileText },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = (session?.user as any)?.role === "admin";
  const filteredNavigation = navigation.filter(
    (item) => item.href !== "/dashboard/admin" || isAdmin
  );

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-white/5 bg-background/50 backdrop-blur-md z-30">
      <div className="flex items-center h-16 px-6 border-b border-white/5">
        <Link href="/" className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Terminal className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Codexa<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <nav className="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-primary/10"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-white"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
