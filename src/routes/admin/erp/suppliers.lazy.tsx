import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPSuppliers,
  fetchERPSupplierDetail,
  createERPSupplier,
  updateERPSupplier,
  deleteERPSupplier,
  type ERPSupplier,
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
  Eye,
  RotateCw,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createLazyFileRoute("/admin/erp/suppliers")({
  component: ERPSuppliersPage,
});

function ERPSuppliersPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [suppliers, setSuppliers] = useState<ERPSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ERPSupplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ERPSupplier | null>(null);
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("Aadhaar");
  const [idNumber, setIdNumber] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, [session, search]);

  async function loadSuppliers() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPSuppliers(session.access_token, search || undefined);
      if (res.success) {
        setSuppliers(res.suppliers);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingSupplier(null);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setIdType("Aadhaar");
    setIdNumber("");
    setDialogOpen(true);
  }

  function openEdit(s: ERPSupplier) {
    setEditingSupplier(s);
    setName(s.name);
    setPhone(s.phone || "");
    setEmail(s.email || "");
    setAddress(s.address || "");
    setIdType(s.id_type || "Aadhaar");
    setIdNumber(s.id_number || "");
    setDialogOpen(true);
  }

  async function viewDetail(s: ERPSupplier) {
    setSelectedSupplier(s);
    setRecentTxns([]);
    setDetailOpen(true);
    setLoadingDetail(true);
    try {
      const res = await fetchERPSupplierDetail(s.id, session?.access_token);
      if (res.success) {
        setRecentTxns(res.recent_transactions);
      }
    } catch {
      toast.error("Could not fetch supplier details");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Supplier name is required");

    const payload = {
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      address: address.trim() || null,
      id_type: idType || null,
      id_number: idNumber.trim() || null,
    };

    try {
      if (editingSupplier) {
        const res = await updateERPSupplier(editingSupplier.id, payload, session?.access_token);
        if (res.success) {
          toast.success("Supplier profile updated");
          setDialogOpen(false);
          loadSuppliers();
        }
      } else {
        const res = await createERPSupplier(payload, session?.access_token);
        if (res.success) {
          toast.success("Supplier registered successfully");
          setDialogOpen(false);
          loadSuppliers();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save supplier profile");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await deleteERPSupplier(id, session?.access_token);
      if (res.success) {
        toast.success("Supplier profile deactivated");
        loadSuppliers();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete supplier");
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
            placeholder="Search suppliers name/phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border border-border bg-card text-xs"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSuppliers}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" onClick={openCreate} className="rounded-xl gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Register Supplier
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
              <Skeleton className="h-5 w-48 animate-pulse" />
              <Skeleton className="h-5 w-24 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Suppliers Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">Verification ID</th>
                  <th className="px-6 py-4 text-right">Transactions</th>
                  <th className="px-6 py-4 text-right">Total Value</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{s.name}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        {s.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {s.phone}</span>}
                        {s.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {s.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {s.id_type ? (
                        <span>{s.id_type}: <strong>{s.id_number}</strong></span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">{s.total_transactions} txns</td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">₹ {s.total_value?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetail(s)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="View Ledger"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(s)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(s.id)}
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
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      No suppliers registered. Click "Register Supplier" to catalog.
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
        <DialogContent className="max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              {editingSupplier ? "Edit Supplier profile" : "Register B2B Supplier"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sup-name">Supplier Name / Business Name</Label>
              <Input
                id="sup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharma Metal Recycling Ltd"
                required
                className="rounded-xl border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sup-phone">WhatsApp Number</Label>
                <Input
                  id="sup-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sup-email">Email Address</Label>
                <Input
                  id="sup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@supplier.com"
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sup-address">Business Address</Label>
              <Input
                id="sup-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 12, Ind Area, Sector 5..."
                className="rounded-xl border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sup-id-type">Govt ID Verification Type</Label>
                <select
                  id="sup-id-type"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="GSTIN">GSTIN</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="Trade License">Trade License</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sup-id-num">ID Number</Label>
                <Input
                  id="sup-id-num"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ID Number..."
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl cursor-pointer">
                Save Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Supplier detail / ledger modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Supplier Business Ledger
            </DialogTitle>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-5">
              {/* Profile card summary */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-foreground">{selectedSupplier.name}</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    B2B PARTNER
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-2">
                  {selectedSupplier.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {selectedSupplier.phone}</span>}
                  {selectedSupplier.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {selectedSupplier.email}</span>}
                  {selectedSupplier.address && <span className="col-span-2 flex items-start gap-1"><MapPin className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {selectedSupplier.address}</span>}
                  {selectedSupplier.id_type && <span className="col-span-2 flex items-center gap-1"><FileText className="h-3 w-3 text-primary shrink-0" /> ID Verified — {selectedSupplier.id_type}: {selectedSupplier.id_number}</span>}
                </div>
              </div>

              {/* Transactions log */}
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-2">Recent scale ticket purchases (B2B)</h3>
                {loadingDetail && (
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-6 w-full animate-pulse" />
                    <Skeleton className="h-6 w-full animate-pulse" />
                  </div>
                )}

                {!loadingDetail && recentTxns.length === 0 && (
                  <p className="text-center py-6 text-xs text-muted-foreground">
                    No transactions registered under this supplier.
                  </p>
                )}

                {!loadingDetail && recentTxns.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card max-h-[220px] overflow-y-auto pr-1">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                          <th className="p-2.5 font-medium">Txn No.</th>
                          <th className="p-2.5 font-medium">Date</th>
                          <th className="p-2.5 font-medium">Material</th>
                          <th className="p-2.5 font-medium text-right">Qty</th>
                          <th className="p-2.5 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentTxns.map((t) => (
                          <tr key={t.id} className="hover:bg-muted/10">
                            <td className="p-2.5 font-semibold text-foreground">{t.txn_number}</td>
                            <td className="p-2.5 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                            <td className="p-2.5 text-foreground font-medium">{t.material_name}</td>
                            <td className="p-2.5 text-right text-muted-foreground">{t.weight} {t.unit}</td>
                            <td className="p-2.5 text-right font-bold text-foreground">₹{Number(t.total_amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setDetailOpen(false)} className="rounded-xl cursor-pointer">
                  Close Ledger
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
