import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPInvoices,
  payERPInvoice,
  type ERPInvoice,
  type ERPTransaction,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  RotateCw,
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/erp/invoices")({
  component: ERPInvoicesPage,
});

const STATUS_CONFIG = {
  paid: { label: "Paid", className: "bg-green-50 text-green-700 border-green-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-700 border-gray-200" },
};

// jsPDF generator trigger
async function generatePDFFromInvoice(i: ERPInvoice) {
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
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const PW = 210, PH = 297;
  const AMBER = [245, 166, 35];
  const DARK = [13, 14, 15];
  const CHAR = [50, 55, 60];
  const MUTED = [160, 165, 172];
  const BORDER = [220, 222, 226];
  const WHITE = [255, 255, 255];
  const AMB_LT = [254, 243, 219];
  const GREY_BG = [248, 249, 250];

  const sf = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const sd = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);
  const st = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const fn = (sz: number, style = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(sz);
  };
  const rta = (txt: string, x: number, y: number) => doc.text(txt, x - doc.getTextWidth(txt), y);
  const inr = (n: number) => "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  sf(AMBER); doc.rect(0, 0, PW, 38, "F");
  fn(22, "bold"); st(WHITE); doc.text("THE SCRAP CO. ERP", 20, 15);
  fn(8); st([255, 230, 170]);
  doc.text("The Scrap Co. Pvt. Ltd", 20, 21);
  doc.text("GSTIN: 27AABCS1234D1Z5 | support@scrapco.in", 20, 26);
  doc.text("Sector 16C, Greater Noida West, Uttar Pradesh - 201306", 20, 31);
  fn(26, "bold"); st(WHITE); rta("INVOICE", PW - 20, 17);
  fn(9); st([255, 230, 170]);
  rta(i.invoice_number, PW - 20, 25);
  rta("TXN: " + i.txn_number, PW - 20, 31);

  sf(AMB_LT); sd(AMB_LT);
  doc.roundedRect(20, 44, 170, 22, 3, 3, "FD");
  const dateStr = new Date(i.created_at).toLocaleDateString("en-IN");
  const metaFields = [
    { label: "INVOICE DATE", value: dateStr },
    { label: "DUE DATE", value: i.due_date ? new Date(i.due_date).toLocaleDateString("en-IN") : dateStr },
    { label: "STATUS", value: i.status.toUpperCase() },
    { label: "TRANSACTION", value: i.txn_number },
  ];
  metaFields.forEach((f, idx) => {
    const fx = 25 + idx * 43;
    fn(7); st(MUTED); doc.text(f.label, fx, 52);
    fn(9, "bold"); st(CHAR);
    doc.text(f.value, fx, 60);
  });

  sf(GREY_BG); sd(BORDER); doc.setLineWidth(0.2);
  doc.roundedRect(20, 75, 80, 30, 2, 2, "FD");
  fn(7, "bold"); st(AMBER); doc.text("BILL TO SUPPLIER", 25, 82);
  fn(11, "bold"); st(DARK); doc.text(i.supplier_name.slice(0, 26), 25, 90);
  if (i.supplier_phone) {
    fn(8); st(CHAR);
    doc.text("Phone: " + i.supplier_phone, 25, 96);
  }

  sf(GREY_BG); sd(BORDER);
  doc.roundedRect(108, 75, 82, 30, 2, 2, "FD");
  fn(7, "bold"); st(AMBER); doc.text("BANK PAYMENT INFO", 113, 82);
  const info = [
    ["UPI ID", "scrapco@icici"],
    ["IFSC Code", "ICIC0000213"],
    ["Account", "Scrap Co. ERP Ledger"],
  ];
  info.forEach(([lbl, val], idx) => {
    fn(7); st(MUTED); doc.text(lbl, 113, 89 + idx * 7);
    st(CHAR); rta(val, 188, 89 + idx * 7);
  });

  const tY = 117;
  sf(DARK); doc.rect(20, tY, 170, 10, "F");
  fn(7.5, "bold"); st(WHITE);
  doc.text("#", 25, tY + 7);
  doc.text("ITEM DESCRIPTION", 33, tY + 7);
  doc.text("MATERIAL", 100, tY + 7);
  rta("WEIGHT", 148, tY + 7);
  rta("PRICE", 170, tY + 7);
  rta("SUBTOTAL", 188, tY + 7);

  const rY = tY + 10;
  sf(WHITE); sd(BORDER); doc.rect(20, rY, 170, 14, "FD");
  fn(8.5); st(CHAR);
  doc.text("1", 25, rY + 9);
  doc.text(`${i.material_name} Scrap collection B2B entry`, 33, rY + 9);
  fn(8.5, "bold"); doc.text(i.material_name, 100, rY + 9);
  fn(8.5); rta(`${i.weight} ${i.unit}`, 148, rY + 9);
  rta(inr(i.price_per_unit), 170, rY + 9);
  fn(8.5, "bold"); rta(inr(i.amount), 188, rY + 9);

  const totY = rY + 24;
  sf(GREY_BG); sd(BORDER);
  doc.roundedRect(108, totY, 82, 40, 2, 2, "FD");
  fn(8.5); st(MUTED); doc.text("Subtotal", 113, totY + 10);
  st(CHAR); rta(inr(i.amount), 188, totY + 10);
  doc.line(113, totY + 14, 188, totY + 14);
  fn(8.5); st(MUTED); doc.text(`GST (0%)`, 113, totY + 21);
  st(CHAR); rta(inr(0), 188, totY + 21);
  doc.line(113, totY + 25, 188, totY + 25);

  sf(AMBER); doc.roundedRect(108, totY + 27, 82, 13, 2, 2, "F");
  fn(10, "bold"); st(WHITE);
  doc.text("TOTAL COLLECTED", 113, totY + 35);
  rta(inr(i.amount), 188, totY + 35);

  fn(7.5); st(MUTED); doc.text("Notes:", 20, totY + 12);
  fn(7.5); st(CHAR); doc.text(i.notes || "No custom remarks recorded.", 20, totY + 18, { width: 80 });

  sf(DARK); doc.rect(0, PH - 14, PW, 14, "F");
  fn(7.5, "bold"); st(AMBER); doc.text("THE SCRAP CO. ERP", 20, PH - 6);
  fn(7); st([140, 145, 150]);
  doc.text("support@scrapco.in | B2B Operations Portal", 57, PH - 6);

  if (i.status === "paid") {
    fn(50, "bold"); st([34, 197, 94]);
    doc.text("PAID", PW / 2 - 20, PH / 2, { angle: 30 });
  }

  doc.save(`Invoice_${i.invoice_number}.pdf`);
}

function ERPInvoicesPage() {
  const { session } = useAuth();

  const [invoices, setInvoices] = useState<ERPInvoice[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pay Dialog
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ERPInvoice | null>(null);
  const [payMethod, setPayMethod] = useState<"cash" | "upi" | "bank_transfer" | "cheque">("cash");
  const [payNotes, setPayNotes] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [session, statusFilter, search]);

  async function loadInvoices() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search; // simple search trigger

      const res = await fetchERPInvoices(session.access_token, params);
      if (res.success) {
        setInvoices(res.invoices);
        setSummary(res.summary);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load invoices log");
    } finally {
      setLoading(false);
    }
  }

  function openPay(i: ERPInvoice) {
    setSelectedInvoice(i);
    setPayMethod("cash");
    setPayNotes("");
    setPayDialogOpen(true);
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInvoice) return;

    setPaying(true);
    try {
      const res = await payERPInvoice(
        selectedInvoice.id,
        payMethod,
        payNotes.trim() || undefined,
        session?.access_token
      );
      if (res.success) {
        toast.success("Invoice paid successfully!");
        setPayDialogOpen(false);
        loadInvoices();
      }
    } catch (err: any) {
      toast.error(err.message || "Payment trigger failed");
    } finally {
      setPaying(false);
    }
  }

  const filtered = invoices.filter(
    (i) =>
      i.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Summary stats block */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Paid</span>
              <p className="text-xl font-bold text-emerald-600">₹{summary.paid_total.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">{summary.paid_count} settle tickets</span>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600/30" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Pending</span>
              <p className="text-xl font-bold text-amber-600">₹{summary.pending_total.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">{summary.pending_count} unpaid ledger tickets</span>
            </div>
            <CreditCard className="h-8 w-8 text-amber-500/30" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Overdue Bills</span>
              <p className="text-xl font-bold text-red-600">₹{summary.overdue_total.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">{summary.overdue_count} critical invoices</span>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500/30" />
          </div>
        </div>
      )}

      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice number/supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border border-border bg-card text-xs"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            {["all", "paid", "pending", "overdue"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all uppercase ${
                  statusFilter === st
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadInvoices}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
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

      {/* Invoices List Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Supplier Partner</th>
                  <th className="px-6 py-4">Scale Ticket Reference</th>
                  <th className="px-6 py-4 text-right">Bill Amount</th>
                  <th className="px-6 py-4 text-right">Due Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((inv) => {
                  const cfg = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                  return (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{inv.invoice_number}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Issued: {new Date(inv.created_at).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground truncate max-w-[140px]">{inv.supplier_name}</td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{inv.txn_number}</span>
                          <span className="text-[10px] font-semibold text-foreground">
                            {inv.material_name} ({inv.weight} {inv.unit})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">₹{inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap">
                        {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN") : "Immediate"}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Badge variant="outline" className={`rounded-full text-[10px] px-2 py-0.5 ${cfg.className}`}>
                          {cfg.label.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generatePDFFromInvoice(inv)}
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Download PDF Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {inv.status !== "paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPay(inv)}
                              className="rounded-xl font-semibold gap-1 py-1 cursor-pointer h-7 text-[10px]"
                            >
                              <CreditCard className="h-3 w-3" /> PAY BILL
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                      No invoices recorded under these selection parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Invoice Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Record Invoice Bill Settlement
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/10 p-4 text-xs space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Invoice Reference:</span>
                  <span className="text-foreground font-bold">{selectedInvoice.invoice_number}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="text-foreground">{selectedInvoice.supplier_name}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 font-bold text-sm">
                  <span className="text-foreground">Settle Amount:</span>
                  <span className="text-primary">₹ {selectedInvoice.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Mode / Settlement Channel</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "cash", label: "Cash" },
                    { val: "upi", label: "UPI" },
                    { val: "bank_transfer", label: "Bank Transfer" },
                    { val: "cheque", label: "Bank Cheque" },
                  ].map((m) => (
                    <Button
                      key={m.val}
                      type="button"
                      variant={payMethod === m.val ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPayMethod(m.val as any)}
                      className="rounded-xl font-semibold text-xs cursor-pointer h-9"
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pay-notes">Settlement Remarks</Label>
                <Input
                  id="pay-notes"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="UPI Ref ID, bank cheque numbers..."
                  className="rounded-xl border border-border"
                />
              </div>

              <DialogFooter className="pt-2 border-t border-border/40">
                <Button type="button" variant="ghost" onClick={() => setPayDialogOpen(false)} className="rounded-xl cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={paying} className="rounded-xl cursor-pointer">
                  {paying ? "Settling bill..." : "Complete Settle Payout"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
