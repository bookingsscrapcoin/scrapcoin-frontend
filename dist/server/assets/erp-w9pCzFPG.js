import { r as reactExports, W as jsxRuntimeExports, a3 as Outlet } from "./server-DKXFnG2y.js";
import { c as createLucideIcon, u as useAuth, a as useNavigate, L as Link, B as Button } from "./router-CUjz2nh8.js";
import { u as useRouterState, A as AdminLayout, L as LayoutDashboard } from "./AdminLayout-BCRobTNi.js";
import { T as Truck } from "./truck-B7X5WrU1.js";
import { S as Scale } from "./scale-BxdPOJ6C.js";
import { F as FileText } from "./file-text-B-xyRpUN.js";
import { U as Users } from "./users-DaAJTaVO.js";
import { M as MessageSquare } from "./message-square-CgUvCWsG.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DPN6oNeo.js";
import "./Combination-Bz2yd4Rr.js";
import "./x-W6FuaBpN.js";
import "./brand-logo-DCn5fLIT.js";
import "./package-BszmJgdr.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
];
const Boxes = createLucideIcon("boxes", __iconNode$1);
const __iconNode = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode);
const ERP_TABS = [{
  to: "/admin/erp",
  label: "Dashboard",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/admin/erp/materials",
  label: "Materials",
  icon: Boxes,
  exact: false
}, {
  to: "/admin/erp/suppliers",
  label: "Suppliers",
  icon: Truck,
  exact: false
}, {
  to: "/admin/erp/transactions",
  label: "Scale Entry",
  icon: Scale,
  exact: false
}, {
  to: "/admin/erp/invoices",
  label: "Invoices",
  icon: FileText,
  exact: false
}, {
  to: "/admin/erp/customers",
  label: "Customers (B2C)",
  icon: Users,
  exact: false
}, {
  to: "/admin/erp/receipts",
  label: "Receipts (B2C)",
  icon: Receipt,
  exact: false
}, {
  to: "/admin/erp/whatsapp",
  label: "WhatsApp Logs",
  icon: MessageSquare,
  exact: false
}];
function ERPLayout() {
  const {
    user,
    profile,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    pathname
  } = useRouterState({
    select: (s) => s.location
  });
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({
        to: "/"
      });
      return;
    }
    if (profile && profile.role !== "admin" && profile.role !== "champion") {
      navigate({
        to: "/"
      });
      return;
    }
  }, [user, profile, authLoading, navigate]);
  if (authLoading) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 border-b border-border/60 pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "ERP Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Manage B2B scale ticket entries, supplier invoices, material inventory, and B2C customer metrics." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20", children: "ERP Panel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin", children: ERP_TABS.map((tab) => {
        const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: tab.to, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: active ? "default" : "ghost", size: "sm", className: "rounded-full text-xs gap-1.5 shrink-0 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { className: "h-3.5 w-3.5" }),
          tab.label
        ] }) }, tab.to);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[450px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] }) });
}
export {
  ERPLayout as component
};
