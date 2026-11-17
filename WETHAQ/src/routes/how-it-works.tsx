import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BrainCircuit,
  Building2,
  CircleHelp,
  Eye,
  FileCheck2,
  FileSignature,
  FileText,
  Fingerprint,
  KeyRound,
  Lock,
  ScanLine,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Database,
  ServerCog,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconTile, PageHero, SectionHeader } from "@/components/site/common";
import { useCopy } from "@/lib/i18n";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How WETHAQ Works – From Signed Invoice to Verified Result" },
      { name: "description", content: "Business registration, signed invoices with QR codes, recipient verification, AI risk analysis and clear results — step by step." },
      { property: "og:title", content: "How WETHAQ Works" },
      { property: "og:description", content: "See how WETHAQ combines digital signatures, QR codes and AI to verify invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const copy = {
  en: {
    eyebrow: "How it works",
    title: "A clear path from issued invoice to trusted payment.",
    desc: "WETHAQ links every document to a verified business and a digital signature, then uses AI to explain anything that doesn't add up.",
    step: "Step",
    steps: [
      {
        title: "Business Registration",
        body: "A business creates an account and submits its basic business information. WETHAQ reviews it through an appropriate verification process before marking the business as verified.",
        list: ["Business name", "Business registration information", "Official email", "Official phone number", "Registered website or domain, if available", "Approved payment details"],
      },
      {
        title: "Document Issuing",
        body: "The registered business creates or uploads an invoice through WETHAQ. The system connects it to a digital verification mechanism — a digital signature and a QR code.",
        list: ["Invoice number", "Issue date", "Business information", "Customer information", "Products or services", "Total amount", "Payment information"],
      },
      {
        title: "Document Verification",
        body: "The recipient checks the document in seconds. The platform confirms whether it matches the original verified version.",
        list: ["Scan the QR code", "Upload the invoice", "Enter a verification reference, if provided"],
      },
      {
        title: "AI Analysis",
        body: "AI reads the document and compares it with the original record and the verified business profile, looking for suspicious indicators.",
        list: ["Changes in bank account details", "Inconsistent business information", "Unexpected modifications", "Suspicious links or contact information", "Differences from the verified business profile"],
      },
      {
        title: "Verification Result",
        body: "The result is displayed clearly, with an explanation and recommended next steps.",
        list: [],
      },
    ],
    results: [
      ["VERIFIED", "The document matches the verified version and its source information."],
      ["WARNING", "The system detected unusual information that requires additional review."],
      ["NOT VERIFIED", "The document could not be matched with a valid verification record."],
    ],
    inconclusive: "A “Not Verified” result is inconclusive. It does not mean the document is fraudulent — only that WETHAQ cannot confirm it. Confirm it independently with the sender.",
    ai: {
      eyebrow: "The role of AI",
      title: "AI that assists verification — not replaces it",
      desc: "WETHAQ combines several technologies. Each one does a different job.",
      items: [
        ["OCR", "Optical Character Recognition extracts text, amounts and account numbers from PDFs and images."],
        ["AI document analysis", "Detects inconsistencies, compares content with registered business details and spots unusual payment information."],
        ["Risk classification", "Each finding is classified by severity and explained in simple language."],
        ["Digital signatures", "Confirm that a document has not changed since it was signed and that it is tied to a specific signing key."],
        ["Secure verification records", "The original fingerprint and signature are stored so any copy can be compared against them."],
        ["QR codes", "Make verification accessible to anyone with a phone — no account needed."],
      ],
      note: "A digital signature proves a document hasn't changed and which key signed it. It does not, on its own, prove the business is legitimate — that's why WETHAQ also verifies business identity and manages signing keys securely. AI results are risk indicators, not final legal or financial decisions.",
    },
    security: {
      eyebrow: "Security & privacy",
      title: "Designed for sensitive financial documents",
      items: [
        ["Secure authentication", "Protected sign-in for every account."],
        ["Encrypted communication", "All traffic is encrypted in transit."],
        ["Access controls", "Only authorised users can open private business documents."],
        ["Protected uploads", "Uploaded documents are processed only with your consent."],
        ["Secure records", "Verification records are stored securely and cannot be edited."],
        ["Minimal public data", "Public QR checks show only what's needed — never full customer or payment details."],
      ],
      policy: "Read our privacy approach",
    },
    cta: "Try the verification demo",
  },
  ar: {
    eyebrow: "آلية العمل",
    title: "مسار واضح من إصدار الفاتورة إلى دفع موثوق.",
    desc: "يربط وِثاق كل مستند بمنشأة موثّقة وتوقيع رقمي، ثم يستخدم الذكاء الاصطناعي لشرح أي شيء غير منطقي.",
    step: "الخطوة",
    steps: [
      {
        title: "تسجيل المنشأة",
        body: "تنشئ المنشأة حساباً وتقدّم معلوماتها الأساسية. يراجعها وِثاق عبر إجراء تحقق مناسب قبل اعتماد المنشأة كموثّقة.",
        list: ["اسم المنشأة", "بيانات السجل التجاري", "البريد الإلكتروني الرسمي", "رقم الهاتف الرسمي", "الموقع أو النطاق المسجّل إن وجد", "بيانات الدفع المعتمدة"],
      },
      {
        title: "إصدار المستند",
        body: "تنشئ المنشأة المسجّلة فاتورة أو ترفعها عبر وِثاق. يربطها النظام بآلية تحقق رقمية — توقيع رقمي ورمز QR.",
        list: ["رقم الفاتورة", "تاريخ الإصدار", "معلومات المنشأة", "معلومات العميل", "المنتجات أو الخدمات", "المبلغ الإجمالي", "معلومات الدفع"],
      },
      {
        title: "التحقق من المستند",
        body: "يتحقق المستلم من المستند خلال ثوانٍ. تتأكد المنصة من مطابقته للنسخة الأصلية الموثّقة.",
        list: ["مسح رمز QR", "رفع الفاتورة", "إدخال مرجع التحقق إن وُجد"],
      },
      {
        title: "التحليل بالذكاء الاصطناعي",
        body: "يقرأ الذكاء الاصطناعي المستند ويقارنه بالسجل الأصلي وملف المنشأة الموثّق بحثاً عن مؤشرات مريبة.",
        list: ["تغيير بيانات الحساب البنكي", "تناقض معلومات المنشأة", "تعديلات غير متوقعة", "روابط أو بيانات تواصل مريبة", "اختلافات عن ملف المنشأة الموثّق"],
      },
      {
        title: "نتيجة التحقق",
        body: "تُعرض النتيجة بوضوح مع شرح وخطوات موصى بها.",
        list: [],
      },
    ],
    results: [
      ["موثّق", "المستند مطابق للنسخة الموثّقة ولمعلومات مصدره."],
      ["تحذير", "اكتشف النظام معلومات غير اعتيادية تتطلب مراجعة إضافية."],
      ["غير موثّق", "تعذّرت مطابقة المستند مع سجل تحقق صالح."],
    ],
    inconclusive: "نتيجة «غير موثّق» غير حاسمة. لا تعني أن المستند احتيالي — بل أن وِثاق لا يستطيع تأكيده. تحقق منه بشكل مستقل مع المرسل.",
    ai: {
      eyebrow: "دور الذكاء الاصطناعي",
      title: "ذكاء اصطناعي يدعم التحقق — لا يحل محله",
      desc: "يجمع وِثاق بين عدة تقنيات، ولكل منها دور مختلف.",
      items: [
        ["التعرّف الضوئي (OCR)", "يستخرج النصوص والمبالغ وأرقام الحسابات من ملفات PDF والصور."],
        ["تحليل المستندات بالذكاء الاصطناعي", "يكتشف التناقضات، ويقارن المحتوى ببيانات المنشأة المسجّلة، ويرصد معلومات الدفع غير الاعتيادية."],
        ["تصنيف المخاطر", "تُصنّف كل نتيجة حسب الخطورة وتُشرح بلغة بسيطة."],
        ["التوقيعات الرقمية", "تؤكد أن المستند لم يتغير منذ توقيعه وأنه مرتبط بمفتاح توقيع محدد."],
        ["سجلات تحقق آمنة", "تُحفظ البصمة الأصلية والتوقيع لمقارنة أي نسخة بها."],
        ["رموز QR", "تجعل التحقق متاحاً لأي شخص يملك هاتفاً — دون الحاجة إلى حساب."],
      ],
      note: "يثبت التوقيع الرقمي أن المستند لم يتغير وأي مفتاح وقّعه، لكنه لا يثبت وحده أن المنشأة حقيقية — لذلك يتحقق وِثاق أيضاً من هوية المنشأة ويدير مفاتيح التوقيع بأمان. نتائج الذكاء الاصطناعي مؤشرات مخاطر وليست قرارات قانونية أو مالية نهائية.",
    },
    security: {
      eyebrow: "الأمان والخصوصية",
      title: "مصمّم للمستندات المالية الحساسة",
      items: [
        ["مصادقة آمنة", "تسجيل دخول محمي لكل حساب."],
        ["اتصال مشفّر", "جميع البيانات مشفّرة أثناء النقل."],
        ["صلاحيات الوصول", "فقط المستخدمون المخوّلون يمكنهم فتح مستندات المنشأة الخاصة."],
        ["حماية المرفوعات", "تُعالج المستندات المرفوعة فقط بموافقتك."],
        ["سجلات آمنة", "تُحفظ سجلات التحقق بأمان ولا يمكن تعديلها."],
        ["أقل قدر من البيانات العامة", "يعرض فحص QR العام ما يلزم فقط — دون تفاصيل العميل أو الدفع الكاملة."],
      ],
      policy: "اطّلع على نهجنا في الخصوصية",
    },
    cta: "جرّب العرض التوضيحي للتحقق",
  },
};

const stepIcons = [Building2, FileSignature, ScanLine, BrainCircuit, FileCheck2];
const resultStyles = [
  { tone: "verified" as const, icon: ShieldCheck },
  { tone: "warning" as const, icon: ShieldAlert },
  { tone: "caution" as const, icon: CircleHelp },
];
const aiIcons = [ScanSearch, BrainCircuit, ShieldAlert, Fingerprint, Database, ScanLine];
const secIcons = [KeyRound, Lock, UserCheck, FileText, ServerCog, Eye];

function HowItWorks() {
  const t = useCopy(copy);
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />

      <section className="py-20 md:py-24">
        <div className="container-page">
          <ol className="relative mx-auto max-w-4xl space-y-8">
            <div className="absolute bottom-10 start-[1.4rem] top-10 w-px bg-border md:start-[1.9rem]" aria-hidden="true" />
            {t.steps.map((s, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={s.title} className="relative flex gap-5 md:gap-8">
                  <div className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-glow md:size-15">
                    <Icon className="size-5 md:size-6" />
                  </div>
                  <div className="flex-1 rounded-2xl border bg-card p-6 shadow-card md:p-8">
                    <p className="text-xs font-bold text-primary">{t.step} {i + 1}</p>
                    <h2 className="mt-1 text-2xl font-bold">{s.title}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
                    {s.list.length > 0 && (
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {s.list.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-navy">
                            <CheckCircle2 className="size-4 shrink-0 text-verified" /> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {i === 4 && (
                      <>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {t.results.map(([label, body], r) => {
                            const st = resultStyles[r];
                            return (
                              <div key={label} className="rounded-xl border bg-surface-gray p-4">
                                <IconTile tone={st.tone} className="size-9"><st.icon /></IconTile>
                                <p className="mt-3 text-sm font-bold text-navy">{label}</p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-4 rounded-xl border border-caution/30 bg-caution/10 p-3 text-sm text-navy">{t.inconclusive}</p>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-surface-blue py-20 md:py-24">
        <div className="container-page">
          <SectionHeader eyebrow={t.ai.eyebrow} title={t.ai.title} description={t.ai.desc} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.ai.items.map(([title, body], i) => {
              const Icon = aiIcons[i];
              return (
                <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
                  <IconTile tone={i < 3 ? "primary" : "verified"}><Icon /></IconTile>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/20 bg-card p-5 text-sm leading-relaxed text-navy shadow-card">
            <KeyRound className="me-2 inline size-4 text-primary" />
            {t.ai.note}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-page">
          <SectionHeader eyebrow={t.security.eyebrow} title={t.security.title} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.security.items.map(([title, body], i) => {
              const Icon = secIcons[i];
              return (
                <div key={title} className="flex gap-4 rounded-2xl border bg-card p-5 shadow-card">
                  <IconTile tone="navy"><Icon /></IconTile>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/verify" search={{ ref: undefined }}>{t.cta}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/privacy">{t.security.policy}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
