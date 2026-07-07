import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPCustomers,
  fetchERPCustomerDetail,
  createERPCustomer,
  updateERPCustomer,
  deleteERPCustomer,
  type ERPCustomer,
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

export const Route = createLazyFileRoute("/admin/erp/customers")({
  component: ERPCustomersPage,
});

function ERPCustomersPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [customers, setCustomers] = useState<ERPCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ERPCustomer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ERPCustomer | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("Aadhaar");
  const [idNumber, setIdNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadCustomers();
  }, [session, search]);

  async function loadCustomers() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPCustomers(session.access_token, search || undefined);
      if (res.success) {
        setCustomers(res.customers);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setAddress("");
    setIdType("Aadhaar");
    setIdNumber("");
    setNotes("");
    setDialogOpen(true);
  }

  function openEdit(c: ERPCustomer) {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setIdType(c.id_type || "Aadhaar");
    setIdNumber(c.id_number || "");
    setNotes(c.notes || "");
    setDialogOpen(true);
  }

  async function viewDetail(c: ERPCustomer) {
    setSelectedCustomer(c);
    setRecentReceipts([]);
    setDetailOpen(true);
    setLoadingDetail(true);
    try {
      const res = await fetchERPCustomerDetail(c.id, session?.access_token);
      if (res.success) {
        setRecentReceipts(res.receipts);
      }
    } catch {
      toast.error("Could not fetch customer ledger logs");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Customer name is required");

    const payload = {
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
      id_type: idType || null,
      id_number: idNumber.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (editingCustomer) {
        const res = await updateERPCustomer(editingCustomer.id, payload, session?.access_token);
        if (res.success) {
          toast.success("Customer profile updated");
          setDialogOpen(false);
          loadCustomers();
        }
      } else {
        const res = await createERPCustomer(payload, session?.access_token);
        if (res.success) {
          toast.success("Customer registered successfully");
          setDialogOpen(false);
          loadCustomers();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save customer profile");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this customer?")) return;
    try {
      const res = await deleteERPCustomer(id, session?.access_token);
      if (res.success) {
        toast.success("Customer profile deactivated");
        loadCustomers();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete customer");
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
            placeholder="Search B2C customers list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border border-border bg-card text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCustomers}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" onClick={openCreate} className="rounded-xl gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Household Customer
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

      {/* Customers Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">Verification ID</th>
                  <th className="px-6 py-4 text-right">Pickups visits</th>
                  <th className="px-6 py-4 text-right">Lifetime Paid</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span>{c.name}</span>
                        {c.notes && (
                          <span className="text-[10px] text-muted-foreground font-normal italic truncate max-w-[150px]">
                            {c.notes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {c.phone ? (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {c.id_type ? (
                        <span>{c.id_type}: <strong>{c.id_number}</strong></span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">{c.total_visits} collections</td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">₹ {c.total_paid?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetail(c)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="View Ledger"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(c.id)}
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
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      No household customers registered. Click "Add Household Customer" to create.
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
              {editingCustomer ? "Edit Customer details" : "Register B2C Customer (Household)"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cust-name">Customer Name</Label>
              <Input
                id="cust-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                required
                className="rounded-xl border border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cust-phone">WhatsApp/Phone</Label>
                <Input
                  id="cust-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-address">Apartment/Flat address</Label>
                <Input
                  id="cust-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Gaur City Tower B FLAT 1402..."
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cust-id-type">Govt ID Type</Label>
                <select
                  id="cust-id-type"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-id-num">ID Verification Number</Label>
                <Input
                  id="cust-id-num"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="ID Card Number..."
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cust-notes">Internal Remarks / Notes</Label>
              <Input
                id="cust-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="RWA coordinator, bulk supplier..."
                className="rounded-xl border border-border"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl cursor-pointer">
                Save Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer ledger details / receipts dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Customer Collection History (Ledger)
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-5">
              {/* Profile summary card */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-foreground">{selectedCustomer.name}</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    HOUSEHOLD B2C CUSTOMER
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-2">
                  {selectedCustomer.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {selectedCustomer.phone}</span>}
                  {selectedCustomer.address && <span className="col-span-2 flex items-start gap-1"><MapPin className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {selectedCustomer.address}</span>}
                  {selectedCustomer.id_type && <span className="col-span-2 flex items-center gap-1"><FileText className="h-3 w-3 text-primary shrink-0" /> ID verified — {selectedCustomer.id_type}: {selectedCustomer.id_number}</span>}
                </div>
              </div>

              {/* Purchase receipts log */}
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-2">Household collections scale receipts (B2C)</h3>
                {loadingDetail && (
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-6 w-full animate-pulse" />
                    <Skeleton className="h-6 w-full animate-pulse" />
                  </div>
                )}

                {!loadingDetail && recentReceipts.length === 0 && (
                  <p className="text-center py-6 text-xs text-muted-foreground">
                    No scale pickup collections logged for this customer.
                  </p>
                )}

                {!loadingDetail && recentReceipts.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-border bg-card max-h-[220px] overflow-y-auto pr-1">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                          <th className="p-2.5 font-medium">Receipt No</th>
                          <th className="p-2.5 font-medium">Date</th>
                          <th className="p-2.5 font-medium">Material</th>
                          <th className="p-2.5 font-medium text-right">Weighed Qty</th>
                          <th className="p-2.5 font-medium text-right">Paid Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentReceipts.map((r) => (
                          <tr key={r.id} className="hover:bg-muted/10 animate-in fade-in duration-100">
                            <td className="p-2.5 font-semibold text-foreground">{r.receipt_number}</td>
                            <td className="p-2.5 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                            <td className="p-2.5 text-foreground font-medium">{r.material_name}</td>
                            <td className="p-2.5 text-right text-muted-foreground">{r.weight} {r.unit}</td>
                            <td className="p-2.5 text-right font-bold text-foreground">₹{Number(r.total_amount).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setDetailOpen(false)} className="rounded-xl cursor-pointer">
                  Close Details
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
