import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <defs>
        <linearGradient id="wq-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--verified)" />
        </linearGradient>
      </defs>
      <path
        d="M20 2.5 34.5 8v10.6c0 9.3-6.1 16.4-14.5 18.9C11.6 35 5.5 27.9 5.5 18.6V8L20 2.5Z"
        fill="url(#wq-g)"
      />
      <path
        d="M12.5 19.5c2.2-3.4 5.3-3.4 7.5 0s5.3 3.4 7.5 0"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeOpacity=".55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="m14 21.5 4.2 4.2 8.3-9"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="WETHAQ home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-extrabold tracking-tight", inverted ? "text-navy-foreground" : "text-navy")}>
          WETHAQ
        </span>
        <span className={cn("font-arabic text-xs font-semibold", inverted ? "text-navy-muted" : "text-verified")}>
          وِثاق
        </span>
      </span>
    </Link>
  );
}
