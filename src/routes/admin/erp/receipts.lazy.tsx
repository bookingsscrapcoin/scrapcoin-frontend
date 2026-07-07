import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPPurchaseReceipts,
  fetchERPMaterials,
  fetchERPCustomers,
  createERPPurchaseReceipt,
  deleteERPPurchaseReceipt,
  type ERPPurchaseReceipt,
  type ERPMaterial,
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
  Trash2,
  Printer,
  RotateCw,
  Scale,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createLazyFileRoute("/admin/erp/receipts")({
  component: ERPReceiptsPage,
});

// A5 PDF Generator for B2C Receipts
async function generateReceiptPDF(r: ERPPurchaseReceipt) {
  const windowObj = window as any;
  if (!windowObj.jspdf) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load PDF library"));
      document.head.appendChild(script);
    });
  }
  const { jsPDF } = windowObj.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
  
  const PW = 148, PH = 210;
  const AMBER = [245, 166, 35];
  const DARK = [13, 14, 15];
  const WHITE = [255, 255, 255];
  const GREY = [248, 249, 250];
  const MID = [100, 110, 120];
  const BORDER = [220, 222, 226];
  const GREEN = [22, 163, 74];

  const sf = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const st = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const sd = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);
  const fn = (sz: number, style = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(sz);
  };
  const inr = (n: number) => "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const rta = (txt: string, x: number, y: number) => doc.text(txt, x - doc.getTextWidth(txt), y);

  // Header
  sf(AMBER); doc.rect(0, 0, PW, 28, "F");
  fn(16, "bold"); st(WHITE); doc.text("THE SCRAP CO.", 12, 11);
  fn(7); st([255, 230, 170]);
  doc.text("Sector 16C, Greater Noida West | support@scrapco.in", 12, 17);
  fn(9, "bold"); st(WHITE); rta("PAYMENT RECEIPT", PW - 10, 11);
  fn(8); st([255, 230, 170]); rta(r.receipt_number, PW - 10, 18);

  // Date + Payment Method
  fn(8); st(MID);
  doc.text("Date: " + new Date(r.created_at).toLocaleDateString("en-IN"), 12, 36);
  sf(GREY); sd(BORDER); doc.setLineWidth(0.2);
  doc.roundedRect(PW - 42, 30, 32, 9, 2, 2, "FD");
  fn(7, "bold"); st(DARK); rta(r.payment_method.toUpperCase(), PW - 11, 36);

  // Paid to Customer details
  sf(GREY); sd(BORDER);
  doc.roundedRect(12, 42, PW - 24, 22, 2, 2, "FD");
  fn(7, "bold"); st([180, 83, 9]); doc.text("PAID TO CUSTOMER", 17, 49);
  fn(11, "bold"); st(DARK); doc.text(r.customer_name || "Walk-in Customer", 17, 57);
  if (r.customer_phone) {
    fn(8); st(MID);
    doc.text("Phone: " + r.customer_phone, 17, 63);
  }

  // Items table
  const ty = 72;
  sf(DARK); doc.rect(12, ty, PW - 24, 8, "F");
  fn(7, "bold"); st(AMBER);
  doc.text("Material Collected", 16, ty + 5.5);
  doc.text("Weighed Qty", 72, ty + 5.5);
  rta("Rate/Unit", PW - 36, ty + 5.5);
  rta("Payout", PW - 12, ty + 5.5);

  sf(GREY); sd(BORDER);
  doc.rect(12, ty + 8, PW - 24, 12, "FD");
  fn(9, "bold"); st(DARK);
  doc.text(r.material_name, 16, ty + 16);
  fn(9); st(MID);
  doc.text(`${r.weight} ${r.unit}`, 72, ty + 16);
  rta(inr(r.price_per_unit), PW - 36, ty + 16);
  fn(10, "bold"); st(DARK);
  rta(inr(r.total_amount), PW - 12, ty + 16);

  // Total payout highlight box
  sf(AMBER); doc.roundedRect(PW - 70, ty + 26, 58, 16, 2, 2, "F");
  fn(8); st(WHITE); doc.text("TOTAL CASH PAID OUT", PW - 68, ty + 33);
  fn(14, "bold"); rta(inr(r.total_amount), PW - 12, ty + 40);

  // PAID green stamp
  fn(28, "bold"); st([...GREEN, 0.08]);
  doc.text("PAID", PW / 2 - 8, ty + 38);

  if (r.notes) {
    fn(7); st(MID);
    doc.text("Note: " + r.notes, 12, ty + 62);
  }

  // Footer
  sf(DARK); doc.rect(0, PH - 14, PW, 14, "F");
  fn(7, "bold"); st(AMBER); doc.text("THE SCRAP CO. ERP", 12, PH - 6);
  fn(6.5); st([140, 145, 150]);
  doc.text("support@scrapco.in | Doorstep Pickup Service", 50, PH - 6);

  doc.save(`Receipt_${r.receipt_number}.pdf`);
}

function ERPReceiptsPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [receipts, setReceipts] = useState<ERPPurchaseReceipt[]>([]);
  const [materials, setMaterials] = useState<ERPMaterial[]>([]);
  const [customers, setCustomers] = useState<ERPCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [payMethod, setPayMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadReceipts();
  }, [session, search]);

  useEffect(() => {
    if (dialogOpen && session?.access_token) {
      fetchERPMaterials(session.access_token).then((res) => {
        if (res.success) setMaterials(res.materials);
      });
      fetchERPCustomers(session.access_token).then((res) => {
        if (res.success) setCustomers(res.customers);
      });
    }
  }, [dialogOpen, session]);

  // Autodetect rate when material changes
  useEffect(() => {
    if (materialId) {
      const selected = materials.find((m) => m.id === materialId);
      if (selected) {
        setPrice(selected.buy_price);
      }
    }
  }, [materialId, materials]);

  async function loadReceipts() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPPurchaseReceipts(session.access_token);
      if (res.success) {
        setReceipts(res.receipts);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setCustomerId("");
    setMaterialId("");
    setWeight("");
    setPrice("");
    setPayMethod("cash");
    setNotes("");
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!materialId) return toast.error("Material selection is required");
    if (!weight || Number(weight) <= 0) return toast.error("Please enter weighed weight");
    if (price === "" || Number(price) <= 0) return toast.error("Please enter buying rate");

    setSubmitting(true);
    try {
      const payload = {
        customer_id: customerId || null,
        material_id: materialId,
        weight: Number(weight),
        price_per_unit: Number(price),
        payment_method: payMethod,
        notes: notes.trim() || null,
      };

      const res = await createERPPurchaseReceipt(payload, session?.access_token);
      if (res.success) {
        toast.success("B2C Pickup receipt recorded successfully!");
        setDialogOpen(false);
        loadReceipts();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save scale receipt");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete B2C scale receipt? This reverses material stock counts and clears customer visit figures. Proceed?")) return;
    try {
      const res = await deleteERPPurchaseReceipt(id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
        loadReceipts();
      }
    } catch (err: any) {
      toast.error(err.message || "Receipt deletion failed");
    }
  }

  const calcTotal = Number(weight || 0) * Number(price || 0);

  const filtered = receipts.filter(
    (r) =>
      r.receipt_number.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.material_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search receipt list..."
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
            onClick={loadReceipts}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" onClick={openCreate} className="rounded-xl gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Scale Ticket (B2C)
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

      {/* Receipts Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Receipt No</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Material Collected</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Unit Rate</th>
                  <th className="px-6 py-4 text-right">Cash Paid</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{r.receipt_number}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {new Date(r.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground truncate max-w-[140px]">
                      {r.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {r.material_name}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                      {r.weight.toLocaleString()} {r.unit}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">₹{r.price_per_unit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">₹{r.total_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generateReceiptPDF(r)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(r.id)}
                            className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Scale Receipt"
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
                      No household collection receipts logged. Click "Create Scale Ticket (B2C)" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* weigh ticket entry dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Log B2C Scale Collection Receipt
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rec-cust">Household Customer (Optional)</Label>
              <select
                id="rec-cust"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Walk-in Customer (Unregistered)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone || "No phone"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-material">Material Collected</Label>
              <select
                id="rec-material"
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Material...</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Buying: ₹{m.buy_price})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rec-weight">Collected Weight (kg)</Label>
                <Input
                  id="rec-weight"
                  type="number"
                  step="0.001"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value !== "" ? Number(e.target.value) : "")}
                  placeholder="0.000"
                  required
                  className="rounded-xl border border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rec-price">Buying Rate (₹/kg)</Label>
                <Input
                  id="rec-price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                  placeholder="₹ 0.00"
                  required
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/10 p-4 flex justify-between items-center font-bold text-xs">
              <span className="text-foreground">Total Cash Paid to Customer:</span>
              <span className="text-primary text-sm">₹ {calcTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="space-y-1.5">
              <Label>Payment Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                {["cash", "upi", "bank_transfer"].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={payMethod === m ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPayMethod(m)}
                    className="rounded-xl text-[10px] uppercase font-bold cursor-pointer"
                  >
                    {m.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-notes">Remarks / Notes</Label>
              <Input
                id="rec-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Scale number, vehicle details..."
                className="rounded-xl border border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-xl cursor-pointer">
                {submitting ? "Saving Receipt..." : "Record Scale Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
