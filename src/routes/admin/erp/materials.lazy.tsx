import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPMaterials,
  createERPMaterial,
  updateERPMaterial,
  deleteERPMaterial,
  fetchERPMaterialPriceHistory,
  type ERPMaterial,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  History,
  RotateCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createLazyFileRoute("/admin/erp/materials")({
  component: ERPMaterialsPage,
});

function ERPMaterialsPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [materials, setMaterials] = useState<ERPMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal controls
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<ERPMaterial | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("kg");
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [color, setColor] = useState("#f5a623");

  useEffect(() => {
    loadMaterials();
  }, [session]);

  async function loadMaterials() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPMaterials(session.access_token);
      if (res.success) {
        setMaterials(res.materials);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  }

  const categories = ["All", ...Array.from(new Set(materials.map((m) => m.category).filter(Boolean)))];

  const filtered = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function openCreate() {
    setEditingMaterial(null);
    setName("");
    setCategory("");
    setUnit("kg");
    setBuyPrice(0);
    setSellPrice(0);
    setStock(0);
    setThreshold(0);
    setColor("#f5a623");
    setDialogOpen(true);
  }

  function openEdit(m: ERPMaterial) {
    setEditingMaterial(m);
    setName(m.name);
    setCategory(m.category);
    setUnit(m.unit);
    setBuyPrice(m.buy_price);
    setSellPrice(m.sell_price);
    setStock(m.stock_qty);
    setThreshold(m.min_threshold);
    setColor(m.color_hex);
    setDialogOpen(true);
  }

  async function viewHistory(m: ERPMaterial) {
    setPriceHistory([]);
    setHistoryOpen(true);
    setLoadingHistory(true);
    try {
      const res = await fetchERPMaterialPriceHistory(m.id, session?.access_token);
      if (res.success) {
        setPriceHistory(res.history);
      }
    } catch {
      toast.error("Could not load price changes log");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Material name is required");

    const payload = {
      name: name.trim(),
      category,
      unit,
      buy_price: Number(buyPrice),
      sell_price: Number(sellPrice),
      min_threshold: Number(threshold),
      color_hex: color,
      stock_qty: Number(stock),
    };

    try {
      if (editingMaterial) {
        const res = await updateERPMaterial(editingMaterial.id, payload, session?.access_token);
        if (res.success) {
          toast.success("Material updated successfully");
          setDialogOpen(false);
          loadMaterials();
        }
      } else {
        const res = await createERPMaterial(payload, session?.access_token);
        if (res.success) {
          toast.success("Material registered successfully");
          setDialogOpen(false);
          loadMaterials();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save material details");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this material?")) return;
    try {
      const res = await deleteERPMaterial(id, session?.access_token);
      if (res.success) {
        toast.success("Material deactivated successfully");
        loadMaterials();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate material");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border border-border bg-card text-xs"
          />
        </div>

        {/* Category Toggles & Buttons */}
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 max-w-[280px] sm:max-w-xs overflow-x-auto whitespace-nowrap scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  categoryFilter === c
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadMaterials}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" onClick={openCreate} className="rounded-xl gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Material
          </Button>
        </div>
      </div>

      {/* Loading list skeleton */}
      {loading && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
              <Skeleton className="h-5 w-48 animate-pulse" />
              <Skeleton className="h-5 w-24 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Catalog Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Buying Price</th>
                  <th className="px-6 py-4 text-right">Selling Price</th>
                  <th className="px-6 py-4 text-right">Stock Level</th>
                  <th className="px-6 py-4 text-right">Min Threshold</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color_hex }} />
                        {m.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{m.category}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">₹ {m.buy_price.toFixed(2)} / {m.unit}</td>
                    <td className="px-6 py-4 text-right font-bold text-primary">₹ {m.sell_price.toFixed(2)} / {m.unit}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`font-semibold ${m.is_low_stock ? "text-red-500 font-bold" : "text-foreground"}`}>
                        {m.stock_qty.toLocaleString()} {m.unit}
                      </span>
                      {m.is_low_stock && (
                        <Badge variant="outline" className="ml-1.5 bg-red-50 text-red-600 border-red-100 text-[9px] rounded px-1.5 py-0">
                          ALERT
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{m.min_threshold} {m.unit}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewHistory(m)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Price Log"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(m)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(m.id)}
                            className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                      No materials cataloged in this filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {editingMaterial ? "Edit Material Catalog Details" : "Create Material Catalog Entry"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mat-name">Material Name</Label>
              <Input
                id="mat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Copper wire, Cardboard"
                required
                className="rounded-xl border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mat-category">Category</Label>
                <Input
                  id="mat-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Ferrous, Paper, Plastics..."
                  required
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mat-unit">Measuring Unit</Label>
                <Input
                  id="mat-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg, tons"
                  required
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mat-buy">Buying Price per unit (₹)</Label>
                <Input
                  id="mat-buy"
                  type="number"
                  step="0.01"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  required
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mat-sell">Selling Price per unit (₹)</Label>
                <Input
                  id="mat-sell"
                  type="number"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  required
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mat-stock">Initial Stock</Label>
                <Input
                  id="mat-stock"
                  type="number"
                  step="0.01"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  disabled={!!editingMaterial} // Stock should only be updated by transaction scale entries
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mat-threshold">Stock Alert Level (Min)</Label>
                <Input
                  id="mat-threshold"
                  type="number"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mat-color">Visual Tag Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="mat-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-16 p-0 border border-border rounded-xl cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-mono">{color.toUpperCase()}</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Log dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Price Revision Logs
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {loadingHistory && (
              <div className="space-y-2 py-4">
                <Skeleton className="h-6 w-full animate-pulse" />
                <Skeleton className="h-6 w-full animate-pulse" />
              </div>
            )}

            {!loadingHistory && priceHistory.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground">
                No price modifications recorded for this material.
              </p>
            )}

            {!loadingHistory && priceHistory.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {priceHistory.map((h) => (
                  <div key={h.id} className="rounded-xl border border-border bg-muted/10 p-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Edited by: {h.changed_by_name}</span>
                      <span>{new Date(h.changed_at).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px]">Buying Price Shift:</span>
                        <span className="font-semibold text-foreground">
                          ₹{h.old_buy_price} → <strong className="text-emerald-600">₹{h.new_buy_price}</strong>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px]">Selling Price Shift:</span>
                        <span className="font-semibold text-foreground">
                          ₹{h.old_sell_price} → <strong className="text-primary">₹{h.new_sell_price}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setHistoryOpen(false)} className="rounded-xl cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
