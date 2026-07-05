import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { NavAuth } from "../routes/__root";

export function Header() {
  return (
    <>
      {/* Announcement Banner — always visible, no dismiss */}
      <div
        className="w-full text-white text-center py-2 px-4 text-[11px] sm:text-xs font-semibold flex items-center justify-center shrink-0 z-50"
        style={{ backgroundColor: "#1a6b3a", minHeight: "36px" }}
      >
        🎉 Now serving Noida, Greater Noida &amp; Indirapuram — Book your pickup today
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="The Scrap Co. home">
            <BrandLogo size={60} />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <Link
              to="/about"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-bold" }}
            >
              About
            </Link>
            <Link
              to="/rates"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-bold" }}
            >
              Rates
            </Link>
            <Link
              to="/faq"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-bold" }}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-bold" }}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/" hash="booking">
              <Button
                size="sm"
                className="rounded-full shadow-sm cursor-pointer hidden sm:inline-flex"
              >
                Schedule a Pickup
              </Button>
            </Link>
            <NavAuth />
          </div>
        </div>
      </header>
    </>
  );
}
