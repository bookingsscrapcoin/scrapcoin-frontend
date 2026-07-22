import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut, Bell, Calendar, CheckCircle2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchERPNotifications, markAllERPNotificationsRead, type ERPNotification } from "@/lib/api";

export function NavAuth() {
  const { user, profile, session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<ERPNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || (profile?.role !== "admin" && profile?.role !== "champion")) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [user, profile]);

  async function loadNotifications() {
    try {
      const data = await fetchERPNotifications(session?.access_token || undefined);
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.is_read).length);
    } catch {
      // silently fail/ignore if table is missing
    }
  }

  async function handleMarkAllRead() {
    try {
      const res = await markAllERPNotificationsRead(session?.access_token || undefined);
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        toast.success("Notifications marked as read");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark notifications read");
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out");
      await navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out");
    }
  }

  // Don't render until auth is ready
  if (loading) return null;

  if (user) {
    const userInitials = user.email ? user.email.slice(0, 2).toUpperCase() : "U";

    return (
      <TooltipProvider>
        <div className="flex items-center gap-3 rounded-full border border-border/80 bg-background/85 backdrop-blur-md pl-3 pr-2.5 py-1.5 shadow-md">
          <div className="flex items-center gap-2 border-r border-border/60 pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-6 w-6 border border-border cursor-help">
                  <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p className="text-[11px] font-medium">Logged in as:</p>
                <p className="text-[10px] opacity-80">{user.email}</p>
              </TooltipContent>
            </Tooltip>
            <span className="hidden lg:inline text-xs font-medium text-foreground max-w-[120px] truncate" title={user.email}>
              {user.email}
            </span>
          </div>

          <Link
            to="/my-bookings"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            My Bookings
          </Link>
          {(profile?.role === "admin" || profile?.role === "champion") && (
            <Link
              to="/admin"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {profile.role === "champion" ? "Champion Panel ⚙️" : "Admin ⚙️"}
            </Link>
          )}

          {(profile?.role === "admin" || profile?.role === "champion") && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-1 hover:bg-muted rounded-full transition-colors cursor-pointer flex items-center justify-center">
                  <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-2xl shadow-xl border border-border/80 bg-background/95 backdrop-blur-md z-50">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/20 rounded-t-2xl">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                    Recent Events
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                      <Bell className="h-8 w-8 text-muted-foreground/45 mb-2" />
                      <span className="text-xs font-semibold text-foreground">No recent events</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">You're all caught up!</span>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 transition-colors hover:bg-muted/30 flex gap-2.5 ${
                          !n.is_read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === "new_booking" ? (
                            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                          ) : n.type === "booking_status_change" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                          ) : n.type === "champion_assigned" ? (
                            <Truck className="h-3.5 w-3.5 text-blue-500" />
                          ) : (
                            <Bell className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-foreground truncate">{n.title}</span>
                            <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                              {new Date(n.created_at).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-border/60 p-2 text-center bg-muted/10 rounded-b-2xl">
                  <Link
                    to="/admin/erp/notifications"
                    className="block text-[11px] font-bold text-primary hover:text-primary/95 py-1"
                  >
                    View all notifications
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            onClick={handleSignOut}
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Link to="/login">
      <Button size="sm" className="rounded-full shadow-sm hover:shadow">
        Sign in
      </Button>
    </Link>
  );
}
