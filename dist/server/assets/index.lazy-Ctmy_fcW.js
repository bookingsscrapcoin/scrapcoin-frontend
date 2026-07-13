import { ab as createLazyFileRoute, r as reactExports, L as jsxRuntimeExports, b3 as DollarSign, b4 as TrendingUp, ak as Scale, b5 as Calendar, al as FileText, b6 as TriangleAlert } from "./vendor-OkomiPNA.js";
import { u as useAuth } from "./router--AfMktBh.js";
import { f as fetchERPDashboard } from "./api-CEarRw-2.js";
import { S as Skeleton } from "./skeleton-CT2LEmSj.js";
import { B as Badge } from "./badge-CgU6qts2.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar, P as PieChart, b as Pie, c as Cell } from "./recharts-vendor-DdlrB62Y.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./supabase-CTZyeyMt.js";
const Route = createLazyFileRoute("/admin/erp/")({
  component: ERPDashboard
});
const INVOICE_STATUS_COLORS = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200"
};
const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f"];
function ERPDashboard() {
  const { session } = useAuth();
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!session?.access_token) return;
    async function load() {
      try {
        const res = await fetchERPDashboard(session?.access_token);
        if (res.success) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);
  if (loading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] lg:col-span-2 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[300px] rounded-2xl" })
      ] })
    ] });
  }
  const { revenue, low_stock_alerts, recent_transactions, monthly_trend, top_materials, invoice_summary } = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: "Revenue (This Month)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4.5 w-4.5 text-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-2xl font-bold text-foreground", children: [
          "₹",
          revenue.revenue_this_month.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1 text-[10px] text-emerald-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active transactions" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: "Total Collected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4.5 w-4.5 text-secondary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-2xl font-bold text-foreground", children: [
          revenue.weight_this_month.toLocaleString("en-IN"),
          " kg"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This calendar month" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: "Transactions Count" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4.5 w-4.5 text-amber-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-bold text-foreground", children: revenue.txn_count_this_month }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "B2B scale tickets logged" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: "Outstanding Invoices" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4.5 w-4.5 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-2xl font-bold text-foreground", children: [
          "₹",
          invoice_summary.pending_amount.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center gap-1 text-[10px] text-red-500 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          invoice_summary.pending_count,
          " pending invoices"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: "6-Month Purchase Trend" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthly_trend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: { fontSize: 11 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 11 }, tickFormatter: (v) => `₹${v / 1e3}k` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => [`₹${Number(value).toLocaleString()}`, "Revenue"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "total_revenue", fill: "var(--primary)", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: "Top Materials (Revenue)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[180px] w-full relative", children: top_materials.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-xs text-muted-foreground", children: "No collection records this month" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: top_materials,
              dataKey: "revenue",
              nameKey: "name",
              cx: "50%",
              cy: "50%",
              outerRadius: 70,
              label: ({ name }) => name,
              children: top_materials.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color_hex || CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `₹${Number(value).toLocaleString()}` })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1.5", children: top_materials.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full", style: { backgroundColor: m.color_hex || CHART_COLORS[i % CHART_COLORS.length] } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: m.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            "₹",
            m.revenue.toLocaleString()
          ] })
        ] }, m.name)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: "Recent Scale Tickets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-left text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 pr-2 font-medium", children: "Txn No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 pr-2 font-medium", children: "Supplier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 pr-2 font-medium", children: "Material" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 pr-2 font-medium", children: "Weight" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 pr-2 font-medium text-right", children: "Payout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Invoice" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
            recent_transactions.slice(0, 5).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-2 font-semibold text-foreground whitespace-nowrap", children: t.txn_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-2 text-muted-foreground whitespace-nowrap truncate max-w-[120px]", children: t.supplier_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pr-2 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: { backgroundColor: t.color_hex } }),
                t.material_name
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 pr-2 text-muted-foreground whitespace-nowrap", children: [
                t.weight,
                " ",
                t.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 pr-2 text-right font-bold text-foreground", children: [
                "₹",
                t.total_amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `rounded-full text-[10px] px-2 py-0.5 ${INVOICE_STATUS_COLORS[t.invoice_status] || "bg-gray-100"}`,
                  children: t.invoice_status.toUpperCase()
                }
              ) })
            ] }, t.id)),
            recent_transactions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "py-8 text-center text-muted-foreground", children: "No scale tickets registered." }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: "Stock Threshold Alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-h-[250px] overflow-y-auto pr-1", children: [
          low_stock_alerts.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 border-b border-border/40 pb-3 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: m.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600", children: "LOW STOCK" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Current Stock: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-red-500 font-bold", children: [
                  m.stock_qty,
                  " ",
                  m.unit
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Min Threshold: ",
                m.min_threshold,
                " ",
                m.unit
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-red-500 rounded-full",
                style: { width: `${Math.min(100, m.stock_qty / (m.min_threshold || 1) * 100)}%` }
              }
            ) })
          ] }, m.id)),
          low_stock_alerts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-xs text-muted-foreground", children: "All materials are above minimum stock levels." })
        ] })
      ] })
    ] })
  ] });
}
export {
  Route
};
