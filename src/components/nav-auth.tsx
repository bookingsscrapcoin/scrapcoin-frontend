import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";

export function NavAuth() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

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
