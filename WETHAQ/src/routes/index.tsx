import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  Calculator,
  FilePen,
  FileSignature,
  Fingerprint,
  Landmark,
  MessageSquareText,
  QrCode,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  UserX,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/site/HeroVisual";
import { IconTile, SectionHeader } from "@/components/site/common";
import { useCopy } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WETHAQ – Trust Every Digital Document" },
      {
        name: "description",
        content: "Verify digital invoices and payment requests with AI and digital signatures. Detect modified payment details and impersonation before you pay.",
      },
      { property: "og:title", content: "WETHAQ – Trust Every Digital Document" },
      { property: "og:description", content: "AI-powered digital trust and verification for invoices and payment requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const copy = {
  en: {
    badge: "AI-powered digital trust platform",
    title: "Trust Every Digital Document.",
    tagline: "وِثاق – لأن الثقة أساس كل معاملة رقمية.",
    desc: "WETHAQ uses Artificial Intelligence and digital verification technologies to help businesses and individuals verify document authenticity, detect suspicious modifications, and protect digital transactions.",
    verify: "Verify a Document",
    explore: "Explore How It Works",
    stats: [
      ["Signed", "Every issued invoice"],
      ["Explained", "Risks in plain language"],
      ["Private", "Only what's needed is shown"],
    ],
    problem: {
      eyebrow: "The problem",
      title: "Digital Transactions Need Digital Trust.",
      desc: "Businesses increasingly depend on electronic documents — yet confirming that an invoice is genuine, unchanged and really from its sender has become harder, not easier.",
      cards: [
        ["Document Manipulation", "Digital invoices may be modified after being issued."],
        ["Payment Detail Changes", "Bank account information or payment details may be changed without the recipient noticing."],
        ["Business Impersonation", "Fraudsters may pretend to represent legitimate businesses or suppliers."],
        ["Difficult Verification", "Individuals and small businesses may not have simple tools to confirm whether a document is authentic."],
      ],
    },
    solution: {
      eyebrow: "Our solution",
      title: "One Platform. Four Layers of Digital Trust.",
      cards: [
        ["VERIFY", "Verify the document's source and integrity using digital verification methods."],
        ["DETECT", "Use AI to analyze documents and identify suspicious inconsistencies or possible modifications."],
        ["EXPLAIN", "Explain detected risks in clear, understandable language instead of simply displaying a warning."],
        ["VERIFIED IDENTITY", "Businesses create verified profiles with official information, contact channels, registered domains and approved payment details."],
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "From issue to verification in four steps",
      steps: [
        "A business issues a digital invoice through WETHAQ.",
        "The invoice is connected to a digital verification method and QR code.",
        "The recipient scans the QR code or uploads the document.",
        "WETHAQ checks the source and integrity, analyzes suspicious indicators, and displays the result.",
      ],
      cta: "See How It Works",
    },
    audience: {
      eyebrow: "Who it's for",
      title: "Built for everyone who sends or receives invoices",
      desc: "Designed for businesses in Oman and ready for international markets.",
      items: [
        "Small and Medium Enterprises (SMEs)",
        "Online stores and e-commerce businesses",
        "Suppliers and service providers",
        "Accountants and payment departments",
        "Individuals receiving digital invoices and payment requests",
      ],
    },
    final: {
      title: "Make Every Digital Transaction More Trustworthy.",
      desc: "Start building a safer digital environment with WETHAQ.",
      start: "Get Started",
      verify: "Verify a Document",
    },
  },
  ar: {
    badge: "منصة ثقة رقمية مدعومة بالذكاء الاصطناعي",
    title: "تحقق من مستنداتك الرقمية، واتخذ قراراتك بثقة.",
    tagline: "Trust Every Digital Document.",
    desc: "يستخدم وِثاق الذكاء الاصطناعي وتقنيات التحقق الرقمي لمساعدة المنشآت والأفراد على التحقق من أصالة المستندات، واكتشاف التعديلات المريبة، وحماية المعاملات الرقمية.",
    verify: "تحقق من مستند",
    explore: "تعرّف على آلية العمل",
    stats: [
      ["موقّعة", "كل فاتورة صادرة"],
      ["مشروحة", "المخاطر بلغة واضحة"],
      ["خاصة", "نعرض فقط ما يلزم"],
    ],
    problem: {
      eyebrow: "المشكلة",
      title: "المعاملات الرقمية تحتاج إلى ثقة رقمية.",
      desc: "تعتمد المنشآت بشكل متزايد على المستندات الإلكترونية — ومع ذلك أصبح التأكد من أن الفاتورة أصلية ولم تُعدّل وصادرة فعلاً من مرسلها أصعب من قبل.",
      cards: [
        ["التلاعب بالمستندات", "قد يتم تعديل الفواتير الرقمية بعد إصدارها."],
        ["تغيير بيانات الدفع", "قد يتم تغيير معلومات الحساب البنكي أو بيانات الدفع دون أن يلاحظ المستلم."],
        ["انتحال صفة المنشآت", "قد يدّعي المحتالون أنهم يمثلون منشآت أو موردين حقيقيين."],
        ["صعوبة التحقق", "قد لا تتوفر للأفراد والمنشآت الصغيرة أدوات بسيطة للتأكد من أصالة المستند."],
      ],
    },
    solution: {
      eyebrow: "الحل",
      title: "منصة واحدة. أربع طبقات من الثقة الرقمية.",
      cards: [
        ["تحقّق", "التحقق من مصدر المستند وسلامته باستخدام أساليب التحقق الرقمي."],
        ["اكتشف", "استخدام الذكاء الاصطناعي لتحليل المستندات وتحديد التناقضات أو التعديلات المحتملة."],
        ["اشرح", "شرح المخاطر المكتشفة بلغة واضحة ومفهومة بدلاً من مجرد عرض تحذير."],
        ["هوية موثّقة", "تنشئ المنشآت ملفات موثّقة تتضمن معلوماتها الرسمية وقنوات التواصل والنطاقات المسجّلة وبيانات الدفع المعتمدة."],
      ],
    },
    how: {
      eyebrow: "آلية العمل",
      title: "من الإصدار إلى التحقق في أربع خطوات",
      steps: [
        "تصدر المنشأة فاتورة رقمية عبر وِثاق.",
        "ترتبط الفاتورة بوسيلة تحقق رقمية ورمز QR.",
        "يمسح المستلم رمز QR أو يرفع المستند.",
        "يتحقق وِثاق من المصدر والسلامة، ويحلل المؤشرات المريبة، ويعرض النتيجة.",
      ],
      cta: "شاهد كيف يعمل",
    },
    audience: {
      eyebrow: "لمن صُمّم",
      title: "لكل من يرسل الفواتير أو يستلمها",
      desc: "مصمّم للمنشآت في عُمان وجاهز للأسواق الدولية.",
      items: [
        "المنشآت الصغيرة والمتوسطة",
        "المتاجر الإلكترونية وأعمال التجارة الإلكترونية",
        "الموردون ومقدمو الخدمات",
        "المحاسبون وأقسام المدفوعات",
        "الأفراد الذين يستلمون فواتير وطلبات دفع رقمية",
      ],
    },
    final: {
      title: "اجعل كل معاملة رقمية أكثر موثوقية.",
      desc: "ابدأ ببناء بيئة رقمية أكثر أماناً مع وِثاق.",
      start: "ابدأ الآن",
      verify: "تحقق من مستند",
    },
  },
};

const problemIcons = [FilePen, Landmark, UserX, SearchX];
const solutionIcons = [Fingerprint, ScanSearch, MessageSquareText, BadgeCheck];
const stepIcons = [FileSignature, QrCode, ScanSearch, ShieldCheck];
const audienceIcons = [Building2, ShoppingBag, Truck, Calculator, User];

function Home() {
  const t = useCopy(copy);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="grid-pattern absolute inset-0" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-xs font-semibold text-navy-muted">
              <BrainCircuit className="size-3.5" /> {t.badge}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] text-navy-foreground md:text-6xl rtl:leading-[1.3]">
              {t.title}
            </h1>
            <p className="mt-4 text-lg font-medium text-verified">{t.tagline}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-muted">{t.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/verify" search={{ ref: undefined }}>
                  <ScanSearch /> {t.verify}
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/how-it-works">
                  {t.explore} <ArrowRight className="flip-rtl" />
                </Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-navy-foreground/10 pt-6">
              {t.stats.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-lg font-bold text-navy-foreground">{k}</dt>
                  <dd className="text-xs text-navy-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader eyebrow={t.problem.eyebrow} title={t.problem.title} description={t.problem.desc} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.problem.cards.map(([title, body], i) => {
              const Icon = problemIcons[i];
              return (
                <article key={title} className="card-hover rounded-2xl border bg-card p-6 shadow-card">
                  <IconTile tone="warning"><Icon /></IconTile>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-surface-blue py-20 md:py-28">
        <div className="container-page">
          <SectionHeader eyebrow={t.solution.eyebrow} title={t.solution.title} />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {t.solution.cards.map(([title, body], i) => {
              const Icon = solutionIcons[i];
              return (
                <article key={title} className="card-hover flex gap-5 rounded-2xl border bg-card p-6 shadow-card md:p-8">
                  <IconTile tone={i === 3 ? "verified" : "primary"} className="size-12"><Icon /></IconTile>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">0{i + 1}</p>
                    <h3 className="mt-1 text-xl font-bold tracking-wide rtl:tracking-normal">{title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How preview */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeader eyebrow={t.how.eyebrow} title={t.how.title} />
          <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
            <div className="absolute inset-x-[12%] top-6 hidden h-px bg-border md:block" aria-hidden="true" />
            {t.how.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={step} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-navy text-navy-foreground shadow-glow">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-primary">0{i + 1}</p>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-foreground">{step}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/how-it-works">
                {t.how.cta} <ArrowRight className="flip-rtl" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-surface-gray py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <SectionHeader align="start" eyebrow={t.audience.eyebrow} title={t.audience.title} description={t.audience.desc} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.audience.items.map((item, i) => {
              const Icon = audienceIcons[i];
              return (
                <li key={item} className={`flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card ${i === 4 ? "sm:col-span-2" : ""}`}>
                  <IconTile tone={i === 4 ? "verified" : "primary"}><Icon /></IconTile>
                  <span className="font-medium text-navy">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-hero px-6 py-14 text-center shadow-elevated md:px-16">
            <div className="grid-pattern absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold text-navy-foreground md:text-4xl">{t.final.title}</h2>
              <p className="mt-4 text-lg text-navy-muted">{t.final.desc}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/login" search={{ mode: "signup" }}>{t.final.start}</Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/verify" search={{ ref: undefined }}>{t.final.verify}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
