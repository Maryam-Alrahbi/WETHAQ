import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  Globe2,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useCopy } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About WETHAQ | Digital Trust" },
      {
        name: "description",
        content:
          "Learn about WETHAQ's mission to strengthen digital trust for individuals and businesses.",
      },
    ],
  }),
  component: AboutPage,
});

const copy = {
  en: {
    eyebrow: "About WETHAQ",
    title: "Building confidence in every digital transaction.",
    intro:
      "WETHAQ is a digital trust and verification platform designed to help individuals and businesses assess digital documents, identify suspicious changes, and make more informed decisions before acting on invoices and payment requests.",

    missionTitle: "Our mission",
    mission:
      "To strengthen digital trust by helping individuals and businesses verify digital documents, detect potential fraud, and make safer digital transactions.",

    visionTitle: "Our vision",
    vision:
      "To become a trusted digital verification platform that contributes to a safer digital ecosystem in Oman and beyond.",

    principlesTitle: "What guides us",

    principles: [
      [
        "Trust through clarity",
        "Make verification outcomes understandable and useful.",
      ],
      [
        "Security-minded design",
        "Put privacy, responsible data handling, and user awareness at the centre of the experience.",
      ],
      [
        "For people and businesses",
        "Support individuals as well as organisations that send and receive digital documents.",
      ],
    ],

    omanTitle: "Aligned with Oman's digital future",
    oman:
      "WETHAQ's purpose supports the direction of Oman Vision 2040 by contributing to a trusted digital environment, encouraging responsible use of technology, and supporting digital transformation across society and business. This is an expression of alignment with national priorities, not a claim of government affiliation, approval, or endorsement.",

    note:
      "WETHAQ is currently a demonstration prototype. Some workflows use sample data and simulated verification; they should not be relied on for real financial or legal decisions.",

    explore: "Explore how it works",
    contact: "Contact WETHAQ",
  },

  ar: {
    eyebrow: "عن وِثاق",
    title: "نعزز الثقة في كل معاملة رقمية.",
    intro:
      "وِثاق منصة للثقة والتحقق الرقمي، صُممت لمساعدة الأفراد والمنشآت على تقييم المستندات الرقمية، واكتشاف التغييرات المشبوهة، واتخاذ قرارات أكثر وعياً قبل التعامل مع الفواتير وطلبات الدفع.",

    missionTitle: "رسالتنا",
    mission:
      "تعزيز الثقة الرقمية من خلال مساعدة الأفراد والمنشآت على التحقق من المستندات الرقمية، واكتشاف الاحتيال المحتمل، وإجراء معاملات رقمية أكثر أماناً.",

    visionTitle: "رؤيتنا",
    vision:
      "أن تصبح وِثاق منصة موثوقة للتحقق الرقمي تسهم في بناء منظومة رقمية أكثر أماناً في عُمان وخارجها.",

    principlesTitle: "المبادئ التي توجهنا",

    principles: [
      ["الثقة عبر الوضوح", "عرض نتائج التحقق بطريقة واضحة ومفيدة."],
      [
        "التصميم مع مراعاة الأمن",
        "وضع الخصوصية والتعامل المسؤول مع البيانات ووعي المستخدم في صميم التجربة.",
      ],
      [
        "للأفراد والمنشآت",
        "دعم الأفراد والمؤسسات التي ترسل المستندات الرقمية أو تستلمها.",
      ],
    ],

    omanTitle: "انسجام مع المستقبل الرقمي لعُمان",
    oman:
      "تدعم غاية وِثاق التوجه العام لرؤية عُمان 2040 من خلال الإسهام في إيجاد بيئة رقمية موثوقة، وتشجيع الاستخدام المسؤول للتقنية، ودعم التحول الرقمي في المجتمع وقطاع الأعمال. ويعبّر ذلك عن انسجام مع الأولويات الوطنية، ولا يعني وجود ارتباط أو اعتماد أو تأييد حكومي.",

    note:
      "وِثاق حالياً نموذج أولي تجريبي. تعتمد بعض الوظائف على بيانات نموذجية وعمليات تحقق محاكاة، ولا ينبغي الاعتماد عليها لاتخاذ قرارات مالية أو قانونية فعلية.",

    explore: "تعرّف على آلية العمل",
    contact: "تواصل مع وِثاق",
  },
};

function AboutPage() {
  const t = useCopy(copy);

  return (
    <div className="bg-background">
      <section className="bg-hero py-16 text-navy-foreground md:py-24">
        <div className="container-page max-w-5xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-verified">
            {t.eyebrow}
          </p>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-navy-foreground md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-muted">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-6 py-14 md:grid-cols-2 md:py-20">
        <article className="rounded-2xl border bg-card p-7 shadow-sm">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-surface-blue text-primary">
            <Target />
          </div>

          <h2 className="text-2xl font-bold">{t.missionTitle}</h2>

          <p className="mt-4 leading-8 text-muted-foreground">
            {t.mission}
          </p>
        </article>

        <article className="rounded-2xl border bg-card p-7 shadow-sm">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-surface-blue text-primary">
            <Compass />
          </div>

          <h2 className="text-2xl font-bold">{t.visionTitle}</h2>

          <p className="mt-4 leading-8 text-muted-foreground">
            {t.vision}
          </p>
        </article>
      </section>

      <section className="bg-surface-gray py-14 md:py-20">
        <div className="container-page">
          <h2 className="mb-8 text-3xl font-bold">
            {t.principlesTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {t.principles.map(([title, description], index) => (
              <article
                key={title}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-surface-blue text-primary">
                  {index === 0 ? (
                    <ShieldCheck />
                  ) : index === 1 ? (
                    <Target />
                  ) : (
                    <Globe2 />
                  )}
                </div>

                <h3 className="text-lg font-semibold">{title}</h3>

                <p className="mt-2 leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="rounded-2xl bg-surface-blue p-7 md:p-10">
          <h2 className="text-2xl font-bold">{t.omanTitle}</h2>

          <p className="mt-4 max-w-4xl leading-8 text-muted-foreground">
            {t.oman}
          </p>
        </div>

        <p className="mt-6 rounded-xl border border-caution/30 bg-caution/5 p-4 text-sm leading-7 text-muted-foreground">
          {t.note}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/how-it-works">
              {t.explore}
              <ArrowRight className="ms-2 size-4" />
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/contact">{t.contact}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}