import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: number;
}

/**
 * "Eco-friendly & Circular" brand mark for The Scrap Co.
 * Three rotating rings around a central leaf.
 */
export function BrandLogo({
  className,
  showWordmark = true,
  showTagline = false,
  size = 40,
}: BrandLogoProps) {
  const ring = "absolute inset-0 rounded-full border-[3px]";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span
          className={cn(ring, "animate-[spin_6s_linear_infinite]")}
          style={{ borderColor: "oklch(0.62 0.18 150)", borderTopColor: "transparent" }}
        />
        <span
          className={cn(ring, "animate-[spin_8s_linear_infinite_reverse]")}
          style={{ borderColor: "oklch(0.78 0.16 150)", borderRightColor: "transparent" }}
        />
        <span
          className={cn(ring, "animate-[spin_10s_linear_infinite]")}
          style={{ borderColor: "oklch(0.86 0.13 150)", borderBottomColor: "transparent" }}
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: size * 0.38,
            height: size * 0.38,
            background: "linear-gradient(135deg, oklch(0.62 0.18 150), oklch(0.50 0.16 155))",
            borderRadius: "0 100% 0 100%",
          }}
        />
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <span
            className="block bg-clip-text text-transparent font-bold tracking-tight"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.62 0.18 150), oklch(0.48 0.15 155))",
              fontSize: size * 0.58,
            }}
          >
            The Scrap Co.
          </span>
          {showTagline && (
            <span
              className="block font-semibold"
              style={{ color: "oklch(0.55 0.16 150)", fontSize: size * 0.28 }}
            >
              Sustainable Solutions
            </span>
          )}
        </div>
      )}
    </div>
  );
}
