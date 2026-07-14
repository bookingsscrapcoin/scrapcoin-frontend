import { ab as createLazyFileRoute, r as reactExports, ae as toast, L as jsxRuntimeExports, bc as Search, b7 as RotateCw, ay as Plus, bk as Printer, bi as Pen, az as Trash2, ak as Scale } from "./vendor-DwbuQL-J.js";
import { u as useAuth, B as Button } from "./router-BVmG3DPG.js";
import { b as fetchERPMaterials, k as fetchERPCustomers, l as fetchERPPurchaseReceipts, m as deleteERPPurchaseReceipt, n as updateERPPurchaseReceipt, o as createERPPurchaseReceipt } from "./api-bKjl-cV9.js";
import { I as Input } from "./input-B64rzL1f.js";
import { L as Label } from "./label-fl-OSxnY.js";
import { S as Skeleton } from "./skeleton-BvLPRzjU.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-BWwZnwis.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./supabase-i4OIPGPK.js";
const Route = createLazyFileRoute("/admin/erp/receipts")({
  component: ERPReceiptsPage
});
async function generateReceiptPDF(r) {
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
  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
  const PW = 148, PH = 210;
  const AMBER = [245, 166, 35];
  const DARK = [13, 14, 15];
  const WHITE = [255, 255, 255];
  const GREY = [248, 249, 250];
  const MID = [100, 110, 120];
  const BORDER = [220, 222, 226];
  const GREEN = [22, 163, 74];
  const sf = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const st = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const sd = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const fn = (sz, style = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(sz);
  };
  const inr = (n) => "Rs. " + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const rta = (txt, x, y) => doc.text(txt, x - doc.getTextWidth(txt), y);
  sf(AMBER);
  doc.rect(0, 0, PW, 28, "F");
  fn(16, "bold");
  st(WHITE);
  doc.text("THE SCRAP CO.", 12, 11);
  fn(7);
  st([255, 230, 170]);
  doc.text("Sector 16C, Greater Noida West | support@scrapco.in", 12, 17);
  fn(9, "bold");
  st(WHITE);
  rta("PAYMENT RECEIPT", PW - 10, 11);
  fn(8);
  st([255, 230, 170]);
  rta(r.receipt_number, PW - 10, 18);
  fn(8);
  st(MID);
  doc.text("Date: " + new Date(r.created_at).toLocaleDateString("en-IN"), 12, 36);
  sf(GREY);
  sd(BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(PW - 42, 30, 32, 9, 2, 2, "FD");
  fn(7, "bold");
  st(DARK);
  rta(r.payment_method.toUpperCase(), PW - 11, 36);
  sf(GREY);
  sd(BORDER);
  doc.roundedRect(12, 42, PW - 24, 22, 2, 2, "FD");
  fn(7, "bold");
  st([180, 83, 9]);
  doc.text("PAID TO CUSTOMER", 17, 49);
  fn(11, "bold");
  st(DARK);
  doc.text(r.customer_name || "Walk-in Customer", 17, 57);
  if (r.customer_phone) {
    fn(8);
    st(MID);
    doc.text("Phone: " + r.customer_phone, 17, 63);
  }
  const ty = 72;
  sf(DARK);
  doc.rect(12, ty, PW - 24, 8, "F");
  fn(7, "bold");
  st(AMBER);
  doc.text("Material Collected", 16, ty + 5.5);
  doc.text("Weighed Qty", 72, ty + 5.5);
  rta("Rate/Unit", PW - 36, ty + 5.5);
  rta("Payout", PW - 12, ty + 5.5);
  sf(GREY);
  sd(BORDER);
  doc.rect(12, ty + 8, PW - 24, 12, "FD");
  fn(9, "bold");
  st(DARK);
  doc.text(r.material_name, 16, ty + 16);
  fn(9);
  st(MID);
  doc.text(`${r.weight} ${r.unit}`, 72, ty + 16);
  rta(inr(r.price_per_unit), PW - 36, ty + 16);
  fn(10, "bold");
  st(DARK);
  rta(inr(r.total_amount), PW - 12, ty + 16);
  sf(AMBER);
  doc.roundedRect(PW - 70, ty + 26, 58, 16, 2, 2, "F");
  fn(8);
  st(WHITE);
  doc.text("TOTAL CASH PAID OUT", PW - 68, ty + 33);
  fn(14, "bold");
  rta(inr(r.total_amount), PW - 12, ty + 40);
  fn(28, "bold");
  st([...GREEN, 0.08]);
  doc.text("PAID", PW / 2 - 8, ty + 38);
  if (r.notes) {
    fn(7);
    st(MID);
    doc.text("Note: " + r.notes, 12, ty + 62);
  }
  sf(DARK);
  doc.rect(0, PH - 14, PW, 14, "F");
  fn(7, "bold");
  st(AMBER);
  doc.text("THE SCRAP CO. ERP", 12, PH - 6);
  fn(6.5);
  st([140, 145, 150]);
  doc.text("support@scrapco.in | Doorstep Pickup Service", 50, PH - 6);
  doc.save(`Receipt_${r.receipt_number}.pdf`);
}
function ERPReceiptsPage() {
  const { session, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [receipts, setReceipts] = reactExports.useState([]);
  const [materials, setMaterials] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [customerId, setCustomerId] = reactExports.useState("");
  const [payMethod, setPayMethod] = reactExports.useState("cash");
  const [notes, setNotes] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [editingReceipt, setEditingReceipt] = reactExports.useState(null);
  const [items, setItems] = reactExports.useState([{ materialId: "", weight: "", price: "" }]);
  const handleItemChange = (index, key, val) => {
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
    setItems([...items, { materialId: "", weight: "", price: "" }]);
  };
  const removeItemRow = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };
  reactExports.useEffect(() => {
    loadReceipts();
  }, [session, search]);
  reactExports.useEffect(() => {
    if (dialogOpen && session?.access_token) {
      fetchERPMaterials(session.access_token).then((res) => {
        if (res.success) setMaterials(res.materials);
      });
      fetchERPCustomers(session.access_token).then((res) => {
        if (res.success) setCustomers(res.customers);
      });
    }
  }, [dialogOpen, session]);
  async function loadReceipts() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPPurchaseReceipts(session.access_token);
      if (res.success) {
        setReceipts(res.receipts);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }
  function openCreate() {
    setEditingReceipt(null);
    setCustomerId("");
    setItems([{ materialId: "", weight: "", price: "" }]);
    setPayMethod("cash");
    setNotes("");
    setDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setDialogOpen(true);
  }
  function openEdit(r) {
    setEditingReceipt(r);
    setCustomerId(r.customer_id || "");
    setPayMethod(r.payment_method);
    setNotes(r.notes || "");
    setDate(new Date(r.created_at).toISOString().split("T")[0]);
    const baseNumber = r.receipt_number.split("/")[0];
    const siblings = receipts.filter(
      (item) => item.receipt_number.split("/")[0] === baseNumber
    );
    if (siblings.length > 0) {
      setItems(
        siblings.map((sib) => ({
          materialId: sib.material_id,
          weight: sib.weight,
          price: sib.price_per_unit
        }))
      );
    } else {
      setItems([{ materialId: r.material_id, weight: r.weight, price: r.price_per_unit }]);
    }
    setDialogOpen(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return toast.error("At least one material item is required");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.materialId) return toast.error(`Material selection is required for item #${i + 1}`);
      if (!item.weight || Number(item.weight) <= 0) return toast.error(`Please enter valid weight for item #${i + 1}`);
      if (item.price === "" || Number(item.price) < 0) return toast.error(`Please enter valid buying rate for item #${i + 1}`);
    }
    setSubmitting(true);
    try {
      const payload = {
        customer_id: customerId || null,
        payment_method: payMethod,
        notes: notes.trim() || null,
        created_at: date ? new Date(date).toISOString() : null,
        items: items.map((item) => ({
          material_id: item.materialId,
          weight: Number(item.weight),
          price_per_unit: Number(item.price)
        }))
      };
      if (editingReceipt) {
        const res = await updateERPPurchaseReceipt(editingReceipt.id, payload, session?.access_token);
        if (res.success) {
          toast.success("B2C Pickup receipt updated successfully!");
          setDialogOpen(false);
          loadReceipts();
        }
      } else {
        const res = await createERPPurchaseReceipt(payload, session?.access_token);
        if (res.success) {
          toast.success("B2C Pickup receipt recorded successfully!");
          setDialogOpen(false);
          loadReceipts();
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to save scale receipt");
    } finally {
      setSubmitting(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete B2C scale receipt? This reverses material stock counts and clears customer visit figures. Proceed?")) return;
    try {
      const res = await deleteERPPurchaseReceipt(id, session?.access_token);
      if (res.success) {
        toast.success(res.message);
        loadReceipts();
      }
    } catch (err) {
      toast.error(err.message || "Receipt deletion failed");
    }
  }
  const calcTotal = items.reduce((acc, curr) => acc + Number(curr.weight || 0) * Number(curr.price || 0), 0);
  const filtered = receipts.filter(
    (r) => r.receipt_number.toLowerCase().includes(search.toLowerCase()) || r.customer_name.toLowerCase().includes(search.toLowerCase()) || r.material_name.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search receipt list...",
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
            onClick: loadReceipts,
            disabled: loading,
            className: "rounded-xl cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openCreate, className: "rounded-xl gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create Scale Ticket (B2C)"
        ] })
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Receipt No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Material Collected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Unit Rate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Cash Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.receipt_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-normal", children: new Date(r.created_at).toLocaleDateString("en-IN") })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-medium text-foreground truncate max-w-[140px]", children: r.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-muted-foreground", children: r.material_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap", children: [
            r.weight.toLocaleString(),
            " ",
            r.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right text-muted-foreground", children: [
            "₹",
            r.price_per_unit.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-foreground", children: [
            "₹",
            r.total_amount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => generateReceiptPDF(r),
                className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer",
                title: "Print Receipt",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => openEdit(r),
                className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer",
                title: "Edit Scale Receipt",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
              }
            ),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => handleDelete(r.id),
                className: "h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer",
                title: "Delete Scale Receipt",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, r.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-6 py-10 text-center text-muted-foreground", children: 'No household collection receipts logged. Click "Create Scale Ticket (B2C)" to start.' }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-5 w-5 text-primary" }),
        " ",
        editingReceipt ? "Edit B2C Scale Collection Receipt" : "Log B2C Scale Collection Receipt"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-cust", children: "Household Customer (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "rec-cust",
                value: customerId,
                onChange: (e) => setCustomerId(e.target.value),
                className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Walk-in Customer (Unregistered)" }),
                  customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
                    c.name,
                    " (",
                    c.phone || "No phone",
                    ")"
                  ] }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-date", children: "Collection Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "rec-date",
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                required: true,
                className: "rounded-xl border border-border"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold text-xs text-foreground", children: "Materials Collected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: addItemRow, className: "text-[10px] h-6 px-2 rounded-lg cursor-pointer", children: "+ Add Item" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[220px] overflow-y-auto pr-1", children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end border border-border/40 rounded-xl p-3 bg-muted/5 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Material" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: item.materialId,
                  onChange: (e) => handleItemChange(idx, "materialId", e.target.value),
                  required: true,
                  className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Material..." }),
                    materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: m.id, children: [
                      m.name,
                      " (₹",
                      m.buy_price,
                      ")"
                    ] }, m.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Weight (kg)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.001",
                  value: item.weight,
                  onChange: (e) => handleItemChange(idx, "weight", e.target.value !== "" ? Number(e.target.value) : ""),
                  placeholder: "0.000",
                  required: true,
                  className: "rounded-lg h-8 py-1 text-[11px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Buying Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: item.price,
                  onChange: (e) => handleItemChange(idx, "price", e.target.value !== "" ? Number(e.target.value) : ""),
                  placeholder: "₹ 0.00",
                  required: true,
                  className: "rounded-lg h-8 py-1 text-[11px]"
                }
              )
            ] }),
            items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: () => removeItemRow(idx),
                className: "h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }, idx)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-4 flex justify-between items-center font-bold text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Total Cash Paid to Customer:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary text-sm", children: [
            "₹ ",
            calcTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["cash", "upi", "bank_transfer"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-notes", children: "Remarks / Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "rec-notes",
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Scale number, vehicle details...",
              className: "rounded-xl border border-border"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setDialogOpen(false), className: "rounded-xl cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "rounded-xl cursor-pointer", children: submitting ? "Saving Receipt..." : editingReceipt ? "Update Scale Collection" : "Record Scale Collection" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Route
};
