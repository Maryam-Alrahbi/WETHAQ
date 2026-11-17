import { FlaskConical } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary rtl:tracking-normal">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />
      <div className="container-page relative py-16 md:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 inline-flex rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-xs font-semibold text-navy-muted">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold text-navy-foreground md:text-5xl">{title}</h1>
          {description && <p className="mt-5 text-lg leading-relaxed text-navy-muted">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  const { lang } = useLang();
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-caution/30 bg-caution/10 px-4 py-3 text-sm text-navy",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0 text-caution" aria-hidden="true" />
      <div>
        <span className="font-semibold">{lang === "ar" ? "عرض توضيحي: " : "Demonstration: "}</span>
        {children}
      </div>
    </div>
  );
}

export function IconTile({ children, tone = "primary", className }: { children: ReactNode; tone?: "primary" | "verified" | "warning" | "navy" | "caution"; className?: string }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    verified: "bg-verified/10 text-verified",
    warning: "bg-warning/10 text-warning",
    caution: "bg-caution/10 text-caution",
    navy: "bg-navy text-navy-foreground",
  };
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5", tones[tone], className)}>
      {children}
    </div>
  );
}

export function QrImage({ value, size = 160, className, label }: { value: string; size?: number; className?: string; label: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    QRCode.toDataURL(value, { margin: 1, width: size * 2, errorCorrectionLevel: "M" })
      .then(setSrc)
      .catch(() => setSrc(null));
  }, [value, size]);
  return src ? (
    <img src={src} width={size} height={size} alt={label} className={cn("rounded-md", className)} />
  ) : (
    <div style={{ width: size, height: size }} className={cn("animate-pulse rounded-md bg-muted", className)} aria-label={label} />
  );
}

/** Public verification link encoded in QR codes. Reveals only the reference, never invoice content. */
export function verifyUrl(reference: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/verify?ref=${encodeURIComponent(reference)}`;
}
