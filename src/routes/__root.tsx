import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export { NavAuth } from "@/components/nav-auth";

const JSON_LD_LOCAL_BUSINESS = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://scrapco.in/#business",
  name: "The Scrap Co.",
  description:
    "Tech-enabled doorstep scrap pickup for apartments and RWAs in Greater Noida West, Noida, and Indirapuram. Transparent weighing, instant UPI payment, full traceability.",
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
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Greater Noida" },
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Indirapuram" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.instagram.com/scrapco.in",
    "https://www.facebook.com/share/19DUEDLcYa",
    "https://x.com/thescrapcoin",
  ],
  serviceType: "Scrap Collection and Recycling",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Scrap Materials",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paper & Cardboard Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Metal Scrap Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Plastic Scrap Pickup" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Waste Pickup" } },
    ],
  },
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Scrap Co. — Smart Scrap Pickup in Greater Noida West" },
      {
        name: "description",
        content:
          "Tech-enabled doorstep scrap collection for apartments in Greater Noida West. Transparent weighing, instant UPI payment, full traceability.",
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
        content:
          "Doorstep scrap pickup for apartments in Greater Noida West. Transparent digital weighing, instant UPI payment.",
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
        content: "Doorstep scrap pickup for apartments in Greater Noida West.",
      },
      { name: "twitter:image", content: "https://scrapco.in/images/Screenshot-1.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://scrapco.in/" },
    ],
  }),
  scripts: () => [
    {
      type: "application/ld+json",
      children: JSON_LD_LOCAL_BUSINESS,
    },
  ],
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
