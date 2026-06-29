"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, X } from "lucide-react";
import { 
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
import { useSession } from "@/lib/auth-client";
import { GithubIcon } from "@/components/shared/BrandIcons";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = (session?.user as any)?.role === "admin";
  const filteredNavigation = navigation.filter(
    (item) => item.href !== "/dashboard/admin" || isAdmin
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer (Overlay and Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Menu */}
          <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-background border-r border-white/5 z-50">
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-muted-foreground hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center shrink-0 px-6 pb-4 border-b border-white/5">
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Terminal className="h-4.5 w-4.5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">
                  Codexa<span className="text-primary">.</span>
                </span>
              </Link>
            </div>

            <nav className="flex-grow px-4 mt-5 space-y-1.5 overflow-y-auto">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
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
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
