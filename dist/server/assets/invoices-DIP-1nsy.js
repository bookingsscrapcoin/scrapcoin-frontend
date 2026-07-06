import { r as reactExports, W as jsxRuntimeExports } from "./server-DoKHtATG.js";
import { c as createLucideIcon, u as useAuth, t as toast, B as Button } from "./router-BJNK2uXb.js";
import { w as fetchERPInvoices, x as payERPInvoice } from "./api-CHfPu43u.js";
import { I as Input } from "./input-DX3kki94.js";
import { L as Label } from "./label-2MVdEt9Q.js";
import { S as Skeleton } from "./skeleton-rktJtwBa.js";
import { B as Badge } from "./badge-Dwim2idC.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-O63RrUsx.js";
import { C as CircleCheck } from "./circle-check-CD9VV0iw.js";
import { C as CircleAlert } from "./circle-alert-D4rnIMYk.js";
import { S as Search } from "./search-_Au809V-.js";
import { R as RotateCw } from "./rotate-cw-CgvyQZvG.js";
import { D as Download } from "./download-B2eEA2dj.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DIP3fUvP.js";
import "./Combination-Cu9s-9nZ.js";
import "./x-CUKktU4u.js";
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode);
const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    className: "bg-green-50 text-green-700 border-green-200"
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200"
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-50 text-red-700 border-red-200"
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-50 text-gray-700 border-gray-200"
  }
};
async function generatePDFFromInvoice(i) {
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
  const {
    jsPDF
  } = windowObj.jspdf;
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait"
  });
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
  const inr = (n) => "Rs. " + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2
  });
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
  rta(i.invoice_number, PW - 20, 25);
  rta("TXN: " + i.txn_number, PW - 20, 31);
  sf(AMB_LT);
  sd(AMB_LT);
  doc.roundedRect(20, 44, 170, 22, 3, 3, "FD");
  const dateStr = new Date(i.created_at).toLocaleDateString("en-IN");
  const metaFields = [{
    label: "INVOICE DATE",
    value: dateStr
  }, {
    label: "DUE DATE",
    value: i.due_date ? new Date(i.due_date).toLocaleDateString("en-IN") : dateStr
  }, {
    label: "STATUS",
    value: i.status.toUpperCase()
  }, {
    label: "TRANSACTION",
    value: i.txn_number
  }];
  metaFields.forEach((f, idx) => {
    const fx = 25 + idx * 43;
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
  doc.text(i.supplier_name.slice(0, 26), 25, 90);
  if (i.supplier_phone) {
    fn(8);
    st(CHAR);
    doc.text("Phone: " + i.supplier_phone, 25, 96);
  }
  sf(GREY_BG);
  sd(BORDER);
  doc.roundedRect(108, 75, 82, 30, 2, 2, "FD");
  fn(7, "bold");
  st(AMBER);
  doc.text("BANK PAYMENT INFO", 113, 82);
  const info = [["UPI ID", "scrapco@icici"], ["IFSC Code", "ICIC0000213"], ["Account", "Scrap Co. ERP Ledger"]];
  info.forEach(([lbl, val], idx) => {
    fn(7);
    st(MUTED);
    doc.text(lbl, 113, 89 + idx * 7);
    st(CHAR);
    rta(val, 188, 89 + idx * 7);
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
  doc.text(`${i.material_name} Scrap collection B2B entry`, 33, rY + 9);
  fn(8.5, "bold");
  doc.text(i.material_name, 100, rY + 9);
  fn(8.5);
  rta(`${i.weight} ${i.unit}`, 148, rY + 9);
  rta(inr(i.price_per_unit), 170, rY + 9);
  fn(8.5, "bold");
  rta(inr(i.amount), 188, rY + 9);
  const totY = rY + 24;
  sf(GREY_BG);
  sd(BORDER);
  doc.roundedRect(108, totY, 82, 40, 2, 2, "FD");
  fn(8.5);
  st(MUTED);
  doc.text("Subtotal", 113, totY + 10);
  st(CHAR);
  rta(inr(i.amount), 188, totY + 10);
  doc.line(113, totY + 14, 188, totY + 14);
  fn(8.5);
  st(MUTED);
  doc.text(`GST (0%)`, 113, totY + 21);
  st(CHAR);
  rta(inr(0), 188, totY + 21);
  doc.line(113, totY + 25, 188, totY + 25);
  sf(AMBER);
  doc.roundedRect(108, totY + 27, 82, 13, 2, 2, "F");
  fn(10, "bold");
  st(WHITE);
  doc.text("TOTAL COLLECTED", 113, totY + 35);
  rta(inr(i.amount), 188, totY + 35);
  fn(7.5);
  st(MUTED);
  doc.text("Notes:", 20, totY + 12);
  fn(7.5);
  st(CHAR);
  doc.text(i.notes || "No custom remarks recorded.", 20, totY + 18, {
    width: 80
  });
  sf(DARK);
  doc.rect(0, PH - 14, PW, 14, "F");
  fn(7.5, "bold");
  st(AMBER);
  doc.text("THE SCRAP CO. ERP", 20, PH - 6);
  fn(7);
  st([140, 145, 150]);
  doc.text("support@scrapco.in | B2B Operations Portal", 57, PH - 6);
  if (i.status === "paid") {
    fn(50, "bold");
    st([34, 197, 94]);
    doc.text("PAID", PW / 2 - 20, PH / 2, {
      angle: 30
    });
  }
  doc.save(`Invoice_${i.invoice_number}.pdf`);
}
function ERPInvoicesPage() {
  const {
    session
  } = useAuth();
  const [invoices, setInvoices] = reactExports.useState([]);
  const [summary, setSummary] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [payDialogOpen, setPayDialogOpen] = reactExports.useState(false);
  const [selectedInvoice, setSelectedInvoice] = reactExports.useState(null);
  const [payMethod, setPayMethod] = reactExports.useState("cash");
  const [payNotes, setPayNotes] = reactExports.useState("");
  const [paying, setPaying] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadInvoices();
  }, [session, statusFilter, search]);
  async function loadInvoices() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;
      const res = await fetchERPInvoices(session.access_token, params);
      if (res.success) {
        setInvoices(res.invoices);
        setSummary(res.summary);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load invoices log");
    } finally {
      setLoading(false);
    }
  }
  function openPay(i) {
    setSelectedInvoice(i);
    setPayMethod("cash");
    setPayNotes("");
    setPayDialogOpen(true);
  }
  async function handlePay(e) {
    e.preventDefault();
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      const res = await payERPInvoice(selectedInvoice.id, payMethod, payNotes.trim() || void 0, session?.access_token);
      if (res.success) {
        toast.success("Invoice paid successfully!");
        setPayDialogOpen(false);
        loadInvoices();
      }
    } catch (err) {
      toast.error(err.message || "Payment trigger failed");
    } finally {
      setPaying(false);
    }
  }
  const filtered = invoices.filter((i) => i.invoice_number.toLowerCase().includes(search.toLowerCase()) || i.supplier_name.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-emerald-600", children: [
            "₹",
            summary.paid_total.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            summary.paid_count,
            " settle tickets"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-emerald-600/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Total Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-amber-600", children: [
            "₹",
            summary.pending_total.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            summary.pending_count,
            " unpaid ledger tickets"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-8 w-8 text-amber-500/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Overdue Bills" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-red-600", children: [
            "₹",
            summary.overdue_total.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            summary.overdue_count,
            " critical invoices"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-red-500/30" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search invoice number/supplier...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 rounded-xl border border-border bg-card text-xs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto justify-end items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-border bg-muted/40 p-0.5", children: ["all", "paid", "pending", "overdue"].map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatusFilter(st), className: `rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all uppercase ${statusFilter === st ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: st }, st)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: loadInvoices, disabled: loading, className: "rounded-xl cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }) })
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Invoice No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Supplier Partner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Scale Ticket Reference" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Bill Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        filtered.map((inv) => {
          const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.pending;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inv.invoice_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-normal", children: [
                "Issued: ",
                new Date(inv.created_at).toLocaleDateString("en-IN")
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-medium text-foreground truncate max-w-[140px]", children: inv.supplier_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: inv.txn_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold text-foreground", children: [
                inv.material_name,
                " (",
                inv.weight,
                " ",
                inv.unit,
                ")"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-foreground", children: [
              "₹",
              inv.amount.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right text-muted-foreground whitespace-nowrap", children: inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN") : "Immediate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `rounded-full text-[10px] px-2 py-0.5 ${cfg.className}`, children: cfg.label.toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => generatePDFFromInvoice(inv), className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", title: "Download PDF Invoice", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }) }),
              inv.status !== "paid" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => openPay(inv), className: "rounded-xl font-semibold gap-1 py-1 cursor-pointer h-7 text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-3 w-3" }),
                " PAY BILL"
              ] })
            ] }) })
          ] }, inv.id);
        }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-6 py-10 text-center text-muted-foreground", children: "No invoices recorded under these selection parameters." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: payDialogOpen, onOpenChange: setPayDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: "Record Invoice Bill Settlement" }) }),
      selectedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePay, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-4 text-xs space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Invoice Reference:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: selectedInvoice.invoice_number })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Supplier:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedInvoice.supplier_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-1.5 font-bold text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Settle Amount:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
              "₹ ",
              selectedInvoice.amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Mode / Settlement Channel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
            val: "cash",
            label: "Cash"
          }, {
            val: "upi",
            label: "UPI"
          }, {
            val: "bank_transfer",
            label: "Bank Transfer"
          }, {
            val: "cheque",
            label: "Bank Cheque"
          }].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: payMethod === m.val ? "default" : "outline", size: "sm", onClick: () => setPayMethod(m.val), className: "rounded-xl font-semibold text-xs cursor-pointer h-9", children: m.label }, m.val)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pay-notes", children: "Settlement Remarks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pay-notes", value: payNotes, onChange: (e) => setPayNotes(e.target.value), placeholder: "UPI Ref ID, bank cheque numbers...", className: "rounded-xl border border-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setPayDialogOpen(false), className: "rounded-xl cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: paying, className: "rounded-xl cursor-pointer", children: paying ? "Settling bill..." : "Complete Settle Payout" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ERPInvoicesPage as component
};
