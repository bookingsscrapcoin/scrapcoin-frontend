import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

type Booking = {
  id: string;
  fullName: string;
  phone: string;
  society: string;
  tower?: string;
  pickupDate: string;
  materials: string[];
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
};

const FILTERS = ["all", "scheduled", "in_progress", "completed", "cancelled"] as const;
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function AdminBookings() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

// FIXED — waits for both auth AND profile to load
useEffect(() => {
  if (authLoading) return;
  if (!user) { navigate({ to: "/" }); return; }
  if (profile && profile.role !== "admin") { navigate({ to: "/" }); return; }
}, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (!session?.access_token) return;
    async function fetchBookings() {
      try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        if (!res.ok) throw new Error("Failed");
        setBookings(await res.json());
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [session]);

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated: Booking = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setSelected(updated);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        b.fullName.toLowerCase().includes(q) || b.phone.includes(q)
      );
    });

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>

        {/* Filters & search */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                className="rounded-full capitalize text-xs"
                onClick={() => setFilter(f)}
              >
                {f.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-left text-muted-foreground">
                    {["Name", "Phone", "Society", "Pickup Date", "Materials", "Status"].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => {
                    const s = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.scheduled;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelected(b)}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                          {b.fullName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {b.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {b.society}
                          {b.tower ? ` · ${b.tower}` : ""}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {format(new Date(b.pickupDate), "d MMM yyyy")}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                          {b.materials.join(", ")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`rounded-full text-xs ${s.className}`}
                          >
                            {s.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Booking Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{selected.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{selected.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Society</p>
                    <p className="font-medium text-foreground">
                      {selected.society}
                      {selected.tower ? ` · ${selected.tower}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pickup Date</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(selected.pickupDate), "EEE, d MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Booked On</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(selected.createdAt), "d MMM yyyy")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Materials</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selected.materials.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground mb-2">Update Status</p>
                  <Select
                    value={selected.status}
                    onValueChange={(val) => updateStatus(selected.id, val)}
                    disabled={updating}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
