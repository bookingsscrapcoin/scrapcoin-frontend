import { ac as useNavigate, L as jsxRuntimeExports, a0 as Link, b2 as LogOut, ae as toast } from "./vendor-CEtpOJd4.js";
import { u as useAuth, T as TooltipProvider, a as Tooltip, d as TooltipTrigger, A as Avatar, e as AvatarFallback, f as TooltipContent, B as Button } from "./router-DDR9fjQH.js";
function NavAuth() {
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
  if (loading) return null;
  if (user) {
    const userInitials = user.email ? user.email.slice(0, 2).toUpperCase() : "U";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-full border border-border/80 bg-background/85 backdrop-blur-md pl-3 pr-2.5 py-1.5 shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-r border-border/60 pr-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-6 w-6 border border-border cursor-help", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px] font-bold bg-primary/10 text-primary", children: userInitials }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { side: "bottom", align: "end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium", children: "Logged in as:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] opacity-80", children: user.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline text-xs font-medium text-foreground max-w-[120px] truncate", title: user.email, children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/my-bookings",
          className: "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
          children: "My Bookings"
        }
      ),
      (profile?.role === "admin" || profile?.role === "champion") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/admin",
          className: "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
          children: profile.role === "champion" ? "Champion Panel ⚙️" : "Admin ⚙️"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer",
          onClick: handleSignOut,
          title: "Sign out",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" })
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "rounded-full shadow-sm hover:shadow", children: "Sign in" }) });
}
export {
  NavAuth as N
};
