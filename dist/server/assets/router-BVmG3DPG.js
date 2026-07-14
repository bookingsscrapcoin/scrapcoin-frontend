import { r as reactExports, L as jsxRuntimeExports, M as twMerge, j as clsx, S as Slot, N as cva, O as Root, P as Image, Q as Fallback, T as Portal, U as Content2, V as Provider, W as Root3, X as Trigger, Y as createRootRouteWithContext, Z as captureException, $ as useRouter, a0 as Link, a1 as QueryClientProvider, a2 as Outlet, a3 as HeadContent, a4 as Scripts, a5 as createFileRoute, a6 as lazyRouteComponent, a7 as QueryClient, a8 as createRouter } from "./vendor-DwbuQL-J.js";
import { c as createClient } from "./supabase-i4OIPGPK.js";
const supabaseUrl = "https://mtzvoeohbifxmertnwwy.supabase.co";
const supabaseAnonKey = "sb_publishable_hqVgHskOyz-dcyMVG0kURg_Yin7El1X";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  async function fetchProfile(userId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!error && data) setProfile(data);
  }
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      if (session2?.user) fetchProfile(session2.user.id);
      setLoading(false);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session2) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      if (session2?.user) {
        await fetchProfile(session2.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  }
  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    if (error) throw error;
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: { user, profile, session, loading, signIn, signUp, signOut },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
const appCss = "/assets/styles-C0Bhy0vH.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
if (typeof window !== "undefined") {
  {
    console.warn("Sentry DSN not found in environment variables. Error tracking is disabled.");
  }
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  if (typeof window !== "undefined") {
    captureException(error);
  }
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const JSON_LD_LOCAL_BUSINESS = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://scrapco.in/#business",
  name: "The Scrap Co.",
  description: "Tech-enabled doorstep scrap pickup for apartments and RWAs in Greater Noida West, Noida, and Indirapuram. Transparent weighing, instant UPI payment, full traceability.",
  url: "https://scrapco.in",
  logo: "https://scrapco.in/images/logo.jpg",
  image: "https://scrapco.in/images/Screenshot-1.png",
  telephone: "+91-72920-16625",
  email: "bookings.scrapco@gmail.com",
  priceRange: "₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Cash",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Greater Noida West",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN"
  },
  areaServed: [
    { "@type": "City", name: "Greater Noida" },
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Indirapuram" }
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00"
  },
  sameAs: [
    "https://www.instagram.com/scrapco.in",
    "https://www.facebook.com/share/19DUEDLcYa",
    "https://x.com/thescrapcoin"
  ],
  serviceType: "Scrap Collection and Recycling",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Scrap Materials",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paper & Cardboard Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Metal Scrap Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Plastic Scrap Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Waste Pickup" } }
    ]
  }
});
const Route$r = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Scrap Co. — Smart Scrap Pickup in Greater Noida West" },
      {
        name: "description",
        content: "Tech-enabled doorstep scrap collection for apartments in Greater Noida West. Transparent weighing, instant UPI payment, full traceability."
      },
      { name: "author", content: "The Scrap Co." },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "R31npkH2HUW4zmf13jrTffEDFY0fbLuTPf46mJUli3o" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scrapco.in/" },
      { property: "og:title", content: "The Scrap Co. — Smart Scrap Pickup in Greater Noida West" },
      {
        property: "og:description",
        content: "Doorstep scrap pickup for apartments in Greater Noida West. Transparent digital weighing, instant UPI payment."
      },
      { property: "og:image", content: "https://scrapco.in/images/Screenshot-1.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_IN" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@thescrapcoin" },
      { name: "twitter:title", content: "The Scrap Co. — Smart Scrap Pickup" },
      {
        name: "twitter:description",
        content: "Doorstep scrap pickup for apartments in Greater Noida West."
      },
      { name: "twitter:image", content: "https://scrapco.in/images/Screenshot-1.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://scrapco.in/" }
    ]
  }),
  scripts: () => [
    {
      type: "application/ld+json",
      children: JSON_LD_LOCAL_BUSINESS
    }
  ],
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$r.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$d = () => import("./terms-D_3MiBP6.js");
const Route$q = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms of Service — The Scrap Co."
    }, {
      name: "description",
      content: "Terms of Service for using The Scrap Co. platform. Read about scheduling, digital weighing, payouts, and cancellations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./register-CqDcL0h4.js");
const Route$p = createFileRoute("/register")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./rates-Cj1v8Rje.js");
const Route$o = createFileRoute("/rates")({
  head: () => ({
    meta: [{
      title: "Today's Scrap Prices — Noida Area | The Scrap Co."
    }, {
      name: "description",
      content: "Check today's real-time scrap rates per kg in Noida. Transparent pricing for Cardboard, Plastics, Copper, Metals, and E-waste."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./privacy-CODW1qWE.js");
const Route$n = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — The Scrap Co."
    }, {
      name: "description",
      content: "Read the Privacy Policy of The Scrap Co. Learn how we handle your personal data under the DPDP Act 2023."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./partner-BsZriTpI.js");
const Route$m = createFileRoute("/partner")({
  head: () => ({
    meta: [{
      title: "Partner with Us — The Scrap Co."
    }, {
      name: "description",
      content: "Discover partnership options with The Scrap Co. for RWAs, apartment societies, and certified recycling companies."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./my-bookings-xgCjDj8E.js");
const Route$l = createFileRoute("/my-bookings")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./login-COH8MiMZ.js");
const Route$k = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./impact-DYHVZjLG.js");
const Route$j = createFileRoute("/impact")({
  head: () => ({
    meta: [{
      title: "Circular Impact & Sustainability — The Scrap Co."
    }, {
      name: "description",
      content: "Track our cumulative landfill diversion metrics. Learn how we route paper, plastics, metals, and e-waste to certified recyclers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./faq-BkcEkUJl.js");
const Route$i = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "FAQ — The Scrap Co."
    }, {
      name: "description",
      content: "Frequently Asked Questions about doorstep scrap pickup, digital weighing, payment modes, and operational areas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-Bn0d_S7c.js");
const Route$h = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact Us — The Scrap Co."
    }, {
      name: "description",
      content: "Get in touch with The Scrap Co. Contact us via WhatsApp, email, or find our Noida service areas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./careers-C7nwEA4D.js");
const Route$g = createFileRoute("/careers")({
  head: () => ({
    meta: [{
      title: "Careers — The Scrap Co."
    }, {
      name: "description",
      content: "Join the team at The Scrap Co. Explore job applications and help us build waste-to-worth infrastructure."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./blog-Dg5KAuuJ.js");
const Route$f = createFileRoute("/blog")({
  head: () => ({
    meta: [{
      title: "Blog & Resources — The Scrap Co."
    }, {
      name: "description",
      content: "Learn tips on recycling, sorting household scrap, metal rate trends, and environmental compliance at The Scrap Co. blog."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-Bw-RtjDS.js");
const Route$e = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About Us — The Scrap Co."
    }, {
      name: "description",
      content: "Learn how The Scrap Co. is digitizing doorstep scrap collection with calibrated digital scales and instant payouts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-z-znk-Ow.js");
const Route$d = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "The Scrap Co. — Smart Scrap Pickup in Greater Noida West"
    }, {
      name: "description",
      content: "Tech-enabled doorstep scrap collection for apartments in Greater Noida West. Transparent weighing, instant UPI payment, full traceability."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route$c = createFileRoute("/admin/")({
  // Eager configuration and loaders go here (if any). Component is lazy-loaded from index.lazy.tsx.
});
const Route$b = createFileRoute("/admin/users")({
  // Eager metadata definition. Component is split out.
});
const Route$a = createFileRoute("/admin/erp")({
  // Eager metadata definition. Component is split out.
});
const Route$9 = createFileRoute("/admin/categories")({
  // Eager metadata definition. Component is split out.
});
const Route$8 = createFileRoute("/admin/bookings")({
  // Eager metadata definition. Component is split out.
});
const Route$7 = createFileRoute("/admin/erp/")({
  // Eager configuration and loaders go here (if any). Component is lazy-loaded from index.lazy.tsx.
});
const Route$6 = createFileRoute("/admin/erp/whatsapp")({
  // Eager metadata definition. Component is split out.
});
const Route$5 = createFileRoute("/admin/erp/transactions")({
  // Eager metadata definition. Component is split out.
});
const Route$4 = createFileRoute("/admin/erp/suppliers")({
  // Eager metadata definition. Component is split out.
});
const Route$3 = createFileRoute("/admin/erp/receipts")({
  // Eager metadata definition. Component is split out.
});
const Route$2 = createFileRoute("/admin/erp/materials")({
  // Eager metadata definition. Component is split out.
});
const Route$1 = createFileRoute("/admin/erp/invoices")({
  // Eager metadata definition. Component is split out.
});
const Route = createFileRoute("/admin/erp/customers")({
  // Eager metadata definition. Component is split out.
});
const TermsRoute = Route$q.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$r
});
const RegisterRoute = Route$p.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$r
});
const RatesRoute = Route$o.update({
  id: "/rates",
  path: "/rates",
  getParentRoute: () => Route$r
});
const PrivacyRoute = Route$n.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$r
});
const PartnerRoute = Route$m.update({
  id: "/partner",
  path: "/partner",
  getParentRoute: () => Route$r
});
const MyBookingsRoute = Route$l.update({
  id: "/my-bookings",
  path: "/my-bookings",
  getParentRoute: () => Route$r
});
const LoginRoute = Route$k.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$r
});
const ImpactRoute = Route$j.update({
  id: "/impact",
  path: "/impact",
  getParentRoute: () => Route$r
});
const FaqRoute = Route$i.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$r
});
const ContactRoute = Route$h.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$r
});
const CareersRoute = Route$g.update({
  id: "/careers",
  path: "/careers",
  getParentRoute: () => Route$r
});
const BlogRoute = Route$f.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$r
});
const AboutRoute = Route$e.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$r
});
const IndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$r
});
const AdminIndexRoute = Route$c.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$r
}).lazy(() => import("./index.lazy-DRGVHNQO.js").then((d) => d.Route));
const AdminUsersRoute = Route$b.update({
  id: "/admin/users",
  path: "/admin/users",
  getParentRoute: () => Route$r
}).lazy(() => import("./users.lazy-BH0RJf7C.js").then((d) => d.Route));
const AdminErpRoute = Route$a.update({
  id: "/admin/erp",
  path: "/admin/erp",
  getParentRoute: () => Route$r
}).lazy(() => import("./erp.lazy-Czph3dki.js").then((d) => d.Route));
const AdminCategoriesRoute = Route$9.update({
  id: "/admin/categories",
  path: "/admin/categories",
  getParentRoute: () => Route$r
}).lazy(
  () => import("./categories.lazy-BOjzXouF.js").then((d) => d.Route)
);
const AdminBookingsRoute = Route$8.update({
  id: "/admin/bookings",
  path: "/admin/bookings",
  getParentRoute: () => Route$r
}).lazy(
  () => import("./bookings.lazy-CCk0ImK0.js").then((d) => d.Route)
);
const AdminErpIndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./index.lazy-ChlQXEl0.js").then((d) => d.Route)
);
const AdminErpWhatsappRoute = Route$6.update({
  id: "/whatsapp",
  path: "/whatsapp",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./whatsapp.lazy-B2tvTgr_.js").then((d) => d.Route)
);
const AdminErpTransactionsRoute = Route$5.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./transactions.lazy-DMkub0VV.js").then((d) => d.Route)
);
const AdminErpSuppliersRoute = Route$4.update({
  id: "/suppliers",
  path: "/suppliers",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./suppliers.lazy-Bisyev6n.js").then((d) => d.Route)
);
const AdminErpReceiptsRoute = Route$3.update({
  id: "/receipts",
  path: "/receipts",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./receipts.lazy-BGvsZIrk.js").then((d) => d.Route)
);
const AdminErpMaterialsRoute = Route$2.update({
  id: "/materials",
  path: "/materials",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./materials.lazy-yps5Sefe.js").then((d) => d.Route)
);
const AdminErpInvoicesRoute = Route$1.update({
  id: "/invoices",
  path: "/invoices",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./invoices.lazy-vXsFehHA.js").then((d) => d.Route)
);
const AdminErpCustomersRoute = Route.update({
  id: "/customers",
  path: "/customers",
  getParentRoute: () => AdminErpRoute
}).lazy(
  () => import("./customers.lazy-B50ihumY.js").then((d) => d.Route)
);
const AdminErpRouteChildren = {
  AdminErpCustomersRoute,
  AdminErpInvoicesRoute,
  AdminErpMaterialsRoute,
  AdminErpReceiptsRoute,
  AdminErpSuppliersRoute,
  AdminErpTransactionsRoute,
  AdminErpWhatsappRoute,
  AdminErpIndexRoute
};
const AdminErpRouteWithChildren = AdminErpRoute._addFileChildren(
  AdminErpRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  BlogRoute,
  CareersRoute,
  ContactRoute,
  FaqRoute,
  ImpactRoute,
  LoginRoute,
  MyBookingsRoute,
  PartnerRoute,
  PrivacyRoute,
  RatesRoute,
  RegisterRoute,
  TermsRoute,
  AdminBookingsRoute,
  AdminCategoriesRoute,
  AdminErpRoute: AdminErpRouteWithChildren,
  AdminUsersRoute,
  AdminIndexRoute
};
const routeTree = Route$r._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Avatar as A,
  Button as B,
  TooltipProvider as T,
  Tooltip as a,
  buttonVariants as b,
  cn as c,
  TooltipTrigger as d,
  AvatarFallback as e,
  TooltipContent as f,
  router as r,
  supabase as s,
  useAuth as u
};
