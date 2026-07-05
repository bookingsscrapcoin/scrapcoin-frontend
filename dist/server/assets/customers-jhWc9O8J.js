import { r as reactExports, W as jsxRuntimeExports } from "./server-DKXFnG2y.js";
import { u as useAuth, t as toast, B as Button } from "./router-CUjz2nh8.js";
import { m as fetchERPCustomers, y as fetchERPCustomerDetail, z as deleteERPCustomer, A as updateERPCustomer, B as createERPCustomer } from "./api-CHfPu43u.js";
import { I as Input } from "./input-Ko5dbF3h.js";
import { L as Label } from "./label-BNP29IAU.js";
import { S as Skeleton } from "./skeleton-Brt-a4jg.js";
import { B as Badge } from "./badge-DgGMq6sK.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Ki2fPrXz.js";
import { S as Search } from "./search-Cv0HRDpX.js";
import { R as RotateCw } from "./rotate-cw-Hxk4hlTO.js";
import { P as Plus, T as Trash2 } from "./trash-2-kCLo_0RV.js";
import { P as Phone, M as MapPin } from "./phone-CQkIsfxu.js";
import { E as Eye } from "./eye-BHJkWwRB.js";
import { P as Pen } from "./pen-BZvtdWur.js";
import { F as FileText } from "./file-text-B-xyRpUN.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-DPN6oNeo.js";
import "./Combination-Bz2yd4Rr.js";
import "./x-W6FuaBpN.js";
function ERPCustomersPage() {
  const {
    session,
    profile
  } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [customers, setCustomers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const [editingCustomer, setEditingCustomer] = reactExports.useState(null);
  const [selectedCustomer, setSelectedCustomer] = reactExports.useState(null);
  const [recentReceipts, setRecentReceipts] = reactExports.useState([]);
  const [loadingDetail, setLoadingDetail] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [idType, setIdType] = reactExports.useState("Aadhaar");
  const [idNumber, setIdNumber] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    loadCustomers();
  }, [session, search]);
  async function loadCustomers() {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetchERPCustomers(session.access_token, search || void 0);
      if (res.success) {
        setCustomers(res.customers);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }
  function openCreate() {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setAddress("");
    setIdType("Aadhaar");
    setIdNumber("");
    setNotes("");
    setDialogOpen(true);
  }
  function openEdit(c) {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setIdType(c.id_type || "Aadhaar");
    setIdNumber(c.id_number || "");
    setNotes(c.notes || "");
    setDialogOpen(true);
  }
  async function viewDetail(c) {
    setSelectedCustomer(c);
    setRecentReceipts([]);
    setDetailOpen(true);
    setLoadingDetail(true);
    try {
      const res = await fetchERPCustomerDetail(c.id, session?.access_token);
      if (res.success) {
        setRecentReceipts(res.receipts);
      }
    } catch {
      toast.error("Could not fetch customer ledger logs");
    } finally {
      setLoadingDetail(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Customer name is required");
    const payload = {
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
      id_type: idType || null,
      id_number: idNumber.trim() || null,
      notes: notes.trim() || null
    };
    try {
      if (editingCustomer) {
        const res = await updateERPCustomer(editingCustomer.id, payload, session?.access_token);
        if (res.success) {
          toast.success("Customer profile updated");
          setDialogOpen(false);
          loadCustomers();
        }
      } else {
        const res = await createERPCustomer(payload, session?.access_token);
        if (res.success) {
          toast.success("Customer registered successfully");
          setDialogOpen(false);
          loadCustomers();
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to save customer profile");
    }
  }
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to deactivate this customer?")) return;
    try {
      const res = await deleteERPCustomer(id, session?.access_token);
      if (res.success) {
        toast.success("Customer profile deactivated");
        loadCustomers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete customer");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search B2C customers list...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 rounded-xl border border-border bg-card text-xs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto justify-end items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: loadCustomers, disabled: loading, className: "rounded-xl cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openCreate, className: "rounded-xl gap-1.5 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Household Customer"
        ] })
      ] })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-2xl border border-border/60 bg-card p-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/40 last:border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 animate-pulse" })
    ] }, i)) }),
    !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Phone / Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Verification ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Pickups visits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Lifetime Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-semibold text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.name }),
            c.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-normal italic truncate max-w-[150px]", children: c.notes })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-muted-foreground whitespace-nowrap", children: c.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
            " ",
            c.phone
          ] }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-muted-foreground", children: c.id_type ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            c.id_type,
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: c.id_number })
          ] }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-semibold text-foreground", children: [
            c.total_visits,
            " collections"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-right font-bold text-foreground", children: [
            "₹ ",
            c.total_paid?.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => viewDetail(c), className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", title: "View Ledger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(c), className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" }) }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(c.id), className: "h-7 w-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, c.id)),
        customers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-6 py-10 text-center text-muted-foreground", children: 'No household customers registered. Click "Add Household Customer" to create.' }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: editingCustomer ? "Edit Customer details" : "Register B2C Customer (Household)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-name", children: "Customer Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cust-name", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Rahul Verma", required: true, className: "rounded-xl border border-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-phone", children: "WhatsApp/Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cust-phone", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+91 XXXXX XXXXX", className: "rounded-xl border border-border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-address", children: "Apartment/Flat address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cust-address", value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Gaur City Tower B FLAT 1402...", className: "rounded-xl border border-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-id-type", children: "Govt ID Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "cust-id-type", value: idType, onChange: (e) => setIdType(e.target.value), className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Aadhaar", children: "Aadhaar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PAN Card", children: "PAN Card" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Voter ID", children: "Voter ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Driving License", children: "Driving License" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-id-num", children: "ID Verification Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cust-id-num", value: idNumber, onChange: (e) => setIdNumber(e.target.value), placeholder: "ID Card Number...", className: "rounded-xl border border-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-notes", children: "Internal Remarks / Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cust-notes", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "RWA coordinator, bulk supplier...", className: "rounded-xl border border-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setDialogOpen(false), className: "rounded-xl cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl cursor-pointer", children: "Save Customer" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detailOpen, onOpenChange: setDetailOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl bg-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: "Customer Collection History (Ledger)" }) }),
      selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: selectedCustomer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-primary/10 text-primary border-primary/20", children: "HOUSEHOLD B2C CUSTOMER" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-muted-foreground mt-2", children: [
            selectedCustomer.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-primary" }),
              " ",
              selectedCustomer.phone
            ] }),
            selectedCustomer.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 flex items-start gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary mt-0.5 shrink-0" }),
              " ",
              selectedCustomer.address
            ] }),
            selectedCustomer.id_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3 text-primary shrink-0" }),
              " ID verified — ",
              selectedCustomer.id_type,
              ": ",
              selectedCustomer.id_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground mb-2", children: "Household collections scale receipts (B2C)" }),
          loadingDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full animate-pulse" })
          ] }),
          !loadingDetail && recentReceipts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-6 text-xs text-muted-foreground", children: "No scale pickup collections logged for this customer." }),
          !loadingDetail && recentReceipts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card max-h-[220px] overflow-y-auto pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[11px] border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30 text-left text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2.5 font-medium", children: "Receipt No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2.5 font-medium", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2.5 font-medium", children: "Material" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2.5 font-medium text-right", children: "Weighed Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2.5 font-medium text-right", children: "Paid Out" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: recentReceipts.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10 animate-in fade-in duration-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 font-semibold text-foreground", children: r.receipt_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-muted-foreground", children: new Date(r.created_at).toLocaleDateString("en-IN") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-foreground font-medium", children: r.material_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right text-muted-foreground", children: [
                r.weight,
                " ",
                r.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right font-bold text-foreground", children: [
                "₹",
                Number(r.total_amount).toLocaleString()
              ] })
            ] }, r.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setDetailOpen(false), className: "rounded-xl cursor-pointer", children: "Close Details" }) })
      ] })
    ] }) })
  ] });
}
export {
  ERPCustomersPage as component
};
