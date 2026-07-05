import { r as reactExports, W as jsxRuntimeExports } from "./server-DKXFnG2y.js";
import { c as createLucideIcon, u as useAuth, t as toast, B as Button } from "./router-CUjz2nh8.js";
import { b as fetchERPWhatsAppLogs } from "./api-CHfPu43u.js";
import { S as Skeleton } from "./skeleton-Brt-a4jg.js";
import { B as Badge } from "./badge-DgGMq6sK.js";
import { R as RotateCw } from "./rotate-cw-Hxk4hlTO.js";
import { C as CircleAlert } from "./circle-alert-CYNBkVim.js";
import { C as CircleCheck } from "./circle-check-DWczY7QT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
const LOG_STATUS_CONFIG = {
  sent: {
    label: "Sent",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CircleCheck
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: CircleX
  },
  skipped: {
    label: "Skipped",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CircleAlert
  }
};
function ERPWhatsAppLogsPage() {
  const {
    session
  } = useAuth();
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadLogs();
  }, [session]);
  async function loadLogs() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPWhatsAppLogs(session.access_token);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load WhatsApp dispatch history");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Twilio & Meta dispatch ledger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Logs of PDF receipt alerts sent to suppliers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadLogs, disabled: loading, className: "rounded-xl cursor-pointer font-semibold gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }),
        "Refresh Log"
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Receipt Ref" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Supplier Partner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Recipient Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Provider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Message ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "PDF Invoice" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        logs.map((log) => {
          const cfg = LOG_STATUS_CONFIG[log.status] || LOG_STATUS_CONFIG.skipped;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.txn_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-normal", children: new Date(log.sent_at).toLocaleString("en-IN") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-medium text-foreground whitespace-nowrap", children: log.supplier_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground whitespace-nowrap", children: log.supplier_phone }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: `rounded-full text-[10px] px-2.5 py-0.5 gap-1 ${cfg.className}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(cfg.icon, { className: "h-3 w-3" }),
              cfg.label.toUpperCase()
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground capitalize", children: log.provider }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground font-mono text-[10px] truncate max-w-[120px]", title: log.message_id || "", children: log.message_id || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: log.pdf_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: log.pdf_url, target: "_blank", rel: "noreferrer noopener", className: "inline-flex items-center gap-1 text-primary hover:underline font-semibold", children: [
              "PDF Document",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "None" }) })
          ] }, log.id);
        }),
        logs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-6 py-10 text-center text-muted-foreground", children: "No WhatsApp receipt dispatches recorded." }) })
      ] })
    ] }) }) })
  ] });
}
export {
  ERPWhatsAppLogsPage as component
};
