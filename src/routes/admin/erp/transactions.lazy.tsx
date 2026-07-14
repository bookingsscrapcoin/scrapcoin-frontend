import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchERPTransactions,
  fetchERPMaterials,
  fetchERPSuppliers,
  createERPTransaction,
  updateERPTransaction,
  deleteERPTransaction,
  sendERPWhatsApp,
  type ERPTransaction,
  type ERPMaterial,
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
  Trash2,
  Download,
  MessageSquare,
  RotateCw,
  Scale,
  Calendar,
  Edit2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createLazyFileRoute("/admin/erp/transactions")({
  component: ERPTransactionsPage,
});

const INVOICE_STATUS_COLORS = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

// CDN PDF Helper
async function generatePDF(t: ERPTransaction) {
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

  // 1. Header Band
  sf(AMBER); doc.rect(0, 0, PW, 38, "F");
  fn(22, "bold"); st(WHITE); doc.text("THE SCRAP CO. ERP", 20, 15);
  fn(8); st([255, 230, 170]);
  doc.text("The Scrap Co. Pvt. Ltd", 20, 21);
  doc.text("GSTIN: 27AABCS1234D1Z5 | support@scrapco.in", 20, 26);
  doc.text("Sector 16C, Greater Noida West, Uttar Pradesh - 201306", 20, 31);
  fn(26, "bold"); st(WHITE); rta("INVOICE", PW - 20, 17);
  fn(9); st([255, 230, 170]);
  rta(t.invoice_number || t.txn_number, PW - 20, 25);
  rta("TXN: " + t.txn_number, PW - 20, 31);

  // 2. Meta Block
  sf(AMB_LT); sd(AMB_LT);
  doc.roundedRect(20, 44, 170, 22, 3, 3, "FD");
  const dateStr = new Date(t.created_at).toLocaleDateString("en-IN");
  const metaFields = [
    { label: "INVOICE DATE", value: dateStr },
    { label: "DUE DATE", value: dateStr },
    { label: "STATUS", value: (t.invoice_status || "pending").toUpperCase() },
    { label: "TRANSACTION", value: t.txn_number },
  ];
  metaFields.forEach((f, i) => {
    const fx = 25 + i * 43;
    fn(7); st(MUTED); doc.text(f.label, fx, 52);
    fn(9, "bold"); st(CHAR);
    doc.text(f.value, fx, 60);
  });

  // 3. Billing details
  sf(GREY_BG); sd(BORDER); doc.setLineWidth(0.2);
  doc.roundedRect(20, 75, 80, 30, 2, 2, "FD");
  fn(7, "bold"); st(AMBER); doc.text("BILL TO SUPPLIER", 25, 82);
  fn(11, "bold"); st(DARK); doc.text((t.supplier_name || "Supplier Partner").slice(0, 26), 25, 90);
  fn(8); st(CHAR);
  if (t.supplier_phone) doc.text("Phone: " + t.supplier_phone, 25, 96);

  // 4. Payment bank info
  sf(GREY_BG); sd(BORDER);
  doc.roundedRect(108, 75, 82, 30, 2, 2, "FD");
  fn(7, "bold"); st(AMBER); doc.text("BANK PAYMENT INFO", 113, 82);
  const info = [
    ["UPI ID", "scrapco@icici"],
    ["IFSC Code", "ICIC0000213"],
    ["Account", "Scrap Co. ERP Ledger"],
  ];
  info.forEach(([lbl, val], i) => {
    fn(7); st(MUTED); doc.text(lbl, 113, 89 + i * 7);
    st(CHAR); rta(val, 188, 89 + i * 7);
  });

  // 5. Material purchase description
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
  doc.text(`${t.material_name} Scrap collection B2B entry`, 33, rY + 9);
  fn(8.5, "bold"); doc.text(t.material_name, 100, rY + 9);
  fn(8.5); rta(`${t.weight} ${t.unit}`, 148, rY + 9);
  rta(inr(t.price_per_unit), 170, rY + 9);
  fn(8.5, "bold"); rta(inr(t.subtotal), 188, rY + 9);

  // 6. GST and final totals
  const totY = rY + 24;
  sf(GREY_BG); sd(BORDER);
  doc.roundedRect(108, totY, 82, 40, 2, 2, "FD");
  fn(8.5); st(MUTED); doc.text("Subtotal", 113, totY + 10);
  st(CHAR); rta(inr(t.subtotal), 188, totY + 10);
  doc.line(113, totY + 14, 188, totY + 14);
  fn(8.5); st(MUTED); doc.text(`GST (${t.gst_rate}%)`, 113, totY + 21);
  st(CHAR); rta(inr(t.gst_amount), 188, totY + 21);
  doc.line(113, totY + 25, 188, totY + 25);

  sf(AMBER); doc.roundedRect(108, totY + 27, 82, 13, 2, 2, "F");
  fn(10, "bold"); st(WHITE);
  doc.text("TOTAL COLLECTED", 113, totY + 35);
  rta(inr(t.total_amount), 188, totY + 35);

  fn(7.5); st(MUTED); doc.text("Notes:", 20, totY + 12);
  fn(7.5); st(CHAR); doc.text(t.notes || "No custom remarks recorded.", 20, totY + 18, { width: 80 });

  // 7. Footer
  sf(DARK); doc.rect(0, PH - 14, PW, 14, "F");
  fn(7.5, "bold"); st(AMBER); doc.text("THE SCRAP CO. ERP", 20, PH - 6);
  fn(7); st([140, 145, 150]);
  doc.text("support@scrapco.in | B2B Operations Portal", 57, PH - 6);

  // Paid watermark
  if (t.invoice_status === "paid") {
    fn(50, "bold"); st([34, 197, 94]);
    doc.text("PAID", PW / 2 - 20, PH / 2, { angle: 30 });
  }

  doc.save(`Invoice_${t.invoice_number || t.txn_number}.pdf`);
}

function ERPTransactionsPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [transactions, setTransactions] = useState<ERPTransaction[]>([]);
  const [materials, setMaterials] = useState<ERPMaterial[]>([]);
  const [suppliers, setSuppliers] = useState<ERPSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [immediatePayment, setImmediatePayment] = useState(true);
  const [payMethod, setPayMethod] = useState("cash");
  const [date, setDate] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<ERPTransaction | null>(null);

  type TransactionItem = {
    materialId: string;
    weight: number | "";
    price: number | "";
    gstRate: number;
  };
  const [items, setItems] = useState<TransactionItem[]>([{ materialId: "", weight: "", price: "", gstRate: 0 }]);

  const handleItemChange = (index: number, key: keyof TransactionItem, val: any) => {
    const newItems = [...items];
    if (key === "materialId") {
      newItems[index].materialId = val;
      const selected = materials.find((m) => m.id === val);
      newItems[index].price = selected ? selected.buy_price : "";
    } else {
      newItems[index][key] = val;
    }
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { materialId: "", weight: "", price: "", gstRate: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    loadTransactions();
  }, [session, search]);

  useEffect(() => {
    if (dialogOpen && session?.access_token) {
      // Load drop-downs
      fetchERPMaterials(session.access_token).then((res) => {
        if (res.success) setMaterials(res.materials);
      });
      fetchERPSuppliers(session.access_token).then((res) => {
        if (res.success) setSuppliers(res.suppliers);
      });
    }
  }, [dialogOpen, session]);

  async function loadTransactions() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.supplier_name = search;
      const res = await fetchERPTransactions(session.access_token, params);
      if (res.success) {
        setTransactions(res.transactions);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load transactions log");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingTransaction(null);
    setSupplierId("");
    setItems([{ materialId: "", weight: "", price: "", gstRate: 0 }]);
    setNotes("");
    setDueDate("");
    setImmediatePayment(true);
    setPayMethod("cash");
    setDate(new Date().toISOString().split("T")[0]);
    setDialogOpen(true);
  }

  function openEdit(t: ERPTransaction) {
    setEditingTransaction(t);
    setSupplierId(t.supplier_id);
    setNotes(t.notes || "");
    setDate(new Date(t.created_at).toISOString().split("T")[0]);
    setImmediatePayment(!!t.payment_method);
    setPayMethod(t.payment_method || "cash");
    setDueDate(t.due_date || "");

    // Find siblings in client side transactions list
    const baseNumber = t.txn_number.split("/")[0];
    const siblings = transactions.filter(
      (item) => item.txn_number.split("/")[0] === baseNumber
    );

    if (siblings.length > 0) {
      setItems(
        siblings.map((sib) => ({
          materialId: sib.material_id,
          weight: sib.weight,
          price: sib.price_per_unit,
          gstRate: sib.gst_rate || 0,
        }))
      );
    } else {
      setItems([
        {
          materialId: t.material_id,
          weight: t.weight,
          price: t.price_per_unit,
          gstRate: t.gst_rate || 0,
        },
      ]);
    }
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) return toast.error("Supplier selection is required");
    if (items.length === 0) return toast.error("At least one material item is required");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.materialId) return toast.error(`Material selection is required for item #${i + 1}`);
      if (!item.weight || Number(item.weight) <= 0) return toast.error(`Please enter valid weight for item #${i + 1}`);
      if (item.price === "" || Number(item.price) < 0) return toast.error(`Please enter valid purchase rate for item #${i + 1}`);
    }

    setSubmitting(true);
    try {
      const payload = {
        supplier_id: supplierId,
        notes: notes.trim() || null,
        due_date: immediatePayment ? null : dueDate || null,
        payment_method: immediatePayment ? payMethod : null,
        created_at: date ? new Date(date).toISOString() : null,
        items: items.map((item) => ({
          material_id: item.materialId,
          weight: Number(item.weight),
          price_per_unit: Number(item.price),
          gst_rate: Number(item.gstRate),
        })),
      };

      if (editingTransaction) {
        const res = await updateERPTransaction(editingTransaction.id, payload, session?.access_token);
        if (res.success) {
          toast.success("Scale transaction(s) updated successfully!");
          setDialogOpen(false);
          loadTransactions();
        }
      } else {
        const res = await createERPTransaction(payload, session?.access_token);
        if (res.success) {
          toast.success("Scale transaction(s) recorded successfully!");
          setDialogOpen(false);
          loadTransactions();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save scale transaction");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWhatsApp(t: ERPTransaction) {
    try {
      const res = await sendERPWhatsApp(t.id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Simulated alert trigger failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete transaction? This reverses material inventory levels and deletes B2B invoices. Proceed?")) return;
    try {
      const res = await deleteERPTransaction(id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
        loadTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || "Transaction delete failed");
    }
  }

  // Live calculator figures
  const calcSubtotal = items.reduce((acc, curr) => acc + (Number(curr.weight || 0) * Number(curr.price || 0)), 0);
  const calcGst = items.reduce((acc, curr) => acc + ((Number(curr.weight || 0) * Number(curr.price || 0) * Number(curr.gstRate || 0)) / 100), 0);
  const calcTotal = calcSubtotal + calcGst;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions list..."
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
            onClick={loadTransactions}
            disabled={loading}
            className="rounded-xl cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button size="sm" onClick={openCreate} className="rounded-xl gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" /> Create Scale Ticket
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

      {/* Transactions Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4 text-right">Weighed Qty</th>
                  <th className="px-6 py-4 text-right">Unit Rate</th>
                  <th className="px-6 py-4 text-right">Payout Total</th>
                  <th className="px-6 py-4 text-right">Bill Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{t.txn_number}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {new Date(t.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium truncate max-w-[140px]">{t.supplier_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color_hex }} />
                        {t.material_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                      {t.weight.toLocaleString()} {t.unit}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">₹{t.price_per_unit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">₹{t.total_amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] px-2 py-0.5 ${
                          INVOICE_STATUS_COLORS[t.invoice_status as keyof typeof INVOICE_STATUS_COLORS] || "bg-gray-100"
                        }`}
                      >
                        {(t.invoice_status || "pending").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(t)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit Scale Ticket"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generatePDF(t)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleWhatsApp(t)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Simulate WhatsApp Send"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(t.id)}
                            className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Scale Ticket"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                      No scale transactions ticket recorded yet. Click "Create Scale Ticket" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weigh Ticket Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> {editingTransaction ? "Edit Scale Weigh Entry (B2B)" : "Log Scale Weigh Entry (B2B)"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="txn-supplier">Supplier Partner</Label>
                <select
                  id="txn-supplier"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="txn-date">Collection Date</Label>
                <Input
                  id="txn-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="rounded-xl border border-border"
                />
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-xs text-foreground">Material Items</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItemRow} className="text-[10px] h-6 px-2 rounded-lg cursor-pointer">
                  + Add Item
                </Button>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-end border border-border/40 rounded-xl p-3 bg-muted/5 relative">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px]">Material</Label>
                      <select
                        value={item.materialId}
                        onChange={(e) => handleItemChange(idx, "materialId", e.target.value)}
                        required
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Material...</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24 space-y-1">
                      <Label className="text-[10px]">Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={item.weight}
                        onChange={(e) => handleItemChange(idx, "weight", e.target.value !== "" ? Number(e.target.value) : "")}
                        placeholder="0.000"
                        required
                        className="rounded-lg h-8 py-1 text-[11px]"
                      />
                    </div>

                    <div className="w-24 space-y-1">
                      <Label className="text-[10px]">Rate (₹/kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, "price", e.target.value !== "" ? Number(e.target.value) : "")}
                        placeholder="₹ 0.00"
                        required
                        className="rounded-lg h-8 py-1 text-[11px]"
                      />
                    </div>

                    <div className="w-20 space-y-1">
                      <Label className="text-[10px]">GST (%)</Label>
                      <select
                        value={item.gstRate}
                        onChange={(e) => handleItemChange(idx, "gstRate", Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] focus:outline-none"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                      </select>
                    </div>

                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemRow(idx)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>₹ {calcSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST:</span>
                <span>₹ {calcGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold text-foreground">
                <span>Total Payout Amount:</span>
                <span className="text-primary">₹ {calcTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment term options */}
            <div className="space-y-3 pt-1 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Immediate Settlement Payment</span>
                <input
                  type="checkbox"
                  checked={immediatePayment}
                  onChange={(e) => setImmediatePayment(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </div>

              {immediatePayment ? (
                <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                  <Label>Payment Mode</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["cash", "upi", "bank_transfer", "cheque"].map((m) => (
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
              ) : (
                <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                  <Label htmlFor="txn-due">Invoice Credit Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="txn-due"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-9 rounded-xl border border-border text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="txn-notes">Transaction Remarks</Label>
              <Input
                id="txn-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Scale calibrations, vehicle reference..."
                className="rounded-xl border border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-xl cursor-pointer">
                {submitting ? "Saving Ticket..." : editingTransaction ? "Save Changes" : "Record Weighment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
