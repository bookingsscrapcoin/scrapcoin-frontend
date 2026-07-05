import { W as jsxRuntimeExports, r as reactExports } from "./server-DKXFnG2y.js";
import { e as useComposedRefs, f as composeEventHandlers, p as createSlottable, h as createContextScope, i as cn, j as buttonVariants, u as useAuth, a as useNavigate, B as Button, t as toast } from "./router-CUjz2nh8.js";
import { A as AdminLayout } from "./AdminLayout-BCRobTNi.js";
import { I as Input } from "./input-Ko5dbF3h.js";
import { L as Label } from "./label-BNP29IAU.js";
import { S as Skeleton } from "./skeleton-Brt-a4jg.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-Ki2fPrXz.js";
import { R as Root, T as Trigger, c as createDialogScope, P as Portal, W as WarningProvider, C as Content, a as Title, D as Description, b as Close, O as Overlay } from "./index-DPN6oNeo.js";
import { P as Plus, T as Trash2 } from "./trash-2-kCLo_0RV.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-W6FuaBpN.js";
import "./brand-logo-DCn5fLIT.js";
import "./users-DaAJTaVO.js";
import "./package-BszmJgdr.js";
import "./Combination-Bz2yd4Rr.js";
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              event.preventDefault();
              cancelRef.current?.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    const hasDescription = document.getElementById(
      contentRef.current?.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const API_BASE = "http://localhost:4000";
function AdminCategories() {
  const {
    user,
    profile,
    session,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [editPrices, setEditPrices] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(null);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [newCat, setNewCat] = reactExports.useState({
    id: "",
    name: "",
    unit: "kg",
    price_per_unit: ""
  });
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({
        to: "/"
      });
      return;
    }
    if (profile && profile.role !== "admin") {
      navigate({
        to: "/"
      });
      return;
    }
  }, [user, profile, authLoading, navigate]);
  reactExports.useEffect(() => {
    if (!session?.access_token) return;
    fetchCategories();
  }, [session]);
  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCategories(data);
      const prices = {};
      data.forEach((c) => {
        prices[c.id] = String(c.pricePerUnit);
      });
      setEditPrices(prices);
    } finally {
      setLoading(false);
    }
  }
  async function savePrice(id) {
    setSaving(id);
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          price_per_unit: Number(editPrices[id])
        })
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => c.id === id ? updated : c));
      toast.success("Price updated");
    } catch {
      toast.error("Failed to update price");
    } finally {
      setSaving(null);
    }
  }
  async function addCategory() {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...newCat,
          price_per_unit: Number(newCat.price_per_unit)
        })
      });
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setEditPrices((prev) => ({
        ...prev,
        [created.id]: String(created.pricePerUnit)
      }));
      setNewCat({
        id: "",
        name: "",
        unit: "kg",
        price_per_unit: ""
      });
      setAddOpen(false);
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  }
  async function deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE}/api/scrap-categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) throw new Error("Failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Categories & Pricing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-full gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Category"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "ID (slug)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. glass", value: newCat.id, onChange: (e) => setNewCat((p) => ({
                ...p,
                id: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Glass", value: newCat.name, onChange: (e) => setNewCat((p) => ({
                ...p,
                name: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "kg", value: newCat.unit, onChange: (e) => setNewCat((p) => ({
                ...p,
                unit: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Price per unit (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "0", value: newCat.price_per_unit, onChange: (e) => setNewCat((p) => ({
                ...p,
                price_per_unit: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full rounded-full", onClick: addCategory, children: "Add Category" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No categories yet. Add one above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: ["Name", "Unit", "Price per kg (₹)", "Actions"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium whitespace-nowrap", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: c.unit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", className: "w-24 h-8 text-sm", value: editPrices[c.id] ?? "", onChange: (e) => setEditPrices((prev) => ({
            ...prev,
            [c.id]: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "h-8 rounded-full text-xs", disabled: saving === c.id, onClick: () => savePrice(c.id), children: saving === c.id ? "Saving..." : "Save" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete category?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                "This will permanently delete",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: c.name }),
                ". This action cannot be undone."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-red-500 hover:bg-red-600", onClick: () => deleteCategory(c.id), children: "Delete" })
            ] })
          ] })
        ] }) })
      ] }, c.id)) })
    ] }) }) })
  ] }) });
}
export {
  AdminCategories as component
};
