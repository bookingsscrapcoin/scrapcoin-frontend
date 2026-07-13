import { ab as createLazyFileRoute, ac as useNavigate, r as reactExports, L as jsxRuntimeExports, ad as format, az as Trash2, ae as toast } from "./vendor-2vo6rCki.js";
import { A as AdminLayout, S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./AdminLayout-HWfbdFfs.js";
import { B as Badge } from "./badge-CVe_lemD.js";
import { u as useAuth, B as Button } from "./router-Bm2DwBTt.js";
import { I as Input } from "./input-CHEJR8Jq.js";
import { L as Label } from "./label-CKN70qdY.js";
import { S as Skeleton } from "./skeleton-D2nk5Uf8.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DKmRMJRb.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./brand-logo-BvyB8c9V.js";
import "./supabase-6bXjhJLX.js";
const Route = createLazyFileRoute("/admin/bookings")({
  component: AdminBookings
});
const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" }
};
const FILTERS = ["all", "scheduled", "in_progress", "completed", "cancelled"];
const API_BASE = "http://localhost:4000";
function AdminBookings() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === "admin";
  const [bookings, setBookings] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const [updating, setUpdating] = reactExports.useState(false);
  const [weightsForm, setWeightsForm] = reactExports.useState({});
  const [showWeightForm, setShowWeightForm] = reactExports.useState(false);
  const [champions, setChampions] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/" });
      return;
    }
    if (profile && profile.role !== "admin" && profile.role !== "champion") {
      navigate({ to: "/" });
      return;
    }
  }, [user, profile, authLoading, navigate]);
  reactExports.useEffect(() => {
    if (!session?.access_token) return;
    async function fetchBookings() {
      try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (!res.ok) throw new Error("Failed");
        setBookings(await res.json());
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [session]);
  reactExports.useEffect(() => {
    if (!session?.access_token || profile?.role !== "admin") return;
    async function fetchChampions() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/champions`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          setChampions(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch champions:", err);
      }
    }
    fetchChampions();
  }, [session, profile]);
  async function updateStatus(id, status) {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => b.id === id ? updated : b));
      setSelected(updated);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }
  async function updateChampion(bookingId, championId) {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ championId })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to assign champion");
      }
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => b.id === bookingId ? updated : b));
      setSelected(updated);
      toast.success("Champion assigned");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign champion");
    } finally {
      setUpdating(false);
    }
  }
  async function deleteBookingClick(id) {
    if (!isAdmin) return;
    const confirmed = window.confirm("Are you sure to permanently delete this booking");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete booking");
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) {
        setSelected(null);
      }
      toast.success("Booking permanently deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete booking");
    }
  }
  const filtered = bookings.filter((b) => filter === "all" || b.status === filter).filter((b) => {
    const q = search.toLowerCase();
    return b.fullName.toLowerCase().includes(q) || b.phone.includes(q);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Bookings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name or phone...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "max-w-xs"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: filter === f ? "default" : "outline",
            className: "rounded-full capitalize text-xs",
            onClick: () => setFilter(f),
            children: f.replace("_", " ")
          },
          f
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No bookings found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-muted-foreground", children: [
          ["Name", "Phone", "Society", "Pickup Date", "Materials", "Champion", "Status"].map(
            (h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium whitespace-nowrap", children: h }, h)
          ),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium whitespace-nowrap text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((b) => {
          const s = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.scheduled;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              onClick: () => setSelected(b),
              className: "cursor-pointer hover:bg-muted/30 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: b.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: b.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
                  b.society,
                  b.tower ? ` · ${b.tower}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: format(new Date(b.pickupDate), "d MMM yyyy") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[160px] truncate", children: b.materials.join(", ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap max-w-[150px] truncate", children: b.championEmail ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic", children: "Unassigned" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `rounded-full text-xs ${s.className}`,
                    children: s.label
                  }
                ) }),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => deleteBookingClick(b.id),
                    className: "h-7 w-7 rounded-lg text-red-500 hover:text-red-650 hover:bg-red-50 cursor-pointer",
                    title: "Delete Booking",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ]
            },
            b.id
          );
        }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Sheet,
      {
        open: !!selected,
        onOpenChange: (o) => {
          if (!o) {
            setSelected(null);
            setShowWeightForm(false);
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "w-full sm:max-w-md overflow-y-auto", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Booking Details" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: selected.fullName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: selected.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Society" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground", children: [
                  selected.society,
                  selected.tower ? ` · ${selected.tower}` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Pickup Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: format(new Date(selected.pickupDate), "EEE, d MMM yyyy") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Booked On" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: format(new Date(selected.createdAt), "d MMM yyyy") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Materials" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1", children: selected.materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs",
                    children: m
                  },
                  m
                )) })
              ] })
            ] }),
            !showWeightForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2", children: "Update Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: selected.status,
                  onValueChange: (val) => {
                    if (val === "completed") {
                      const initial = {};
                      selected.materials.forEach((m) => {
                        initial[m] = "";
                      });
                      setWeightsForm(initial);
                      setShowWeightForm(true);
                    } else {
                      updateStatus(selected.id, val);
                    }
                  },
                  disabled: updating || profile?.role === "champion" && selected.status === "completed",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "scheduled", children: "Scheduled" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "in_progress", children: "In Progress" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
                    ] })
                  ]
                }
              )
            ] }),
            !showWeightForm && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: profile?.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2", children: "Assign Champion" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: selected.championId ?? "unassigned",
                  onValueChange: (val) => {
                    updateChampion(selected.id, val === "unassigned" ? null : val);
                  },
                  disabled: updating,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Champion" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassigned", children: "Unassigned" }),
                      champions.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.email }, c.id))
                    ] })
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Assigned Champion" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: selected.championEmail ?? "Unassigned" })
            ] }) }),
            showWeightForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-xs uppercase tracking-wider", children: "Record Actual Weights (kg)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: selected.materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `weight-${m}`, className: "text-xs text-muted-foreground", children: m }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: `weight-${m}`,
                    type: "number",
                    step: "any",
                    placeholder: "0.0",
                    value: weightsForm[m] ?? "",
                    onChange: (e) => setWeightsForm((prev) => ({ ...prev, [m]: e.target.value })),
                    className: "rounded-xl",
                    required: true
                  }
                )
              ] }, m)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "w-full rounded-xl cursor-pointer",
                    onClick: () => setShowWeightForm(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "w-full rounded-xl cursor-pointer",
                    disabled: updating,
                    onClick: async () => {
                      const weightsPayload = {};
                      let isValid = true;
                      selected.materials.forEach((m) => {
                        const val = Number(weightsForm[m]);
                        if (isNaN(val) || val <= 0) {
                          isValid = false;
                        }
                        weightsPayload[m] = val;
                      });
                      if (!isValid) {
                        toast.error("Please enter a valid positive number for all weights.");
                        return;
                      }
                      setUpdating(true);
                      try {
                        const res = await fetch(`${API_BASE}/api/bookings/${selected.id}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.access_token}`
                          },
                          body: JSON.stringify({
                            status: "completed",
                            actualWeights: weightsPayload
                          })
                        });
                        if (!res.ok) throw new Error("Failed");
                        const updated = await res.json();
                        setBookings(
                          (prev) => prev.map((b) => b.id === selected.id ? updated : b)
                        );
                        setSelected(updated);
                        setShowWeightForm(false);
                        toast.success("Order completed with weights!");
                      } catch {
                        toast.error("Failed to complete order");
                      } finally {
                        setUpdating(false);
                      }
                    },
                    children: updating ? "Completing..." : "Complete Pickup"
                  }
                )
              ] })
            ] }),
            selected.status === "completed" && selected.actualWeights && Object.keys(selected.actualWeights).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-2", children: "Recorded Weights" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 bg-muted/40 rounded-xl p-3 border border-border/40", children: Object.entries(selected.actualWeights).map(([mat, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  mat,
                  ":"
                ] }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                  weight,
                  " kg"
                ] })
              ] }, mat)) })
            ] }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => deleteBookingClick(selected.id),
                className: "rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-605 cursor-pointer gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Delete Booking"
                ]
              }
            ) })
          ] })
        ] }) })
      }
    )
  ] });
}
export {
  Route
};
