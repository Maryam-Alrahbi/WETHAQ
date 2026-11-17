import { formatDate, formatMoney, useLang } from "@/lib/i18n";
import { invoiceTotal } from "@/lib/wethaq/fingerprint";
import type { InvoiceDocument } from "@/lib/wethaq/types";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";
import { QrImage, verifyUrl } from "./common";

const copy = {
  en: { invoice: "Tax Invoice", no: "Invoice no.", date: "Issue date", billTo: "Bill to", item: "Description", qty: "Qty", price: "Unit price", amount: "Amount", total: "Total", pay: "Payment details", bank: "Bank", beneficiary: "Beneficiary", iban: "IBAN", ref: "Verify at WETHAQ", contact: "Contact" },
  ar: { invoice: "فاتورة ضريبية", no: "رقم الفاتورة", date: "تاريخ الإصدار", billTo: "إلى", item: "الوصف", qty: "الكمية", price: "سعر الوحدة", amount: "المبلغ", total: "الإجمالي", pay: "بيانات الدفع", bank: "البنك", beneficiary: "المستفيد", iban: "رقم الآيبان", ref: "تحقق عبر وِثاق", contact: "التواصل" },
};

/** Visual rendering of an invoice. `highlight` marks changed fields (payment, email) in red. */
export function InvoiceSheet({
  doc,
  reference,
  highlight = [],
  className,
}: {
  doc: InvoiceDocument;
  reference?: string;
  highlight?: Array<"payment" | "email">;
  className?: string;
}) {
  const { lang } = useLang();
  const t = copy[lang];
  const mark = (key: "payment" | "email") =>
    highlight.includes(key) ? "rounded bg-warning/10 px-1 text-warning ring-1 ring-warning/30" : "";

  return (
    <div className={cn("rounded-2xl border bg-card p-5 text-xs shadow-card md:p-6", className)}>
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-navy-foreground">AN</div>
          <div>
            <p className="text-sm font-bold text-navy">{doc.business.name}</p>
            <p className="text-muted-foreground">{doc.business.registrationNumber}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-sm font-bold uppercase text-navy rtl:normal-case">{t.invoice}</p>
          <p className="text-muted-foreground">{doc.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div>
          <p className="font-semibold text-navy">{t.billTo}</p>
          <p>{doc.customer.name}</p>
          <p className="text-muted-foreground">{doc.customer.contact}</p>
        </div>
        <div className="text-end">
          <p className="font-semibold text-navy">{t.date}</p>
          <p>{formatDate(doc.issueDate, lang)}</p>
          <p className="mt-1 font-semibold text-navy">{t.contact}</p>
          <p className={cn("break-all", mark("email"))}>{doc.business.email}</p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-y bg-surface-gray text-muted-foreground">
            <th className="py-2 text-start font-medium">{t.item}</th>
            <th className="py-2 text-center font-medium">{t.qty}</th>
            <th className="hidden py-2 text-end font-medium sm:table-cell">{t.price}</th>
            <th className="py-2 text-end font-medium">{t.amount}</th>
          </tr>
        </thead>
        <tbody>
          {doc.lines.map((l, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{l.description}</td>
              <td className="py-2 text-center">{l.quantity}</td>
              <td className="hidden py-2 text-end sm:table-cell">{formatMoney(l.unitPrice, doc.currency, lang)}</td>
              <td className="py-2 text-end">{formatMoney(l.quantity * l.unitPrice, doc.currency, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end py-3">
        <p className="text-sm font-bold text-navy">
          {t.total}: {formatMoney(invoiceTotal(doc), doc.currency, lang)}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4 rounded-xl bg-surface-gray p-3">
        <div className={cn("space-y-0.5", mark("payment"))}>
          <p className="font-semibold text-navy">{t.pay}</p>
          <p>{t.bank}: {doc.payment.bankName}</p>
          <p>{t.beneficiary}: {doc.payment.accountName}</p>
          <p dir="ltr" className="font-mono">{t.iban}: {doc.payment.iban}</p>
        </div>
        {reference && (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <QrImage value={verifyUrl(reference)} size={64} label={`QR ${reference}`} />
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <LogoMark className="size-3" /> {reference}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
