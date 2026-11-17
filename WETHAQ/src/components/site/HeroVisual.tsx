import { BadgeCheck, BrainCircuit, ShieldCheck } from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { SAMPLE_REFERENCE } from "@/lib/wethaq/demo-data";
import { QrImage, verifyUrl } from "./common";

const copy = {
  en: { invoice: "Invoice", total: "Total", ai: "AI analysis", aiDone: "6 checks · 0 risks", verified: "Verified", source: "Source & integrity confirmed", sig: "Signed · ECDSA P-256", items: ["Network installation", "Maintenance contract", "Cabling (24 pts)"] },
  ar: { invoice: "فاتورة", total: "الإجمالي", ai: "التحليل الذكي", aiDone: "6 فحوصات · 0 مخاطر", verified: "موثّق", source: "تم تأكيد المصدر والسلامة", sig: "موقّع · ECDSA P-256", items: ["تركيب الشبكة", "عقد الصيانة", "التمديدات (24 نقطة)"] },
};

/** Coded dashboard preview: invoice, QR, AI indicator, verified badge, shield. */
export function HeroVisual() {
  const t = useCopy(copy);
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-brand-gradient opacity-25 blur-3xl" />
      <div className="relative rounded-3xl border border-navy-foreground/10 bg-card p-5 shadow-elevated md:p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-xs text-muted-foreground">{t.invoice}</p>
            <p className="font-bold text-navy">INV-2026-0148</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/10 px-3 py-1 text-xs font-semibold text-verified">
            <BadgeCheck className="size-3.5" /> {t.verified}
          </span>
        </div>
        <div className="space-y-2.5 py-4">
          {t.items.map((item, i) => (
            <div key={item} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{item}</span>
              <span className="font-medium text-navy" dir="ltr">{["1,850.000", "640.000", "300.000"][i]}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2.5 text-sm font-bold text-navy">
            <span>{t.total}</span>
            <span dir="ltr">OMR 2,790.000</span>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-surface-gray p-3">
          <div className="relative overflow-hidden rounded-lg border bg-card p-1.5">
            <QrImage value={verifyUrl(SAMPLE_REFERENCE)} size={76} label="QR" />
            <span className="animate-scan absolute inset-x-1 h-0.5 bg-primary/70 shadow-glow" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-navy">
              <BrainCircuit className="size-4 text-primary" /> {t.ai}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full w-full rounded-full bg-brand-gradient" />
            </div>
            <p className="text-xs text-muted-foreground">{t.aiDone}</p>
            <p className="font-mono text-[11px] text-muted-foreground" dir="ltr">{SAMPLE_REFERENCE}</p>
          </div>
        </div>
      </div>

      <div className="animate-float absolute -bottom-6 start-[-1rem] flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-elevated md:start-[-2rem]">
        <div className="flex size-10 items-center justify-center rounded-xl bg-verified text-verified-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">{t.source}</p>
          <p className="text-xs text-muted-foreground">{t.sig}</p>
        </div>
      </div>
    </div>
  );
}
