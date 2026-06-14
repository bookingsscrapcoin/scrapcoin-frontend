import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

type Category = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function AdminCategories() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    id: "",
    name: "",
    unit: "kg",
    price_per_unit: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "admin")) {
      navigate({ to: "/" });
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (!session?.access_token) return;
    fetchCategories();
  }, [session]);

  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories`);
      if (!res.ok) throw new Error("Failed");
      const data: Category[] = await res.json();
      setCategories(data);
      const prices: Record<string, string> = {};
      data.forEach((c) => {
        prices[c.id] = String(c.pricePerUnit);
      });
      setEditPrices(prices);
    } finally {
      setLoading(false);
    }
  }

  async function savePrice(id: string) {
    setSaving(id);
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ price_per_unit: Number(editPrices[id]) }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated: Category = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success("Price updated");
    } catch {
      toast.error("Failed to update price");
    } finally {
      setSaving(null);
    }
  }

  async function addCategory() {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({
          ...newCat,
          price_per_unit: Number(newCat.price_per_unit),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const created: Category = await res.json();
      setCategories((prev) => [...prev, created]);
      setEditPrices((prev) => ({
        ...prev,
        [created.id]: String(created.pricePerUnit),
      }));
      setNewCat({ id: "", name: "", unit: "kg", price_per_unit: "" });
      setAddOpen(false);
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  }

  async function deleteCategory(id: string) {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session!.access_token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Categories & Pricing
          </h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label>ID (slug)</Label>
                  <Input
                    placeholder="e.g. glass"
                    value={newCat.id}
                    onChange={(e) =>
                      setNewCat((p) => ({ ...p, id: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g. Glass"
                    value={newCat.name}
                    onChange={(e) =>
                      setNewCat((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit</Label>
                  <Input
                    placeholder="kg"
                    value={newCat.unit}
                    onChange={(e) =>
                      setNewCat((p) => ({ ...p, unit: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Price per unit (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newCat.price_per_unit}
                    onChange={(e) =>
                      setNewCat((p) => ({ ...p, price_per_unit: e.target.value }))
                    }
                  />
                </div>
                <Button className="w-full rounded-full" onClick={addCategory}>
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No categories yet. Add one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-left text-muted-foreground">
                    {["Name", "Unit", "Price per kg (₹)", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {c.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="w-24 h-8 text-sm"
                            value={editPrices[c.id] ?? ""}
                            onChange={(e) =>
                              setEditPrices((prev) => ({
                                ...prev,
                                [c.id]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            className="h-8 rounded-full text-xs"
                            disabled={saving === c.id}
                            onClick={() => savePrice(c.id)}
                          >
                            {saving === c.id ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete category?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete{" "}
                                <strong>{c.name}</strong>. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteCategory(c.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
