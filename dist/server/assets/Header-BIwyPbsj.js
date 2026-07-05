import { r as reactExports, W as jsxRuntimeExports } from "./server-BCboCga-.js";
import { L as Link, B as Button, N as NavAuth } from "./router-BtyS5NJs.js";
import { B as BrandLogo } from "./brand-logo-oU_pjHA3.js";
import { X } from "./x-C7KmyigU.js";
const BANNER_VERSION = "v3-serving-noida";
function Header() {
  const [isOpen, setIsOpen] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const closedVersion = sessionStorage.getItem("scrapco-banner-closed");
    if (closedVersion === BANNER_VERSION) {
      setIsOpen(false);
    }
  }, []);
  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("scrapco-banner-closed", BANNER_VERSION);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full text-white text-center py-2 px-8 text-[11px] sm:text-xs font-semibold relative flex items-center justify-center shrink-0 z-50",
        style: { backgroundColor: "#1a6b3a", minHeight: "38px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate pr-4", children: "🎉 Now serving Noida, Greater Noida & Indirapuram — Book your pickup today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleClose,
              className: "absolute right-4 p-1 hover:opacity-85 transition-opacity cursor-pointer",
              "aria-label": "Dismiss banner",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "aria-label": "The Scrap Co. home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { size: 60 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-foreground transition-colors", activeProps: { className: "text-foreground font-bold" }, children: "About" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/rates", className: "hover:text-foreground transition-colors", activeProps: { className: "text-foreground font-bold" }, children: "Rates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faq", className: "hover:text-foreground transition-colors", activeProps: { className: "text-foreground font-bold" }, children: "FAQ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-foreground transition-colors", activeProps: { className: "text-foreground font-bold" }, children: "Contact" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", hash: "booking", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "rounded-full shadow-sm cursor-pointer hidden sm:inline-flex", children: "Schedule a Pickup" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NavAuth, {})
      ] })
    ] }) })
  ] });
}
export {
  Header as H
};
