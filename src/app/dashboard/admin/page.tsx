"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  getAdminStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUserAccount, 
  getSystemLogs 
} from "@/server/actions/admin";
import { 
  Loader2, ShieldAlert, Users, Database, FileClock, ShieldAlert as AlertIcon, 
  ArrowUpDown, Trash2, ShieldCheck, UserX, Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      const [adminStats, allUsers, systemLogs] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getSystemLogs(),
      ]);
      setStats(adminStats);
      setUsers(allUsers);
      setLogs(systemLogs);
      setAuthorized(true);
    } catch (err) {
      console.error(err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionPending && session) {
      loadAdminData();
    }
  }, [session, sessionPending]);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setUpdatingUserId(userId);
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      // Update UI state
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      alert(`User role successfully changed to ${newRole}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user account? This action cannot be undone.")) return;
    try {
      await deleteUserAccount(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert("User account successfully deleted");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete user account");
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Enforce admin permission check
  if (!authorized) {
    return (
      <div className="p-8 max-w-md mx-auto text-center glass border border-red-500/20 bg-red-500/5 rounded-2xl space-y-4">
        <ShieldAlert className="h-10 w-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Access Denied</h3>
        <p className="text-xs text-muted-foreground">You do not have administrative privileges to view this control panel.</p>
        <a href="/dashboard" className="inline-block text-xs font-bold bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all">
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Control Panel</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Admin console for managing user roles, active accounts, database stats, and activity reports
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">{stats?.totalUsers || 0}</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Seeded Sheets</span>
            <Database className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">{stats?.totalSheets || 0}</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Scraping Solves</span>
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">{stats?.totalProblems || 0}</span>
        </div>

        <div className="p-5 rounded-2xl glass border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile Syncs</span>
            <FileClock className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">{stats?.activeSyncs || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Users Management (Left Table) */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white text-left flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-primary" /> Users Management
          </h3>

          <div className="glass border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Handles</th>
                    <th className="py-3.5 px-4 text-center">Role</th>
                    <th className="py-3.5 px-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-8 h-8 rounded-lg border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {user.name.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Synced handles check */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {user.leetcodeUsername && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">LC</span>
                          )}
                          {user.githubUsername && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">GH</span>
                          )}
                          {user.codeforcesUsername && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">CF</span>
                          )}
                          {user.codechefUsername && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CC</span>
                          )}
                          {(!user.leetcodeUsername && !user.githubUsername && !user.codeforcesUsername && !user.codechefUsername) && (
                            <span className="text-[8px] font-medium text-muted-foreground">none connected</span>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          user.role === "admin" 
                            ? "bg-red-500/10 border-red-500/20 text-red-400" 
                            : "bg-white/5 border-white/5 text-muted-foreground"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleRole(user.id, user.role)}
                            disabled={updatingUserId === user.id || user.id === session?.user?.id}
                            title="Toggle Admin Privilege"
                            className="p-2 rounded-xl bg-white/3 hover:bg-white/10 text-white border border-white/5 disabled:opacity-40 transition-all"
                          >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === session?.user?.id}
                            title="Delete User Account"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 disabled:opacity-40 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent logs (Right side) */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileClock className="h-4.5 w-4.5 text-primary" /> Recent System Logs
          </h3>

          <div className="glass border border-white/5 rounded-2xl p-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0 space-y-1.5">
                  <div className="flex justify-between items-baseline text-[9px] text-muted-foreground font-mono">
                    <span className="font-bold text-white truncate max-w-[120px]">{log.user?.name}</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal">{log.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No system log records yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
