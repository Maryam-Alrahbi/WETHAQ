import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileCheck2, LogOut, Plus, ScanLine, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoNotice, PageHero, verifyUrl } from "@/components/site/common";
import { InvoiceSheet } from "@/components/site/InvoiceSheet";
import { formatDate, formatMoney, useCopy, useLang, useT } from "@/lib/i18n";
import { invoiceTotal, maskAccount } from "@/lib/wethaq/fingerprint";
import { issueInvoice } from "@/lib/wethaq/service";
import { signOut, useSession } from "@/lib/wethaq/session";
import { useDemoStore } from "@/lib/wethaq/store";
import type { InvoiceDocument, InvoiceLine, VerificationRecord } from "@/lib/wethaq/types";

export const Route = createFileRoute("/business")({
  head: () => ({ meta: [{ title: "Business Portal – WETHAQ" }] }),
  component: BusinessPage,
});

const copy = {
  en: {
    title: "Business Portal",
    desc: "Manage your verified identity and issue invoices that recipients can check.",
    notice: "Prototype: data lives in this browser only, and signing is simulated. No real accounts, storage or cryptography are connected yet.",
    gateTitle: "Sign in to open the portal", gateText: "The portal is for business accounts.", gateBtn: "Log in", wrongType: "You are signed in with an individual account. Sign in with a business account to use the portal.",
    signOut: "Sign out",
    tabs: { dashboard: "Dashboard", profile: "Profile", issue: "Issue invoice", docs: "Documents" },
    stats: { issued: "Invoices issued", checks: "Times checked", warnings: "Warnings", status: "Business status" },
    verified: "Verified", unverified: "Not yet verified", pending: "Pending review",
    activity: "Recent activity", noActivity: "No activity yet.",
    fields: { name: "Business name", registrationNumber: "Registration", email: "Official email", phone: "Phone", website: "Website", domain: "Registered domain" } as Record<string, string>,
    accounts: "Approved payment accounts", accountsHint: "Invoices can only use accounts approved here. Recipients are warned when a document shows any other account.",
    form: { number: "Invoice number", date: "Issue date", customer: "Customer name", contact: "Customer email or phone", lines: "Items", desc: "Description", qty: "Qty", price: "Unit price (OMR)", addLine: "Add item", account: "Pay to", total: "Total", submit: "Generate Verified Invoice", working: "Generating…" },
    errors: { number: "Enter an invoice number.", dup: "This invoice number already exists.", customer: "Enter the customer's name and contact.", lines: "Each item needs a description, a quantity above 0 and a price of 0 or more." },
    done: "Invoice issued", ref: "Verification reference", pdf: "Download PDF", checkIt: "Check it on the verify page", newOne: "Create another",
    pdfNote: "The PDF is English-only in this prototype.",
    docs: { search: "Search by number, customer or reference", number: "Invoice", date: "Date", customer: "Customer", total: "Total", checks: "Checks", none: "No invoices match.", view: "View" },
  },
  ar: {
    title: "بوابة المنشآت",
    desc: "أدر هويتك الموثّقة وأصدر فواتير يمكن للمستلمين التحقق منها.",
    notice: "نموذج أولي: البيانات في هذا المتصفح فقط، والتوقيع محاكاة. لم يُربط أي حساب أو تخزين أو تشفير حقيقي بعد.",
    gateTitle: "سجّل الدخول لفتح البوابة", gateText: "البوابة مخصصة لحسابات المنشآت.", gateBtn: "تسجيل الدخول", wrongType: "أنت مسجّل بحساب فرد. سجّل الدخول بحساب منشأة لاستخدام البوابة.",
    signOut: "تسجيل الخروج",
    tabs: { dashboard: "لوحة التحكم", profile: "الملف", issue: "إصدار فاتورة", docs: "المستندات" },
    stats: { issued: "الفواتير الصادرة", checks: "مرات الفحص", warnings: "التحذيرات", status: "حالة المنشأة" },
    verified: "موثّق", unverified: "لم يُوثَّق بعد", pending: "قيد المراجعة",
    activity: "النشاط الأخير", noActivity: "لا يوجد نشاط بعد.",
    fields: { name: "اسم المنشأة", registrationNumber: "السجل", email: "البريد الرسمي", phone: "الهاتف", website: "الموقع", domain: "النطاق المسجّل" } as Record<string, string>,
    accounts: "حسابات الدفع المعتمدة", accountsHint: "لا يمكن للفواتير استخدام إلا الحسابات المعتمدة هنا. يُحذَّر المستلمون عند ظهور أي حساب آخر في المستند.",
    form: { number: "رقم الفاتورة", date: "تاريخ الإصدار", customer: "اسم العميل", contact: "بريد العميل أو هاتفه", lines: "البنود", desc: "الوصف", qty: "الكمية", price: "سعر الوحدة (ر.ع)", addLine: "إضافة بند", account: "الدفع إلى", total: "الإجمالي", submit: "إنشاء فاتورة موثّقة", working: "جارٍ الإنشاء…" },
    errors: { number: "أدخل رقم الفاتورة.", dup: "رقم الفاتورة موجود مسبقًا.", customer: "أدخل اسم العميل وبيانات التواصل.", lines: "يحتاج كل بند إلى وصف وكمية أكبر من 0 وسعر 0 أو أكثر." },
    done: "تم إصدار الفاتورة", ref: "مرجع التحقق", pdf: "تنزيل PDF", checkIt: "افحصها في صفحة التحقق", newOne: "إنشاء فاتورة أخرى",
    pdfNote: "ملف PDF بالإنجليزية فقط في هذا النموذج.",
    docs: { search: "ابحث بالرقم أو العميل أو المرجع", number: "الفاتورة", date: "التاريخ", customer: "العميل", total: "الإجمالي", checks: "الفحوص", none: "لا توجد فواتير مطابقة.", view: "عرض" },
  },
};
type Copy = typeof copy.en;

function VerifiedBadge({ ok, t }: { ok: boolean; t: Copy }) {
  return <Badge variant={ok ? "verified" : "caution"}>{ok ? t.verified : t.unverified}</Badge>;
}

async function downloadPdf(record: VerificationRecord) {
  const [{ jsPDF }, QRCode] = await Promise.all([import("jspdf"), import("qrcode")]);
  const d = record.document;
  const pdf = new jsPDF();
  let y = 20;
  const line = (text: string, size = 11, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.text(text, 20, y);
    y += size * 0.6 + 3;
  };
  line(d.business.name, 16, true);
  line(`Invoice ${d.invoiceNumber}   |   Issued ${d.issueDate}`);
  line(`Bill to: ${d.customer.name} (${d.customer.contact})`);
  y += 4;
  d.lines.forEach((l) => line(`${l.description}  x${l.quantity}  @ ${l.unitPrice.toFixed(3)}  =  ${(l.quantity * l.unitPrice).toFixed(3)} ${d.currency}`));
  line(`Total: ${invoiceTotal(d).toFixed(3)} ${d.currency}`, 13, true);
  y += 4;
  line(`Pay to: ${d.payment.accountName} - ${d.payment.bankName}`);
  line(`IBAN: ${d.payment.iban}`);
  y += 6;
  line(`Verification reference: ${record.reference}`, 11, true);
  line("Prototype document - simulated signature, not a legal invoice.", 9);
  const qr = await QRCode.toDataURL(verifyUrl(record.reference), { margin: 1, width: 300 });
  pdf.addImage(qr, "PNG", 20, y, 40, 40);
  pdf.save(`${d.invoiceNumber}.pdf`);
}

function BusinessPage() {
  const t = useCopy(copy);
  const { session, ready } = useSession();

  if (!ready) return null;
  if (!session || session.type !== "business") {
    return (
      <>
        <PageHero title={t.title} description={t.desc} />
        <section className="container-page max-w-xl py-12 text-center">
          <h2 className="text-2xl font-bold">{t.gateTitle}</h2>
          <p className="mt-2 text-muted-foreground">{session ? t.wrongType : t.gateText}</p>
          <Button asChild className="mt-6"><Link to="/login" search={{ mode: "signin" }}>{t.gateBtn}</Link></Button>
        </section>
      </>
    );
  }
  return <Portal t={t} name={session.name} />;
}

function Portal({ t, name }: { t: Copy; name: string }) {
  const { lang } = useLang();
  const tr = useT();
  const { records, profile, activity } = useDemoStore();
  const business = profile.fields.find((f) => f.key === "name")?.value ?? "";
  const mine = useMemo(() => records.filter((r) => r.document.business.name === business), [records, business]);

  return (
    <>
      <PageHero title={t.title} description={t.desc} />
      <section className="container-page space-y-6 py-8">
        <DemoNotice>{t.notice}</DemoNotice>
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-navy">{name} · {business}</p>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut /> {t.signOut}</Button>
        </div>
        <Tabs defaultValue="dashboard">
          <TabsList className="flex-wrap">
            {(Object.keys(t.tabs) as Array<keyof Copy["tabs"]>).map((k) => <TabsTrigger key={k} value={k}>{t.tabs[k]}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [t.stats.issued, String(mine.length)],
                [t.stats.checks, String(mine.reduce((n, r) => n + r.checks, 0))],
                [t.stats.warnings, String(activity.filter((a) => a.tone === "warning").length)],
                [t.stats.status, profile.verificationStatus === "verified" ? t.verified : t.pending],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border bg-card p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <h2 className="mb-3 text-lg font-bold">{t.activity}</h2>
              {activity.length === 0 ? <p className="text-muted-foreground">{t.noActivity}</p> : (
                <ul className="divide-y">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                      <span>{tr(a.text)}</span>
                      <span className="shrink-0 text-muted-foreground">{formatDate(a.date, lang)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 pt-4">
            <dl className="divide-y rounded-2xl border bg-card px-5 shadow-card">
              {profile.fields.map((f) => (
                <div key={f.key} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <dt className="text-sm text-muted-foreground">{t.fields[f.key]}</dt>
                  <dd className="flex items-center gap-2 font-medium" dir="auto">{f.value} <VerifiedBadge ok={f.verified} t={t} /></dd>
                </div>
              ))}
            </dl>
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <h2 className="text-lg font-bold">{t.accounts}</h2>
              <p className="mb-3 text-sm text-muted-foreground">{t.accountsHint}</p>
              {profile.accounts.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 text-sm">
                  <span>{a.accountName} · {a.bankName} · <span dir="ltr" className="font-mono">{maskAccount(a.iban)}</span></span>
                  <VerifiedBadge ok={a.verified} t={t} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issue" className="pt-4"><IssueForm t={t} /></TabsContent>
          <TabsContent value="docs" className="pt-4"><Documents t={t} records={mine} /></TabsContent>
        </Tabs>
      </section>
    </>
  );
}

const blankLine = (): InvoiceLine => ({ description: "", quantity: 1, unitPrice: 0 });

function IssueForm({ t }: { t: Copy }) {
  const { lang } = useLang();
  const { records, profile } = useDemoStore();
  const field = (k: string) => profile.fields.find((f) => f.key === k)?.value ?? "";
  const usable = profile.accounts.filter((a) => a.verified);
  const lastSeq = Math.max(0, ...records.map((r) => Number(r.document.invoiceNumber.match(/(\d+)$/)?.[1] ?? 0)));
  const nextNumber = `INV-${new Date().getFullYear()}-${String(lastSeq + 1).padStart(4, "0")}`;

  const [number, setNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [lines, setLines] = useState<InvoiceLine[]>([blankLine()]);
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [issued, setIssued] = useState<VerificationRecord | null>(null);

  const total = invoiceTotal({ lines });
  const setLine = (i: number, patch: Partial<InvoiceLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const invoiceNumber = (number || nextNumber).trim();
    const account = usable.find((a) => a.id === accountId) ?? usable[0];
    if (!invoiceNumber) return setError(t.errors.number);
    if (records.some((r) => r.document.invoiceNumber.toLowerCase() === invoiceNumber.toLowerCase())) return setError(t.errors.dup);
    if (!customer.trim() || !contact.trim()) return setError(t.errors.customer);
    if (lines.some((l) => !l.description.trim() || !(l.quantity > 0) || !(l.unitPrice >= 0))) return setError(t.errors.lines);
    if (!account) return;
    setError(null);
    setBusy(true);
    const doc: InvoiceDocument = {
      invoiceNumber,
      issueDate: date,
      business: { name: field("name"), registrationNumber: field("registrationNumber"), email: field("email"), phone: field("phone"), domain: field("domain") },
      customer: { name: customer.trim(), contact: contact.trim() },
      lines: lines.map((l) => ({ ...l, description: l.description.trim() })),
      currency: "OMR",
      payment: { bankName: account.bankName, accountName: account.accountName, iban: account.iban },
    };
    try {
      setIssued(await issueInvoice(doc));
    } finally {
      setBusy(false);
    }
  };

  if (issued) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <InvoiceSheet doc={issued.document} reference={issued.reference} />
        <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-bold text-verified"><FileCheck2 className="size-5" /> {t.done}</h2>
          <div><p className="text-sm text-muted-foreground">{t.ref}</p><p dir="ltr" className="font-mono text-lg font-bold text-navy">{issued.reference}</p></div>
          <Button className="w-full" onClick={() => downloadPdf(issued)}><Download /> {t.pdf}</Button>
          <p className="text-xs text-muted-foreground">{t.pdfNote}</p>
          <Button variant="outline" className="w-full" asChild><Link to="/verify" search={{ ref: issued.reference }}><ScanLine /> {t.checkIt}</Link></Button>
          <Button variant="ghost" className="w-full" onClick={() => { setIssued(null); setNumber(""); setCustomer(""); setContact(""); setLines([blankLine()]); }}>{t.newOne}</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="inv-no">{t.form.number}</Label><Input id="inv-no" dir="ltr" placeholder={nextNumber} value={number} onChange={(e) => setNumber(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="inv-date">{t.form.date}</Label><Input id="inv-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="inv-c">{t.form.customer}</Label><Input id="inv-c" value={customer} onChange={(e) => setCustomer(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="inv-ct">{t.form.contact}</Label><Input id="inv-ct" dir="ltr" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
      </div>
      <fieldset className="space-y-3">
        <legend className="mb-2 font-semibold text-navy">{t.form.lines}</legend>
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_5rem_7rem_auto] items-end gap-2">
            <div className="space-y-1"><Label className="text-xs">{t.form.desc}</Label><Input value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">{t.form.qty}</Label><Input type="number" min={1} value={l.quantity} onChange={(e) => setLine(i, { quantity: Number(e.target.value) })} /></div>
            <div className="space-y-1"><Label className="text-xs">{t.form.price}</Label><Input type="number" min={0} step="0.001" value={l.unitPrice} onChange={(e) => setLine(i, { unitPrice: Number(e.target.value) })} /></div>
            <Button type="button" variant="ghost" size="icon" disabled={lines.length === 1} onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} aria-label="Remove item"><Trash2 /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setLines((ls) => [...ls, blankLine()])}><Plus /> {t.form.addLine}</Button>
      </fieldset>
      <div className="space-y-1.5">
        <Label htmlFor="inv-acc">{t.form.account}</Label>
        <select id="inv-acc" value={accountId || usable[0]?.id} onChange={(e) => setAccountId(e.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
          {usable.map((a) => <option key={a.id} value={a.id}>{a.bankName} · {maskAccount(a.iban)}</option>)}
        </select>
      </div>
      <p className="text-end text-lg font-bold text-navy">{t.form.total}: {formatMoney(total, "OMR", lang)}</p>
      {error && <p role="alert" className="text-sm font-medium text-warning">{error}</p>}
      <Button type="submit" disabled={busy || usable.length === 0}>{busy ? t.form.working : t.form.submit}</Button>
    </form>
  );
}

function Documents({ t, records }: { t: Copy; records: VerificationRecord[] }) {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<VerificationRecord | null>(null);
  const shown = records.filter((r) => `${r.document.invoiceNumber} ${r.document.customer.name} ${r.reference}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="space-y-4">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.docs.search} aria-label={t.docs.search} className="max-w-md" />
      <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-surface-gray text-muted-foreground">
            {[t.docs.number, t.docs.date, t.docs.customer, t.docs.total, t.docs.checks, ""].map((h, i) => <th key={i} className="p-3 text-start font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">{t.docs.none}</td></tr>}
            {shown.map((r) => (
              <tr key={r.reference} className="border-b last:border-0">
                <td className="p-3 font-medium" dir="ltr">{r.document.invoiceNumber}</td>
                <td className="p-3">{formatDate(r.document.issueDate, lang)}</td>
                <td className="p-3">{r.document.customer.name}</td>
                <td className="p-3">{formatMoney(invoiceTotal(r.document), r.document.currency, lang)}</td>
                <td className="p-3">{r.checks}</td>
                <td className="p-3 text-end"><Button size="sm" variant="outline" onClick={() => setOpen(r)}>{t.docs.view}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{open?.document.invoiceNumber}</DialogTitle></DialogHeader>
          {open && <InvoiceSheet doc={open.document} reference={open.reference} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
