import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDown,
  Camera,
  CheckCircle2,
  FileImage,
  FileText,
  FileUp,
  Loader2,
  QrCode,
  RotateCcw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DemoNotice, PageHero } from "@/components/site/common";
import { InvoiceSheet } from "@/components/site/InvoiceSheet";
import { ResultDashboard } from "@/components/verify/ResultDashboard";
import { useLang, type Bilingual } from "@/lib/i18n";
import { modifiedInvoice, originalInvoice, SAMPLE_REFERENCE } from "@/lib/wethaq/demo-data";
import {
  ACCEPTED_EXTENSIONS,
  validateFile,
  VerificationError,
  verifyByReference,
  verifySample,
  verifyUploadedFile,
} from "@/lib/wethaq/service";
import { getIssuedRecords } from "@/lib/wethaq/store";
import type { VerificationRecord, VerificationResult } from "@/lib/wethaq/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Verify a Document – WETHAQ" },
      { name: "description", content: "Upload an invoice, scan its QR code or enter a verification reference to check authenticity and spot modified payment details." },
      { property: "og:title", content: "Verify Before You Trust – WETHAQ" },
      { property: "og:description", content: "Check a digital invoice's source, integrity and risk indicators in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

const copy = {
  en: {
    eyebrow: "Document verification",
    title: "Verify Before You Trust.",
    desc: "Upload your digital document or scan its QR code to check its authenticity and identify possible risks.",
    drop: "Drag and drop your document here",
    formats: "Supported formats: PDF, PNG, JPG, JPEG · up to 10 MB",
    pdf: "Upload PDF",
    image: "Upload image",
    remove: "Remove file",
    or: "or",
    refLabel: "Verification reference",
    refPlaceholder: "e.g. WTQ-7F3K-0148",
    scan: "Scan QR code",
    consent: "I agree that WETHAQ may process this document to verify it. Documents are not shared publicly.",
    consentNeeded: "Please agree to document processing before verifying an uploaded file.",
    nothing: "Upload a document or enter a verification reference first.",
    verify: "Verify Document",
    demoTitle: "Demonstration scenario: modified business invoice",
    demoDesc: "Al Noor Trading issued INV-2026-0148 through WETHAQ. A copy with different bank details was later emailed to the customer. Verify each copy to see the difference.",
    original: "Original invoice",
    originalSub: "As issued and signed by the business",
    modified: "Modified copy",
    modifiedSub: "Payment account and email changed",
    verifyCopy: "Verify this copy",
    compare: "Compare side by side",
    hideCompare: "Hide comparison",
    steps: ["Reading document (OCR)", "Checking digital signature", "Comparing with verification record", "AI risk analysis", "Preparing explanation"],
    analysing: "Analysing document…",
    again: "Verify another document",
    errorTitle: "Verification couldn't start",
    qrTitle: "Scan QR code",
    qrDesc: "Camera scanning will be connected with the live platform. In this demo, choose a QR code to simulate scanning it.",
    qrSample: "QR on sample invoice INV-2026-0148",
    qrIssued: "QR on your issued invoice",
    simulate: "Simulate scan",
    refHint: "Try WTQ-7F3K-0148, or a reference from an invoice you issue in the Business Portal.",
  },
  ar: {
    eyebrow: "التحقق من المستندات",
    title: "تحقق قبل أن تثق.",
    desc: "ارفع مستندك الرقمي أو امسح رمز QR الخاص به للتحقق من أصالته وتحديد المخاطر المحتملة.",
    drop: "اسحب المستند وأفلته هنا",
    formats: "الصيغ المدعومة: PDF وPNG وJPG وJPEG · حتى 10 ميغابايت",
    pdf: "رفع ملف PDF",
    image: "رفع صورة",
    remove: "إزالة الملف",
    or: "أو",
    refLabel: "مرجع التحقق",
    refPlaceholder: "مثال: WTQ-7F3K-0148",
    scan: "مسح رمز QR",
    consent: "أوافق على أن يعالج وِثاق هذا المستند للتحقق منه. لا تتم مشاركة المستندات بشكل علني.",
    consentNeeded: "يرجى الموافقة على معالجة المستند قبل التحقق من ملف مرفوع.",
    nothing: "ارفع مستنداً أو أدخل مرجع التحقق أولاً.",
    verify: "تحقق من المستند",
    demoTitle: "سيناريو توضيحي: فاتورة منشأة معدّلة",
    demoDesc: "أصدرت شركة النور للتجارة الفاتورة INV-2026-0148 عبر وِثاق. لاحقاً أُرسلت للعميل نسخة ببيانات بنكية مختلفة. تحقق من كل نسخة لترى الفرق.",
    original: "الفاتورة الأصلية",
    originalSub: "كما أصدرتها المنشأة ووقّعتها",
    modified: "النسخة المعدّلة",
    modifiedSub: "تم تغيير حساب الدفع والبريد",
    verifyCopy: "تحقق من هذه النسخة",
    compare: "قارن جنباً إلى جنب",
    hideCompare: "إخفاء المقارنة",
    steps: ["قراءة المستند (OCR)", "فحص التوقيع الرقمي", "المقارنة مع سجل التحقق", "تحليل المخاطر بالذكاء الاصطناعي", "إعداد الشرح"],
    analysing: "جارٍ تحليل المستند…",
    again: "تحقق من مستند آخر",
    errorTitle: "تعذّر بدء التحقق",
    qrTitle: "مسح رمز QR",
    qrDesc: "سيتم ربط المسح بالكاميرا مع المنصة الفعلية. في هذا العرض، اختر رمز QR لمحاكاة مسحه.",
    qrSample: "رمز QR على الفاتورة النموذجية INV-2026-0148",
    qrIssued: "رمز QR على فاتورة أصدرتها",
    simulate: "محاكاة المسح",
    refHint: "جرّب WTQ-7F3K-0148، أو مرجعاً من فاتورة تصدرها في بوابة المنشآت.",
  },
};

type Phase =
  | { kind: "idle" }
  | { kind: "loading"; step: number }
  | { kind: "result"; result: VerificationResult }
  | { kind: "error"; message: Bilingual };

function VerifyPage() {
  const { ref } = Route.useSearch();
  const { lang } = useLang();
  const t = copy[lang];
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [consent, setConsent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [compare, setCompare] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [issued, setIssued] = useState<VerificationRecord[]>([]);
  const pdfInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const run = useCallback(async (task: () => Promise<VerificationResult>) => {
    setPhase({ kind: "loading", step: 0 });
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    const timer = setInterval(() => {
      setPhase((p) => (p.kind === "loading" ? { kind: "loading", step: Math.min(p.step + 1, 4) } : p));
    }, 500);
    try {
      const result = await task();
      setPhase({ kind: "result", result });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof VerificationError ? e.bilingual : { en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. يرجى المحاولة مرة أخرى." },
      });
    } finally {
      clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    setIssued(getIssuedRecords().slice(0, 3));
  }, [qrOpen]);

  // Arriving from a QR code link: /verify?ref=WTQ-...
  useEffect(() => {
    if (ref) {
      setReference(ref);
      void run(() => verifyByReference(ref, "qr"));
    }
  }, [ref, run]);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    const problem = validateFile(f);
    if (problem) {
      setFile(null);
      setPhase({ kind: "error", message: problem });
      return;
    }
    setPhase({ kind: "idle" });
    setFile(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const onVerify = () => {
    if (file) {
      if (!consent) return setPhase({ kind: "error", message: { en: copy.en.consentNeeded, ar: copy.ar.consentNeeded } });
      return void run(() => verifyUploadedFile(file));
    }
    if (reference.trim()) return void run(() => verifyByReference(reference));
    setPhase({ kind: "error", message: { en: copy.en.nothing, ar: copy.ar.nothing } });
  };

  const reset = () => {
    setPhase({ kind: "idle" });
    setFile(null);
    setReference("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loading = phase.kind === "loading";

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />

      <section className="bg-surface-gray py-12 md:py-16">
        <div className="container-page grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Verification interface */}
          <div className="rounded-3xl border bg-card p-5 shadow-card md:p-7">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex flex-col items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors",
                dragging ? "border-primary bg-surface-blue" : "border-input bg-surface-gray",
              )}
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileUp className="size-6" />
              </div>
              <p className="mt-4 font-semibold text-navy">{t.drop}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.formats}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => pdfInput.current?.click()} disabled={loading}>
                  <FileText /> {t.pdf}
                </Button>
                <Button variant="outline" onClick={() => imageInput.current?.click()} disabled={loading}>
                  <FileImage /> {t.image}
                </Button>
              </div>
              <input ref={pdfInput} type="file" accept=".pdf,application/pdf" className="sr-only" aria-label={t.pdf} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
              <input ref={imageInput} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="sr-only" aria-label={t.image} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
              {file && (
                <div className="mt-5 flex w-full max-w-sm items-center gap-3 rounded-xl border bg-card px-3 py-2 text-start">
                  <FileText className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} aria-label={t.remove}>
                    <X />
                  </Button>
                </div>
              )}
              <p className="mt-3 text-[11px] text-muted-foreground">{ACCEPTED_EXTENSIONS.join(" · ")}</p>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> {t.or} <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref">{t.refLabel}</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="ref"
                  dir="ltr"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onVerify()}
                  placeholder={t.refPlaceholder}
                  className="h-11 font-mono uppercase"
                  disabled={loading || !!file}
                />
                <Button variant="soft" className="h-11" onClick={() => setQrOpen(true)} disabled={loading}>
                  <QrCode /> {t.scan}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t.refHint}</p>
            </div>

            {file && (
              <label className="mt-5 flex items-start gap-3 rounded-xl bg-surface-blue p-3 text-sm text-navy">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
                {t.consent}
              </label>
            )}

            <Button size="xl" className="mt-6 w-full" onClick={onVerify} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <ScanSearch />}
              {t.verify}
            </Button>
          </div>

          {/* Demonstration scenario */}
          <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-card md:p-7">
            <Badge variant="caution" className="self-start">
              {lang === "ar" ? "عرض توضيحي · بيانات محاكاة" : "Demonstration · simulated data"}
            </Badge>
            <h2 className="text-xl font-bold">{t.demoTitle}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.demoDesc}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <SampleCard tone="verified" icon={<ShieldCheck />} title={t.original} sub={t.originalSub} action={t.verifyCopy} disabled={loading} onClick={() => run(() => verifySample("original"))} />
              <SampleCard tone="warning" icon={<ShieldAlert />} title={t.modified} sub={t.modifiedSub} action={t.verifyCopy} disabled={loading} onClick={() => run(() => verifySample("modified"))} />
            </div>
            <Button variant="ghost" className="self-start text-primary" onClick={() => setCompare((c) => !c)}>
              <ArrowDown className={cn("transition-transform", compare && "rotate-180")} />
              {compare ? t.hideCompare : t.compare}
            </Button>
          </div>
        </div>

        {compare && (
          <div className="container-page mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-verified"><CheckCircle2 className="size-4" /> {t.original}</p>
              <InvoiceSheet doc={originalInvoice} reference={SAMPLE_REFERENCE} />
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning"><ShieldAlert className="size-4" /> {t.modified}</p>
              <InvoiceSheet doc={modifiedInvoice} reference={SAMPLE_REFERENCE} highlight={["payment", "email"]} />
            </div>
          </div>
        )}
      </section>

      <section ref={resultRef} className="scroll-mt-20 py-12 md:py-16">
        <div className="container-page max-w-5xl">
          {phase.kind === "loading" && (
            <div className="mx-auto max-w-lg rounded-3xl border bg-card p-8 text-center shadow-card" role="status">
              <Loader2 className="mx-auto size-10 animate-spin text-primary" />
              <h2 className="mt-4 text-xl font-bold">{t.analysing}</h2>
              <Progress value={((phase.step + 1) / 5) * 100} className="mt-5" />
              <ul className="mt-5 space-y-2 text-start text-sm">
                {t.steps.map((s, i) => (
                  <li key={s} className={cn("flex items-center gap-2", i <= phase.step ? "text-navy" : "text-muted-foreground")}>
                    {i < phase.step ? <CheckCircle2 className="size-4 text-verified" /> : i === phase.step ? <Loader2 className="size-4 animate-spin text-primary" /> : <span className="size-4 rounded-full border" />}
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {phase.kind === "error" && (
            <div role="alert" className="mx-auto flex max-w-lg items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-5">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
              <div>
                <p className="font-semibold text-navy">{t.errorTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{phase.message[lang]}</p>
              </div>
            </div>
          )}
          {phase.kind === "result" && (
            <>
              <ResultDashboard result={phase.result} />
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg" onClick={reset}>
                  <RotateCcw /> {t.again}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">{t.qrTitle}</DialogTitle>
            <DialogDescription>{t.qrDesc}</DialogDescription>
          </DialogHeader>
          <div className="relative mx-auto flex aspect-square w-full max-w-[15rem] items-center justify-center overflow-hidden rounded-2xl bg-navy">
            <Camera className="size-10 text-navy-muted" />
            <span className="animate-scan absolute inset-x-6 h-0.5 bg-verified shadow-glow" />
            <span className="absolute inset-6 rounded-xl border-2 border-navy-foreground/30" />
          </div>
          <DemoNotice>{lang === "ar" ? "لا يتم استخدام الكاميرا في هذا العرض." : "The camera is not used in this demo."}</DemoNotice>
          <div className="space-y-2">
            {[{ ref: SAMPLE_REFERENCE, label: t.qrSample }, ...issued.map((r) => ({ ref: r.reference, label: `${t.qrIssued} ${r.document.invoiceNumber}` }))].map((q) => (
              <Button
                key={q.ref}
                variant="outline"
                className="h-auto w-full justify-between py-3"
                onClick={() => {
                  setQrOpen(false);
                  setReference(q.ref);
                  setFile(null);
                  void run(() => verifyByReference(q.ref, "qr"));
                }}
              >
                <span className="flex flex-col items-start text-start">
                  <span className="text-sm">{q.label}</span>
                  <span dir="ltr" className="font-mono text-xs text-muted-foreground">{q.ref}</span>
                </span>
                <span className="text-primary">{t.simulate}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SampleCard({ tone, icon, title, sub, action, onClick, disabled }: { tone: "verified" | "warning"; icon: React.ReactNode; title: string; sub: string; action: string; onClick: () => void; disabled: boolean }) {
  return (
    <div className={cn("flex flex-col rounded-2xl border p-4", tone === "verified" ? "border-verified/25 bg-verified/5" : "border-warning/25 bg-warning/5")}>
      <div className={cn("flex items-center gap-2 font-semibold [&_svg]:size-5", tone === "verified" ? "text-verified" : "text-warning")}>
        {icon} {title}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">INV-2026-0148 · {sub}</p>
      <Button variant={tone === "verified" ? "verified" : "destructive"} size="sm" className="mt-4" onClick={onClick} disabled={disabled}>
        {action}
      </Button>
    </div>
  );
}
