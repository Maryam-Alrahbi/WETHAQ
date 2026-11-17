import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoNotice, PageHero } from "@/components/site/common";
import { useCopy } from "@/lib/i18n";
import { signIn, type Session } from "@/lib/wethaq/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { mode: "signin" | "signup" } => ({
    mode: search.mode === "signup" ? "signup" : "signin",
  }),
  head: () => ({ meta: [{ title: "Log in or sign up – WETHAQ" }] }),
  component: LoginPage,
});

const copy = {
  en: {
    title: "Log in or create an account",
    notice: "Accounts are simulated in this prototype. Nothing is checked or stored on a server and passwords are never saved.",
    signin: "Log in", signup: "Sign up",
    individual: "Individual account", individualHint: "Verify documents you receive.",
    business: "Business account", businessHint: "Register your business, issue verified invoices and manage documents.",
    name: "Full name", email: "Email", password: "Password (8+ characters)",
    consent: "I agree to the Terms and Privacy Policy and consent to my documents being processed.",
    submit: { signin: "Log in", signup: "Create account" },
    errName: "Enter your name.", errEmail: "Enter a valid email address.", errPass: "Use a password with at least 8 characters.", errConsent: "You need to accept the terms to create an account.",
  },
  ar: {
    title: "تسجيل الدخول أو إنشاء حساب",
    notice: "الحسابات في هذا النموذج الأولي محاكاة. لا يُفحص شيء ولا يُخزَّن على خادم، ولا تُحفظ كلمات المرور.",
    signin: "تسجيل الدخول", signup: "إنشاء حساب",
    individual: "حساب فرد", individualHint: "تحقق من المستندات التي تستلمها.",
    business: "حساب منشأة", businessHint: "سجّل منشأتك وأصدر فواتير موثّقة وأدر مستنداتك.",
    name: "الاسم الكامل", email: "البريد الإلكتروني", password: "كلمة المرور (8 أحرف على الأقل)",
    consent: "أوافق على الشروط وسياسة الخصوصية وعلى معالجة مستنداتي.",
    submit: { signin: "تسجيل الدخول", signup: "إنشاء الحساب" },
    errName: "أدخل اسمك.", errEmail: "أدخل بريدًا إلكترونيًا صالحًا.", errPass: "استخدم كلمة مرور من 8 أحرف على الأقل.", errConsent: "يجب قبول الشروط لإنشاء حساب.",
  },
};

function LoginPage() {
  const t = useCopy(copy);
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [type, setType] = useState<Session["type"]>("business");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !name.trim()) return setError(t.errName);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(t.errEmail);
    if (password.length < 8) return setError(t.errPass);
    if (mode === "signup" && !consent) return setError(t.errConsent);
    signIn({ name: name.trim() || email.split("@")[0], email: email.trim(), type });
    if (type === "business") navigate({ to: "/business" });
    else navigate({ to: "/verify", search: {} });
  };

  return (
    <>
      <PageHero title={t.title} />
      <section className="container-page max-w-xl py-10">
        <DemoNotice className="mb-6">{t.notice}</DemoNotice>
        <div className="mb-4 grid grid-cols-2 gap-2" role="group">
          {(["individual", "business"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              aria-pressed={type === k}
              className={cn("rounded-xl border p-3 text-start transition-colors", type === k ? "border-primary bg-surface-blue" : "bg-card hover:bg-surface-gray")}
            >
              <span className="block font-semibold text-navy">{t[k]}</span>
              <span className="text-xs text-muted-foreground">{t[`${k}Hint` as const]}</span>
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-card" noValidate>
          <div className="flex gap-2 text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <Button key={m} type="button" size="sm" variant={mode === m ? "default" : "outline"} onClick={() => navigate({ to: "/login", search: { mode: m } })}>
                {t[m]}
              </Button>
            ))}
          </div>
          {mode === "signup" && (
            <div className="space-y-1.5"><Label htmlFor="name">{t.name}</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
          )}
          <div className="space-y-1.5"><Label htmlFor="email">{t.email}</Label><Input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
          <div className="space-y-1.5"><Label htmlFor="pw">{t.password}</Label><Input id="pw" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></div>
          {mode === "signup" && (
            <div className="flex items-start gap-2"><Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} /><Label htmlFor="consent" className="font-normal leading-snug">{t.consent}</Label></div>
          )}
          {error && <p role="alert" className="text-sm font-medium text-warning">{error}</p>}
          <Button type="submit" className="w-full">{t.submit[mode]}</Button>
        </form>
      </section>
    </>
  );
}
