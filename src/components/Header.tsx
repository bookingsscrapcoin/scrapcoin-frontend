import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { NavAuth } from "../routes/__root";
import { X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const isClosed = localStorage.getItem("scrapco-banner-closed");
    if (isClosed === "true") {
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("scrapco-banner-closed", "true");
  };

  return (
    <>
      {/* Announcement Banner */}
      {isOpen && (
        <div
          className="w-full text-white text-center py-2 px-8 text-[11px] sm:text-xs font-semibold relative flex items-center justify-center shrink-0 z-50"
          style={{ backgroundColor: "#1a6b3a", minHeight: "38px" }}
        >
          <span className="truncate pr-4">
            🎉 Now serving Gaur City 2, Sector 16C & Indirapuram — Book your pickup today
          </span>
          <button
            onClick={handleClose}
            className="absolute right-4 p-1 hover:opacity-85 transition-opacity cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="The Scrap Co. home">
            <BrandLogo size={60} />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-bold" }}>
              About
            </Link>
            <Link to="/rates" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-bold" }}>
              Rates
            </Link>
            <Link to="/faq" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-bold" }}>
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-bold" }}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/" hash="booking">
              <Button size="sm" className="rounded-full shadow-sm cursor-pointer hidden sm:inline-flex">
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
