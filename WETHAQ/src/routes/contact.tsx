import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCopy } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact WETHAQ" },
      {
        name: "description",
        content:
          "Contact WETHAQ in Muscat, Oman, by email or through the contact form.",
      },
    ],
  }),
  component: ContactPage,
});

const copy = {
  en: {
    eyebrow: "Get in touch",
    title: "We'd be glad to hear from you.",
    intro:
      "Questions, feedback, or interested in learning more about WETHAQ? Send us a message.",

    email: "Email us",
    location: "Location",
    locationValue: "Muscat, Sultanate of Oman",
    mapLink: "View Muscat on Google Maps",

    response:
      "For general enquiries, contact us by email. Our contact form opens your default email application; it does not send or store messages on this website.",

    formTitle: "Send a message",
    name: "Full name",
    emailLabel: "Email address",
    subject: "Subject",
    message: "Your message",

    send: "Continue to email",

    required:
      "Please complete all fields with a valid email address.",

    mailNote:
      "Your email application will open with your message prepared. Review and send it there.",
  },

  ar: {
    eyebrow: "ابقَ على تواصل",
    title: "يسعدنا التواصل معك.",
    intro:
      "هل لديك استفسار أو ملاحظة، أو ترغب في معرفة المزيد عن وِثاق؟ أرسل لنا رسالة.",

    email: "راسلنا عبر البريد الإلكتروني",
    location: "الموقع",
    locationValue: "مسقط، سلطنة عُمان",
    mapLink: "عرض مسقط على خرائط Google",

    response:
      "للاستفسارات العامة، يمكن التواصل معنا عبر البريد الإلكتروني. يفتح نموذج التواصل تطبيق البريد الإلكتروني الافتراضي لديك؛ ولا يرسل الرسائل أو يخزنها هذا الموقع.",

    formTitle: "أرسل رسالة",
    name: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "رسالتك",

    send: "المتابعة إلى البريد الإلكتروني",

    required:
      "يرجى تعبئة جميع الحقول وإدخال بريد إلكتروني صحيح.",

    mailNote:
      "سيفتح تطبيق البريد الإلكتروني مع تجهيز رسالتك. يرجى مراجعتها وإرسالها من هناك.",
  },
};

function ContactPage() {
  const t = useCopy(copy);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !subject.trim() ||
      !message.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError(t.required);
      setReady(false);
      return;
    }

    setError("");
    setReady(true);

    const body = `${t.name}: ${name.trim()}
${t.emailLabel}: ${email.trim()}

${message.trim()}`;

    const mailto = `mailto:w3thaq@gmail.com?subject=${encodeURIComponent(
      subject.trim()
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

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

          <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-muted">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 md:grid-cols-[0.85fr_1.15fr] md:py-20">
        <div className="space-y-6">
          <div className="rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">{t.email}</h2>
            </div>

            <a
              className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
              href="mailto:w3thaq@gmail.com"
            >
              w3thaq@gmail.com
            </a>
          </div>

          <div className="rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">{t.location}</h2>
            </div>

            <a
              className="mt-3 inline-block text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              href="https://www.google.com/maps/search/?api=1&query=Muscat%2C%20Oman"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.locationValue}
              <span className="sr-only"> ({t.mapLink})</span>
            </a>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {t.response}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm md:p-8"
        >
          <h2 className="text-2xl font-bold">{t.formTitle}</h2>

          <div className="space-y-2">
            <Label htmlFor="contact-name">{t.name}</Label>

            <Input
              id="contact-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">{t.emailLabel}</Label>

            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">{t.subject}</Label>

            <Input
              id="contact-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">{t.message}</Label>

            <Textarea
              id="contact-message"
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          {ready && (
            <p role="status" className="text-sm text-verified">
              {t.mailNote}
            </p>
          )}

          <Button type="submit" className="w-full sm:w-auto">
            <Send className="me-2 size-4" />
            {t.send}
          </Button>
        </form>
      </section>
    </div>
  );
}