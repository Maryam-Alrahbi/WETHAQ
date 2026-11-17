import { createFileRoute } from "@tanstack/react-router";

import {
  AlertTriangle,
  Database,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Mail,
} from "lucide-react";

import { useCopy } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Terms | WETHAQ" },
      {
        name: "description",
        content:
          "Read WETHAQ's prototype privacy notice and terms of use in English and Arabic.",
      },
    ],
  }),
  component: PrivacyPage,
});

const copy = {
  en: {
    eyebrow: "Legal information",
    title: "Privacy & Terms",
    updated: "Prototype notice · Last updated: 17 November 2026",

    intro:
      "This page explains how the current WETHAQ demonstration prototype works and the limits that apply when you use it. It is a product notice, not a substitute for legal advice or a final privacy policy for a production service.",

    statusTitle: "1. Prototype status and important limitations",
    status:
      "WETHAQ is currently a demonstration prototype for individuals and businesses. Some records and verification outcomes are sample or simulated. Real account authentication, server-side document verification, cryptographic signing, and secure business data storage are not connected in this prototype. Do not use it to make real payment, financial, legal, or compliance decisions, and do not enter confidential or sensitive information.",

    dataTitle: "2. Information handled by this prototype",
    dataIntro:
      "Depending on the features you try, the interface may handle the following categories:",

    data: [
      "Names and email addresses entered into the demonstration sign-in flow; the demo session stores a name, email address, and account type in your browser's local storage. Passwords are not stored by the demo session code.",

      "Business profile information and sample business details that you enter or change in the business area; these demo profile values are stored in your browser's local storage.",

      "Invoices you create in the demo and related verification/activity records; these demo records are stored in your browser's local storage.",

      "A document file you select for the upload demonstration. The current upload flow checks basic file details and displays a demo result; it does not send the file contents to a WETHAQ verification server or perform real OCR/signature verification.",

      "Language preference, which is saved in your browser's local storage.",
    ],

    storageTitle: "3. Local storage and your device",
    storage:
      "The prototype uses browser local storage to remember demo session details, language preference, and demo business/invoice/activity data on the device and browser where you use it. This is not a secure account database and does not synchronize your information across devices. Other people who can use the same browser profile or device may be able to access this locally stored demo information. Clearing browser site data may remove it.",

    contactTitle: "4. Contact form and email",
    contact:
      "The contact form currently prepares a message in your device's default email application addressed to w3thaq@gmail.com. The form does not submit the message to a WETHAQ server or store it on this website. Your email provider will handle the message if you choose to send it, under that provider's terms and privacy practices.",

    sharingTitle: "5. Sharing and third parties",
    sharing:
      "The current prototype does not provide a WETHAQ backend database for storing submitted demo invoices or account records. If the website is accessed online, the hosting and infrastructure providers may process limited technical information needed to deliver and protect the website, under their own terms. Do not assume that information entered into a public demonstration is confidential.",

    securityTitle: "6. Security",
    security:
      "We aim to design WETHAQ with digital trust and responsible data handling in mind. However, this prototype does not provide production-grade authentication, access controls, server-side storage protections, or a complete security assurance. Do not upload confidential documents or use real credentials. Use a unique password on other services and never reuse it in a demonstration.",

    termsTitle: "7. Terms of use",

    terms: [
      "Use the prototype lawfully and do not attempt to disrupt, probe, or gain unauthorized access to the website or other users' information.",

      "Use sample or non-sensitive information only. You are responsible for ensuring that you have permission to use any information or document you enter.",

      "Demonstration verification results are informational only. They are not proof of authenticity, a guarantee against fraud, financial advice, legal advice, or a substitute for checking payment details with the sender through a trusted channel.",

      "The prototype is provided for evaluation and demonstration purposes and may change, be interrupted, or be unavailable without notice.",
    ],

    rightsTitle: "8. Intellectual property",
    rights:
      "The WETHAQ name, branding, interface, and original content are presented as part of this demonstration. Do not copy, redistribute, or commercially use material in a way that infringes applicable rights.",

    changesTitle: "9. Changes to this notice",
    changes:
      "This notice may be updated as WETHAQ develops. The date at the top indicates the latest revision of this prototype notice. A production launch will require a more complete privacy policy and terms that reflect the actual services, data flows, retention periods, security controls, and applicable legal requirements.",

    contactUsTitle: "10. Questions",
    contactUs:
      "For questions about this notice or WETHAQ, contact:",

    disclaimer:
      "This is a prototype-stage notice drafted from the current application's demonstrated behaviour. It should be reviewed by a qualified legal professional in the relevant jurisdiction before production use.",
  },

  ar: {
    eyebrow: "معلومات قانونية",
    title: "الخصوصية والشروط",
    updated: "إشعار خاص بالنموذج الأولي · آخر تحديث: 17 نوفمبر 2026",

    intro:
      "توضح هذه الصفحة كيفية عمل النسخة التجريبية الحالية من وِثاق والقيود المرتبطة باستخدامها. هذا إشعار توضيحي للمنتج، وليس بديلاً عن الاستشارة القانونية أو سياسة خصوصية نهائية لخدمة تجارية.",

    statusTitle: "1. حالة النموذج الأولي والقيود المهمة",
    status:
      "وِثاق حالياً نموذج أولي تجريبي مخصص للأفراد والمنشآت. بعض السجلات ونتائج التحقق نموذجية أو محاكاة. لم يتم ربط مصادقة حقيقية للحسابات أو تحقق من المستندات عبر الخادم أو توقيع تشفيري فعلي أو تخزين آمن لبيانات المنشآت في هذه النسخة. لا تستخدمه لاتخاذ قرارات فعلية تتعلق بالدفع أو الشؤون المالية أو القانونية أو الامتثال، ولا تُدخل معلومات سرية أو حساسة.",

    dataTitle: "2. المعلومات التي يتعامل معها النموذج الأولي",
    dataIntro:
      "بحسب الخصائص التي تستخدمها، قد تتعامل الواجهة مع الفئات التالية:",

    data: [
      "الأسماء وعناوين البريد الإلكتروني التي تُدخل في شاشة تسجيل الدخول التجريبية؛ إذ تحفظ جلسة العرض الاسم والبريد الإلكتروني ونوع الحساب في التخزين المحلي للمتصفح. ولا يحفظ رمز جلسة العرض كلمات المرور.",

      "معلومات ملف المنشأة والبيانات النموذجية التي تدخلها أو تعدلها في قسم المنشآت؛ وتحفظ قيم ملف العرض هذه في التخزين المحلي للمتصفح.",

      "الفواتير التي تنشئها في النسخة التجريبية وسجلات التحقق والنشاط المرتبطة بها؛ وتحفظ هذه السجلات التجريبية في التخزين المحلي للمتصفح.",

      "ملف المستند الذي تختاره لعرض خاصية الرفع. يتحقق مسار الرفع الحالي من بعض خصائص الملف ويعرض نتيجة تجريبية؛ ولا يرسل محتوى الملف إلى خادم تحقق تابع لوِثاق ولا ينفذ قراءة ضوئية أو تحققاً فعلياً من التوقيع.",

      "تفضيل اللغة، ويُحفظ في التخزين المحلي للمتصفح.",
    ],

    storageTitle: "3. التخزين المحلي على جهازك",
    storage:
      "يستخدم النموذج الأولي التخزين المحلي للمتصفح للاحتفاظ بتفاصيل جلسة العرض وتفضيل اللغة وبيانات المنشأة والفواتير والنشاط التجريبية على الجهاز والمتصفح اللذين تستخدمهما. هذا ليس قاعدة بيانات آمنة للحسابات ولا تتم مزامنة معلوماتك بين الأجهزة. قد يتمكن أشخاص آخرون يستخدمون ملف المتصفح أو الجهاز نفسه من الوصول إلى هذه المعلومات التجريبية المحفوظة محلياً. وقد يؤدي مسح بيانات الموقع من المتصفح إلى حذفها.",

    contactTitle: "4. نموذج التواصل والبريد الإلكتروني",
    contact:
      "يقوم نموذج التواصل حالياً بإعداد رسالة في تطبيق البريد الإلكتروني الافتراضي على جهازك وتوجيهها إلى w3thaq@gmail.com. لا يرسل النموذج الرسالة إلى خادم تابع لوِثاق ولا يخزنها هذا الموقع. إذا اخترت إرسالها، فسيتولى مزود خدمة البريد الإلكتروني معالجة الرسالة وفق شروطه وممارساته المتعلقة بالخصوصية.",

    sharingTitle: "5. مشاركة المعلومات والجهات الخارجية",
    sharing:
      "لا توفر النسخة التجريبية الحالية قاعدة بيانات خلفية تابعة لوِثاق لتخزين الفواتير التجريبية أو سجلات الحسابات المقدمة. وعند الوصول إلى الموقع عبر الإنترنت، قد يعالج مزود الاستضافة والبنية التقنية قدراً محدوداً من المعلومات التقنية اللازمة لتشغيل الموقع وحمايته، وفق شروطه الخاصة. لا تفترض أن المعلومات التي تدخلها في نسخة تجريبية عامة سرية.",

    securityTitle: "6. الأمان",
    security:
      "نسعى إلى تصميم وِثاق مع مراعاة الثقة الرقمية والتعامل المسؤول مع البيانات. ومع ذلك، لا يوفر هذا النموذج الأولي مصادقة أو ضوابط وصول أو حماية تخزين عبر الخادم بمستوى جاهز للإنتاج، ولا يقدم ضماناً أمنياً شاملاً. لا ترفع مستندات سرية ولا تستخدم بيانات اعتماد حقيقية. استخدم كلمات مرور فريدة في الخدمات الأخرى ولا تعِد استخدام كلمة مرورك في نموذج تجريبي.",

    termsTitle: "7. شروط الاستخدام",

    terms: [
      "استخدم النموذج الأولي بطريقة قانونية، ولا تحاول تعطيل الموقع أو فحصه بقصد الإضرار أو الوصول غير المصرح به إلى الموقع أو معلومات المستخدمين الآخرين.",

      "استخدم معلومات نموذجية أو غير حساسة فقط. وتقع عليك مسؤولية التأكد من امتلاكك الإذن لاستخدام أي معلومات أو مستند تدخله.",

      "نتائج التحقق التجريبية لأغراض معلوماتية فقط. ولا تُعد دليلاً على الأصالة أو ضماناً ضد الاحتيال أو نصيحة مالية أو قانونية، ولا تغني عن التأكد من بيانات الدفع مع المرسل عبر قناة موثوقة.",

      "يُقدم النموذج الأولي لأغراض التقييم والعرض، وقد يتم تغييره أو إيقافه مؤقتاً أو عدم توفره دون إشعار.",
    ],

    rightsTitle: "8. الملكية الفكرية",
    rights:
      "يُعرض اسم وِثاق وهويته البصرية وواجهته ومحتواه الأصلي ضمن هذا النموذج التجريبي. يُرجى عدم نسخ المواد أو إعادة توزيعها أو استخدامها تجارياً بطريقة تنتهك الحقوق المعمول بها.",

    changesTitle: "9. التعديلات على هذا الإشعار",
    changes:
      "قد يتم تحديث هذا الإشعار مع تطور وِثاق. ويشير التاريخ في الأعلى إلى آخر مراجعة لإشعار النموذج الأولي. وسيتطلب الإطلاق التجاري إعداد سياسة خصوصية وشروط أكثر شمولاً تعكس الخدمات الفعلية وتدفقات البيانات وفترات الاحتفاظ وضوابط الأمان والمتطلبات القانونية المعمول بها.",

    contactUsTitle: "10. الاستفسارات",
    contactUs:
      "للاستفسارات المتعلقة بهذا الإشعار أو بوِثاق، يمكن التواصل عبر:",

    disclaimer:
      "صيغ هذا الإشعار في مرحلة النموذج الأولي استناداً إلى السلوك الحالي للتطبيق. وينبغي أن يراجعه مختص قانوني في النطاق القضائي المعني قبل الاستخدام التجاري.",
  },
};

function PrivacyPage() {
  const t = useCopy(copy);

  const sections = [
    {
      title: t.statusTitle,
      body: t.status,
      icon: AlertTriangle,
    },
    {
      title: t.dataTitle,
      body: t.dataIntro,
      list: t.data,
      icon: Database,
    },
    {
      title: t.storageTitle,
      body: t.storage,
      icon: LockKeyhole,
    },
    {
      title: t.contactTitle,
      body: t.contact,
      icon: Mail,
    },
    {
      title: t.sharingTitle,
      body: t.sharing,
      icon: Database,
    },
    {
      title: t.securityTitle,
      body: t.security,
      icon: ShieldCheck,
    },
    {
      title: t.termsTitle,
      list: t.terms,
      icon: FileText,
    },
    {
      title: t.rightsTitle,
      body: t.rights,
      icon: FileText,
    },
    {
      title: t.changesTitle,
      body: t.changes,
      icon: FileText,
    },
    {
      title: t.contactUsTitle,
      body: t.contactUs,
      icon: Mail,
    },
  ];

  return (
    <div className="bg-background">
      <section className="bg-hero py-14 text-navy-foreground md:py-20">
        <div className="container-page max-w-5xl">
          <p className="mb-3 text-sm font-semibold text-verified">
            {t.eyebrow}
          </p>

          <h1 className="text-4xl font-extrabold text-navy-foreground md:text-5xl">
            {t.title}
          </h1>

          <p className="mt-3 text-sm text-navy-muted">{t.updated}</p>

          <p className="mt-6 max-w-3xl leading-8 text-navy-muted">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="container-page max-w-5xl space-y-7 py-12 md:py-16">
        {sections.map(({ title, body, list, icon: Icon }) => (
          <article
            key={title}
            className="rounded-2xl border bg-card p-6 md:p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <Icon className="size-5 shrink-0 text-primary" />

              <h2 className="text-xl font-bold">{title}</h2>
            </div>

            {body && (
              <p className="leading-8 text-muted-foreground">{body}</p>
            )}

            {list && (
              <ul className="mt-3 list-disc space-y-3 ps-6 leading-8 text-muted-foreground">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {title === t.contactUsTitle && (
              <a
                className="mt-2 inline-block font-medium text-primary underline-offset-4 hover:underline"
                href="mailto:w3thaq@gmail.com"
              >
                w3thaq@gmail.com
              </a>
            )}
          </article>
        ))}

        <p className="rounded-xl border border-caution/30 bg-caution/5 p-4 text-sm leading-7 text-muted-foreground">
          {t.disclaimer}
        </p>
      </section>
    </div>
  );
}