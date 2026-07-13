import { ab as createLazyFileRoute, r as reactExports, ae as toast, L as jsxRuntimeExports, bc as Search, b7 as RotateCw, ay as Plus, bd as Download, ao as MessageSquare, az as Trash2, ak as Scale, b5 as Calendar } from "./vendor-OkomiPNA.js";
import { u as useAuth, B as Button } from "./router--AfMktBh.js";
import { b as fetchERPMaterials, c as fetchERPSuppliers, d as fetchERPTransactions, s as sendERPWhatsApp, e as deleteERPTransaction, g as createERPTransaction } from "./api-CEarRw-2.js";
import { I as Input } from "./input-DWAt9dj0.js";
import { L as Label } from "./label-CRiUgbTC.js";
import { S as Skeleton } from "./skeleton-CT2LEmSj.js";
import { B as Badge } from "./badge-CgU6qts2.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-HKukzhfw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./supabase-CTZyeyMt.js";
const Route = createLazyFileRoute("/admin/erp/transactions")({
  component: ERPTransactionsPage
});
const INVOICE_STATUS_COLORS = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200"
};
async function generatePDF(t) {
  const windowObj = window;
  if (!windowObj.jspdf) {
    await new Promise((resolve, reject) => {
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
  const sf = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const sd = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const st = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fn = (sz, style = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(sz);
  };
  const rta = (txt, x, y) => doc.text(txt, x - doc.getTextWidth(txt), y);
  const inr = (n) => "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  sf(AMBER);
  doc.rect(0, 0, PW, 38, "F");
  fn(22, "bold");
  st(WHITE);
  doc.text("THE SCRAP CO. ERP", 20, 15);
  fn(8);
  st([255, 230, 170]);
  doc.text("The Scrap Co. Pvt. Ltd", 20, 21);
  doc.text("GSTIN: 27AABCS1234D1Z5 | support@scrapco.in", 20, 26);
  doc.text("Sector 16C, Greater Noida West, Uttar Pradesh - 201306", 20, 31);
  fn(26, "bold");
  st(WHITE);
  rta("INVOICE", PW - 20, 17);
  fn(9);
  st([255, 230, 170]);
  rta(t.invoice_number || t.txn_number, PW - 20, 25);
  rta("TXN: " + t.txn_number, PW - 20, 31);
  sf(AMB_LT);
  sd(AMB_LT);
  doc.roundedRect(20, 44, 170, 22, 3, 3, "FD");
  const dateStr = new Date(t.created_at).toLocaleDateString("en-IN");
  const metaFields = [
    { label: "INVOICE DATE", value: dateStr },
    { label: "DUE DATE", value: dateStr },
    { label: "STATUS", value: (t.invoice_status || "pending").toUpperCase() },
    { label: "TRANSACTION", value: t.txn_number }
  ];
  metaFields.forEach((f, i) => {
    const fx = 25 + i * 43;
    fn(7);
    st(MUTED);
    doc.text(f.label, fx, 52);
    fn(9, "bold");
    st(CHAR);
    doc.text(f.value, fx, 60);
  });
  sf(GREY_BG);
  sd(BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(20, 75, 80, 30, 2, 2, "FD");
  fn(7, "bold");
  st(AMBER);
  doc.text("BILL TO SUPPLIER", 25, 82);
  fn(11, "bold");
  st(DARK);
  doc.text((t.supplier_name || "Supplier Partner").slice(0, 26), 25, 90);
  fn(8);
  st(CHAR);
  if (t.supplier_phone) doc.text("Phone: " + t.supplier_phone, 25, 96);
  sf(GREY_BG);
  sd(BORDER);
  doc.roundedRect(108, 75, 82, 30, 2, 2, "FD");
  fn(7, "bold");
  st(AMBER);
  doc.text("BANK PAYMENT INFO", 113, 82);
  const info = [
    ["UPI ID", "scrapco@icici"],
    ["IFSC Code", "ICIC0000213"],
    ["Account", "Scrap Co. ERP Ledger"]
  ];
  info.forEach(([lbl, val], i) => {
    fn(7);
    st(MUTED);
    doc.text(lbl, 113, 89 + i * 7);
    st(CHAR);
    rta(val, 188, 89 + i * 7);
  });
  const tY = 117;
  sf(DARK);
  doc.rect(20, tY, 170, 10, "F");
  fn(7.5, "bold");
  st(WHITE);
  doc.text("#", 25, tY + 7);
  doc.text("ITEM DESCRIPTION", 33, tY + 7);
  doc.text("MATERIAL", 100, tY + 7);
  rta("WEIGHT", 148, tY + 7);
  rta("PRICE", 170, tY + 7);
  rta("SUBTOTAL", 188, tY + 7);
  const rY = tY + 10;
  sf(WHITE);
  sd(BORDER);
  doc.rect(20, rY, 170, 14, "FD");
  fn(8.5);
  st(CHAR);
  doc.text("1", 25, rY + 9);
  doc.text(`${t.material_name} Scrap collection B2B entry`, 33, rY + 9);
  fn(8.5, "bold");
  doc.text(t.material_name, 100, rY + 9);
  fn(8.5);
  rta(`${t.weight} ${t.unit}`, 148, rY + 9);
  rta(inr(t.price_per_unit), 170, rY + 9);
  fn(8.5, "bold");
  rta(inr(t.subtotal), 188, rY + 9);
  const totY = rY + 24;
  sf(GREY_BG);
  sd(BORDER);
  doc.roundedRect(108, totY, 82, 40, 2, 2, "FD");
  fn(8.5);
  st(MUTED);
  doc.text("Subtotal", 113, totY + 10);
  st(CHAR);
  rta(inr(t.subtotal), 188, totY + 10);
  doc.line(113, totY + 14, 188, totY + 14);
  fn(8.5);
  st(MUTED);
  doc.text(`GST (${t.gst_rate}%)`, 113, totY + 21);
  st(CHAR);
  rta(inr(t.gst_amount), 188, totY + 21);
  doc.line(113, totY + 25, 188, totY + 25);
  sf(AMBER);
  doc.roundedRect(108, totY + 27, 82, 13, 2, 2, "F");
  fn(10, "bold");
  st(WHITE);
  doc.text("TOTAL COLLECTED", 113, totY + 35);
  rta(inr(t.total_amount), 188, totY + 35);
  fn(7.5);
  st(MUTED);
  doc.text("Notes:", 20, totY + 12);
  fn(7.5);
  st(CHAR);
  doc.text(t.notes || "No custom remarks recorded.", 20, totY + 18, { width: 80 });
  sf(DARK);
  doc.rect(0, PH - 14, PW, 14, "F");
  fn(7.5, "bold");
  st(AMBER);
  doc.text("THE SCRAP CO. ERP", 20, PH - 6);
  fn(7);
  st([140, 145, 150]);
  doc.text("support@scrapco.in | B2B Operations Portal", 57, PH - 6);
  if (t.invoice_status === "paid") {
    fn(50, "bold");
    st([34, 197, 94]);
    doc.text("PAID", PW / 2 - 20, PH / 2, { angle: 30 });
  }
  doc.save(`Invoice_${t.invoice_number || t.txn_number}.pdf`);
}
function ERPTransactionsPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [transactions, setTransactions] = reactExports.useState([]);
  const [materials, setMaterials] = reactExports.useState([]);
  const [suppliers, setSuppliers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [supplierId, setSupplierId] = reactExports.useState("");
  const [materialId, setMaterialId] = reactExports.useState("");
  const [weight, setWeight] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  const [gstRate, setGstRate] = reactExports.useState(0);
  const [notes, setNotes] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [immediatePayment, setImmediatePayment] = reactExports.useState(true);
  const [payMethod, setPayMethod] = reactExports.useState("cash");
  reactExports.useEffect(() => {
    loadTransactions();
  }, [session, search]);
  reactExports.useEffect(() => {
    if (dialogOpen && session?.access_token) {
      fetchERPMaterials(session.access_token).then((res) => {
        if (res.success) setMaterials(res.materials);
      });
      fetchERPSuppliers(session.access_token).then((res) => {
        if (res.success) setSuppliers(res.suppliers);
      });
    }
  }, [dialogOpen, session]);
  reactExports.useEffect(() => {
    if (materialId) {
      const selected = materials.find((m) => m.id === materialId);
      if (selected) {
        setPrice(selected.buy_price);
      }
    }
  }, [materialId, materials]);
  async function loadTransactions() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const params = {};
      if (search) params.supplier_name = search;
      const res = await fetchERPTransactions(session.access_token, params);
      if (res.success) {
        setTransactions(res.transactions);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load transactions log");
    } finally {
      setLoading(false);
    }
  }
  function openCreate() {
    setSupplierId("");
    setMaterialId("");
    setWeight("");
    setPrice("");
    setGstRate(0);
    setNotes("");
    setDueDate("");
    setImmediatePayment(true);
    setPayMethod("cash");
    setDialogOpen(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplierId) return toast.error("Supplier selection is required");
    if (!materialId) return toast.error("Material selection is required");
    if (!weight || Number(weight) <= 0) return toast.error("Please enter a valid weight");
    if (price === "" || Number(price) < 0) return toast.error("Please enter a valid purchase rate");
    setSubmitting(true);
    try {
      const payload = {
        supplier_id: supplierId,
        material_id: materialId,
        weight: Number(weight),
        price_per_unit: Number(price),
        gst_rate: Number(gstRate),
        notes: notes.trim() || null,
        due_date: immediatePayment ? null : dueDate || null,
        payment_method: immediatePayment ? payMethod : null
      };
      const res = await createERPTransaction(payload, session?.access_token);
      if (res.success) {
        toast.success("Scale transaction recorded successfully!");
        setDialogOpen(false);
        loadTransactions();
      }
    } catch (err) {
      toast.error(err.message || "Failed to record scale transaction");
    } finally {
      setSubmitting(false);
    }
  }
  async function handleWhatsApp(t) {
    try {
      const res = await sendERPWhatsApp(t.id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Simulated alert trigger failed");
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete transaction? This reverses material inventory levels and deletes B2B invoices. Proceed?")) return;
    try {
      const res = await deleteERPTransaction(id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
        loadTransactions();
      }
    } catch (err) {
      toast.error(err.message || "Transaction delete failed");
    }
  }
  const calcSubtotal = Number(weight || 0) * Number(price || 0);
  const calcGst = calcSubtotal * gstRate / 100;
  const calcTotal = calcSubtotal + calcGst;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search transactions list...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 rounded-xl border border-border bg-card text-xs"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto justify-end items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: loadTransactions,
            disabled: loading,
            className: "rounded-xl cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openCreate, className: "rounded-xl gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create Scale Ticket"
        ] })
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Ticket ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Material" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Weighed Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Unit Rate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Payout Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Bill Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        transactions.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.txn_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-normal", children: new Date(t.created_at).toLocaleDateString("en-IN") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-foreground font-medium truncate max-w-[140px]", children: t.supplier_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full", style: { backgroundColor: t.color_hex } }),
            t.material_name
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap", children: [
            t.weight.toLocaleString(),
            " ",
            t.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right text-muted-foreground", children: [
            "₹",
            t.price_per_unit.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-foreground", children: [
            "₹",
            t.total_amount.toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `rounded-full text-[10px] px-2 py-0.5 ${INVOICE_STATUS_COLORS[t.invoice_status] || "bg-gray-100"}`,
              children: (t.invoice_status || "pending").toUpperCase()
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => generatePDF(t),
                className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer",
                title: "Download Invoice",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => handleWhatsApp(t),
                className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer",
                title: "Simulate WhatsApp Send",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" })
              }
            ),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => handleDelete(t.id),
                className: "h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer",
                title: "Delete Scale Ticket",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, t.id)),
        transactions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-6 py-10 text-center text-muted-foreground", children: 'No scale transactions ticket recorded yet. Click "Create Scale Ticket" to start.' }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-5 w-5 text-primary" }),
        " Log Scale Weigh Entry (B2B)"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-supplier", children: "Supplier Partner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "txn-supplier",
                value: supplierId,
                onChange: (e) => setSupplierId(e.target.value),
                required: true,
                className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Supplier..." }),
                  suppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-material", children: "Material Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "txn-material",
                value: materialId,
                onChange: (e) => setMaterialId(e.target.value),
                required: true,
                className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Material..." }),
                  materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.id, children: m.name }, m.id))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-weight", children: "Weighed Weight (kg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "txn-weight",
                type: "number",
                step: "0.001",
                value: weight,
                onChange: (e) => setWeight(e.target.value !== "" ? Number(e.target.value) : ""),
                placeholder: "0.000",
                required: true,
                className: "rounded-xl border border-border"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-price", children: "Purchase Rate (₹/kg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "txn-price",
                type: "number",
                step: "0.01",
                value: price,
                onChange: (e) => setPrice(e.target.value !== "" ? Number(e.target.value) : ""),
                placeholder: "₹ 0.00",
                required: true,
                className: "rounded-xl border border-border"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-gst", children: "GST Rate (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "txn-gst",
                value: gstRate,
                onChange: (e) => setGstRate(Number(e.target.value)),
                className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "0%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 5, children: "5%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 12, children: "12%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 18, children: "18%" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "₹ ",
              calcSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "GST (",
              gstRate,
              "%):"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "₹ ",
              calcGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-2 flex justify-between text-sm font-bold text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Payout Amount:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
              "₹ ",
              calcTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Immediate Settlement Payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: immediatePayment,
                onChange: (e) => setImmediatePayment(e.target.checked),
                className: "h-4 w-4 accent-primary"
              }
            )
          ] }),
          immediatePayment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in slide-in-from-top-1 duration-150", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: ["cash", "upi", "bank_transfer", "cheque"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: payMethod === m ? "default" : "outline",
                size: "sm",
                onClick: () => setPayMethod(m),
                className: "rounded-xl text-[10px] uppercase font-bold cursor-pointer",
                children: m.replace("_", " ")
              },
              m
            )) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in slide-in-from-top-1 duration-150", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-due", children: "Invoice Credit Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "txn-due",
                  type: "date",
                  value: dueDate,
                  onChange: (e) => setDueDate(e.target.value),
                  className: "pl-9 rounded-xl border border-border text-xs"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "txn-notes", children: "Transaction Remarks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "txn-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Scale calibrations, vehicle reference...",
              className: "rounded-xl border border-border"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setDialogOpen(false), className: "rounded-xl cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "rounded-xl cursor-pointer", children: submitting ? "Saving Ticket..." : "Record Weighment" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Route
};
