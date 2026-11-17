import {
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  Building2,
  CircleHelp,
  FileSearch,
  FileText,
  Fingerprint,
  Lightbulb,
  ListChecks,
  MinusCircle,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { DemoNotice, IconTile } from "@/components/site/common";
import { formatDate, formatMoney, useLang } from "@/lib/i18n";
import type { CheckState, Severity, VerificationResult, VerificationStatus } from "@/lib/wethaq/types";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    status: { verified: "Verified", warning: "Warning", not_verified: "Not Verified" },
    method: { upload: "Document upload", reference: "Verification reference", qr: "QR code scan" },
    sections: {
      info: "Document information",
      source: "Source verification",
      integrity: "Integrity check",
      risk: "AI risk analysis",
      explain: "AI explanation",
      actions: "Recommended action",
    },
    info: { type: "Document type", number: "Document number", issuer: "Issuing business", issued: "Issue date", checked: "Verification date", total: "Total amount", account: "Payment account", ref: "Reference" },
    signature: "Digital signature",
    business: "Business profile",
    noIndicators: "No suspicious indicators detected.",
    notAnalyzed: "Not analysed — there was no verified original to compare against.",
    severity: { high: "High risk", medium: "Medium risk", low: "Low risk" },
    state: { pass: "Passed", fail: "Failed", not_checked: "Not checked", unknown: "Unknown" },
    demo: "This result was produced from simulated data. It is not a real verification and must not be relied on for payments.",
    aiNote: "AI findings are risk indicators, not legal or financial decisions. Cryptographic checks remain the source of truth.",
    unavailable: "Not available",
  },
  ar: {
    status: { verified: "موثّق", warning: "تحذير", not_verified: "غير موثّق" },
    method: { upload: "رفع مستند", reference: "مرجع التحقق", qr: "مسح رمز QR" },
    sections: {
      info: "معلومات المستند",
      source: "التحقق من المصدر",
      integrity: "فحص السلامة",
      risk: "تحليل المخاطر بالذكاء الاصطناعي",
      explain: "شرح الذكاء الاصطناعي",
      actions: "الإجراء الموصى به",
    },
    info: { type: "نوع المستند", number: "رقم المستند", issuer: "المنشأة المُصدِرة", issued: "تاريخ الإصدار", checked: "تاريخ التحقق", total: "المبلغ الإجمالي", account: "حساب الدفع", ref: "المرجع" },
    signature: "التوقيع الرقمي",
    business: "ملف المنشأة",
    noIndicators: "لم يتم اكتشاف مؤشرات مريبة.",
    notAnalyzed: "لم يتم التحليل — لا توجد نسخة أصلية موثّقة للمقارنة.",
    severity: { high: "خطورة عالية", medium: "خطورة متوسطة", low: "خطورة منخفضة" },
    state: { pass: "ناجح", fail: "فشل", not_checked: "لم يُفحص", unknown: "غير معروف" },
    demo: "هذه النتيجة مبنية على بيانات محاكاة. ليست تحققاً حقيقياً ولا يجوز الاعتماد عليها في الدفع.",
    aiNote: "نتائج الذكاء الاصطناعي مؤشرات مخاطر وليست قرارات قانونية أو مالية. يبقى الفحص التشفيري هو المرجع الأساسي.",
    unavailable: "غير متاح",
  },
};

const statusStyle: Record<VerificationStatus, { ring: string; icon: ReactNode; tone: "verified" | "warning" | "caution" }> = {
  verified: { ring: "border-verified/30 bg-verified/5", icon: <ShieldCheck />, tone: "verified" },
  warning: { ring: "border-warning/30 bg-warning/5", icon: <ShieldAlert />, tone: "warning" },
  not_verified: { ring: "border-caution/30 bg-caution/5", icon: <CircleHelp />, tone: "caution" },
};

function StateBadge({ state, label }: { state: CheckState; label: string }) {
  const map = {
    pass: { v: "verified" as const, i: <BadgeCheck className="size-3.5" /> },
    fail: { v: "warning" as const, i: <XCircle className="size-3.5" /> },
    not_checked: { v: "caution" as const, i: <MinusCircle className="size-3.5" /> },
    unknown: { v: "caution" as const, i: <CircleHelp className="size-3.5" /> },
  }[state];
  return (
    <Badge variant={map.v}>
      {map.i}
      {label}
    </Badge>
  );
}

function Card({ icon, title, tone = "primary", children, className }: { icon: ReactNode; title: string; tone?: "primary" | "verified" | "warning" | "navy" | "caution"; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-card md:p-6", className)}>
      <div className="mb-4 flex items-center gap-3">
        <IconTile tone={tone}>{icon}</IconTile>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

const severityVariant: Record<Severity, "warning" | "caution" | "soft"> = { high: "warning", medium: "caution", low: "soft" };

export function ResultDashboard({ result }: { result: VerificationResult }) {
  const { lang } = useLang();
  const t = copy[lang];
  const s = statusStyle[result.status];
  const info = result.documentInfo;

  return (
    <div className="space-y-5" aria-live="polite">
      <DemoNotice>{t.demo}</DemoNotice>

      {/* A. Status */}
      <section className={cn("flex flex-col gap-5 rounded-2xl border-2 p-6 md:flex-row md:items-center", s.ring)}>
        <IconTile tone={s.tone} className="size-16 rounded-2xl [&_svg]:size-8">{s.icon}</IconTile>
        <div className="flex-1">
          <Badge variant={s.tone} className="mb-2 px-3 py-1 text-sm uppercase rtl:normal-case">
            {t.status[result.status]}
          </Badge>
          <h2 className="text-2xl font-bold">{result.headline[lang]}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.method[result.method]} · {formatDate(result.verifiedAt, lang)}
            {result.reference && <> · <span dir="ltr" className="font-mono">{result.reference}</span></>}
          </p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* B. Document info */}
        <Card icon={<FileText />} title={t.sections.info} tone="navy">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              [t.info.type, info?.type[lang]],
              [t.info.number, info?.number],
              [t.info.issuer, info?.issuer],
              [t.info.issued, info && formatDate(info.issueDate, lang)],
              [t.info.checked, formatDate(result.verifiedAt, lang)],
              [t.info.total, info && formatMoney(info.total, info.currency, lang)],
              [t.info.account, info?.maskedAccount],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-navy" dir={k === t.info.account ? "ltr" : undefined}>
                  {v ?? <span className="text-muted-foreground">{t.unavailable}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* C. Source */}
        <Card icon={<Building2 />} title={t.sections.source}>
          <ul className="space-y-4 text-sm">
            <li className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-navy">{t.business}</span>
                <StateBadge state={result.source.state} label={t.state[result.source.state]} />
              </div>
              <p className="text-muted-foreground">{result.source.detail[lang]}</p>
            </li>
            <li className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-navy">{t.signature}</span>
                <StateBadge state={result.signature.state} label={t.state[result.signature.state]} />
              </div>
              <p className="text-muted-foreground">{result.signature.detail[lang]}</p>
            </li>
          </ul>
        </Card>

        {/* D. Integrity */}
        <Card icon={<Fingerprint />} title={t.sections.integrity} tone={result.integrity.state === "fail" ? "warning" : "verified"}>
          <div className="mb-2"><StateBadge state={result.integrity.state} label={t.state[result.integrity.state]} /></div>
          <p className="text-sm text-muted-foreground">{result.integrity.detail[lang]}</p>
        </Card>

        {/* E. AI risk analysis */}
        <Card icon={<FileSearch />} title={t.sections.risk} tone={result.indicators.length ? "warning" : "verified"}>
          {result.indicators.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {result.status === "not_verified" ? t.notAnalyzed : <><BadgeCheck className="size-4 text-verified" />{t.noIndicators}</>}
            </p>
          ) : (
            <ul className="space-y-3">
              {result.indicators.map((ind) => (
                <li key={ind.id} className="rounded-xl border border-warning/20 bg-warning/5 p-3">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                      <AlertTriangle className="size-4 text-warning" />
                      {ind.title[lang]}
                    </span>
                    <Badge variant={severityVariant[ind.severity]}>{t.severity[ind.severity]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ind.detail[lang]}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* F. Explanation */}
      <Card icon={<BrainCircuit />} title={t.sections.explain} className="bg-surface-blue">
        <p className="leading-relaxed text-navy">{result.explanation[lang]}</p>
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Lightbulb className="mt-0.5 size-3.5 shrink-0" /> {t.aiNote}
        </p>
      </Card>

      {/* G. Actions */}
      <Card icon={<ListChecks />} title={t.sections.actions} tone={result.status === "warning" ? "warning" : "primary"}>
        <ol className="space-y-2.5">
          {result.actions.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-navy-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5 text-navy">{a[lang]}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
