import { r as reactExports, W as jsxRuntimeExports } from "./server-OMqAKq-m.js";
import { c as createLucideIcon, u as useAuth, t as toast, B as Button } from "./router-D6W4s5sA.js";
import { d as fetchERPMaterials, q as fetchERPMaterialPriceHistory, r as deleteERPMaterial, t as updateERPMaterial, v as createERPMaterial } from "./api-CHfPu43u.js";
import { I as Input } from "./input-djh48Wp9.js";
import { L as Label } from "./label-B-1Hzm1R.js";
import { S as Skeleton } from "./skeleton-BELmSVNm.js";
import { B as Badge } from "./badge-DAnC01VE.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-BnjWN9tf.js";
import { S as Search } from "./search-D30I-S3V.js";
import { R as RotateCw } from "./rotate-cw-CMfkYH0H.js";
import { P as Plus, T as Trash2 } from "./trash-2-BdNfasOz.js";
import { P as Pen } from "./pen-Dp4IAg2F.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-C-_Er3Ak.js";
import "./Combination-D-qobmSK.js";
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
function ERPMaterialsPage() {
  const {
    session,
    profile
  } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [materials, setMaterials] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("All");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [editingMaterial, setEditingMaterial] = reactExports.useState(null);
  const [priceHistory, setPriceHistory] = reactExports.useState([]);
  const [loadingHistory, setLoadingHistory] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Ferrous");
  const [unit, setUnit] = reactExports.useState("kg");
  const [buyPrice, setBuyPrice] = reactExports.useState(0);
  const [sellPrice, setSellPrice] = reactExports.useState(0);
  const [stock, setStock] = reactExports.useState(0);
  const [threshold, setThreshold] = reactExports.useState(0);
  const [color, setColor] = reactExports.useState("#f5a623");
  reactExports.useEffect(() => {
    loadMaterials();
  }, [session, categoryFilter]);
  async function loadMaterials() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const cat = categoryFilter === "All" ? void 0 : categoryFilter;
      const res = await fetchERPMaterials(session.access_token, cat);
      if (res.success) {
        setMaterials(res.materials);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  }
  const filtered = materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  function openCreate() {
    setEditingMaterial(null);
    setName("");
    setCategory("Ferrous");
    setUnit("kg");
    setBuyPrice(0);
    setSellPrice(0);
    setStock(0);
    setThreshold(0);
    setColor("#f5a623");
    setDialogOpen(true);
  }
  function openEdit(m) {
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
  async function viewHistory(m) {
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
  async function handleSubmit(e) {
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
      stock_qty: Number(stock)
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
    } catch (err) {
      toast.error(err.message || "Failed to save material details");
    }
  }
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to deactivate this material?")) return;
    try {
      const res = await deleteERPMaterial(id, session?.access_token);
      if (res.success) {
        toast.success("Material deactivated successfully");
        loadMaterials();
      }
    } catch (err) {
      toast.error(err.message || "Failed to deactivate material");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search catalog...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 rounded-xl border border-border bg-card text-xs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto justify-end items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-border bg-muted/40 p-0.5", children: ["All", "Ferrous", "Non-Ferrous"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategoryFilter(c), className: `rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all ${categoryFilter === c ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: loadMaterials, disabled: loading, className: "rounded-xl cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openCreate, className: "rounded-xl gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Material"
        ] })
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Material" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Buying Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Selling Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Stock Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Min Threshold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        filtered.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full", style: {
              backgroundColor: m.color_hex
            } }),
            m.name
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground", children: m.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-emerald-600", children: [
            "₹ ",
            m.buy_price.toFixed(2),
            " / ",
            m.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-primary", children: [
            "₹ ",
            m.sell_price.toFixed(2),
            " / ",
            m.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-semibold ${m.is_low_stock ? "text-red-500 font-bold" : "text-foreground"}`, children: [
              m.stock_qty.toLocaleString(),
              " ",
              m.unit
            ] }),
            m.is_low_stock && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-1.5 bg-red-50 text-red-600 border-red-100 text-[9px] rounded px-1.5 py-0", children: "ALERT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right text-muted-foreground", children: [
            m.min_threshold,
            " ",
            m.unit
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => viewHistory(m), className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", title: "Price Log", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(m), className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", title: "Edit Details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" }) }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(m.id), className: "h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, m.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-6 py-10 text-center text-muted-foreground", children: "No materials cataloged in this filter criteria." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: editingMaterial ? "Edit Material Catalog Details" : "Create Material Catalog Entry" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-name", children: "Material Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-name", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Copper wire, Cardboard", required: true, className: "rounded-xl border border-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-category", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "mat-category", value: category, onChange: (e) => setCategory(e.target.value), className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Ferrous", children: "Ferrous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Non-Ferrous", children: "Non-Ferrous" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-unit", children: "Measuring Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-unit", value: unit, onChange: (e) => setUnit(e.target.value), placeholder: "kg, tons", required: true, className: "rounded-xl border border-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-buy", children: "Buying Price per unit (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-buy", type: "number", step: "0.01", value: buyPrice, onChange: (e) => setBuyPrice(Number(e.target.value)), required: true, className: "rounded-xl border border-border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-sell", children: "Selling Price per unit (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-sell", type: "number", step: "0.01", value: sellPrice, onChange: (e) => setSellPrice(Number(e.target.value)), required: true, className: "rounded-xl border border-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-stock", children: "Initial Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "mat-stock",
                type: "number",
                step: "0.01",
                value: stock,
                onChange: (e) => setStock(Number(e.target.value)),
                disabled: !!editingMaterial,
                className: "rounded-xl border border-border"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-threshold", children: "Stock Alert Level (Min)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-threshold", type: "number", step: "0.01", value: threshold, onChange: (e) => setThreshold(Number(e.target.value)), className: "rounded-xl border border-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mat-color", children: "Visual Tag Color" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mat-color", type: "color", value: color, onChange: (e) => setColor(e.target.value), className: "h-10 w-16 p-0 border border-border rounded-xl cursor-pointer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: color.toUpperCase() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setDialogOpen(false), className: "rounded-xl cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl cursor-pointer", children: "Save" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: historyOpen, onOpenChange: setHistoryOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: "Price Revision Logs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        loadingHistory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full animate-pulse" })
        ] }),
        !loadingHistory && priceHistory.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-6 text-xs text-muted-foreground", children: "No price modifications recorded for this material." }),
        !loadingHistory && priceHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[300px] overflow-y-auto space-y-3 pr-1 scrollbar-thin", children: priceHistory.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-3 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Edited by: ",
              h.changed_by_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(h.changed_at).toLocaleString("en-IN") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "Buying Price Shift:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                "₹",
                h.old_buy_price,
                " → ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-emerald-600", children: [
                  "₹",
                  h.new_buy_price
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "Selling Price Shift:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                "₹",
                h.old_sell_price,
                " → ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-primary", children: [
                  "₹",
                  h.new_sell_price
                ] })
              ] })
            ] })
          ] })
        ] }, h.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setHistoryOpen(false), className: "rounded-xl cursor-pointer", children: "Close" }) })
      ] })
    ] }) })
  ] });
}
export {
  ERPMaterialsPage as component
};
