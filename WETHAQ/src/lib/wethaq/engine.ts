import type { Bilingual } from "@/lib/i18n";
import type { BusinessProfile } from "./demo-data";
import { domainOf, fingerprint, invoiceTotal, maskAccount } from "./fingerprint";
import type {
  InvoiceDocument,
  RiskIndicator,
  VerificationMethod,
  VerificationRecord,
  VerificationResult,
} from "./types";

/**
 * Rule-based stand-in for the AI risk analysis. It compares extracted document content with the
 * signed verification record and the verified business profile. A real deployment would feed
 * OCR output into an AI model and keep cryptographic signature checks as the source of truth.
 */

const INVOICE: Bilingual = { en: "Invoice", ar: "فاتورة" };
const normalizeIban = (v: string) => v.replace(/\s+/g, "").toUpperCase();

function docInfo(doc: InvoiceDocument, shownAccount: string) {
  return {
    type: INVOICE,
    number: doc.invoiceNumber,
    issuer: doc.business.name,
    issueDate: doc.issueDate,
    total: invoiceTotal(doc),
    currency: doc.currency,
    maskedAccount: maskAccount(shownAccount),
  };
}

export function analyzeAgainstRecord(
  submitted: InvoiceDocument,
  record: VerificationRecord,
  profile: BusinessProfile,
): RiskIndicator[] {
  const original = record.document;
  const indicators: RiskIndicator[] = [];

  const submittedIban = normalizeIban(submitted.payment.iban);
  if (submittedIban !== normalizeIban(original.payment.iban)) {
    indicators.push({
      id: "payment-changed",
      severity: "high",
      title: { en: "Payment account changed", ar: "تم تغيير حساب الدفع" },
      detail: {
        en: `The document shows account ${maskAccount(submitted.payment.iban)} at ${submitted.payment.bankName}, but the original verified invoice uses ${maskAccount(original.payment.iban)}.`,
        ar: `يظهر في المستند الحساب ${maskAccount(submitted.payment.iban)} لدى ${submitted.payment.bankName}، بينما تستخدم الفاتورة الأصلية الموثّقة الحساب ${maskAccount(original.payment.iban)}.`,
      },
    });
  }

  const approved = profile.accounts.filter((a) => a.verified).map((a) => normalizeIban(a.iban));
  if (!approved.includes(submittedIban)) {
    indicators.push({
      id: "payment-not-approved",
      severity: "high",
      title: { en: "Account not in verified business profile", ar: "الحساب غير مسجّل في ملف المنشأة الموثّق" },
      detail: {
        en: "Payment account information differs from the information associated with the verified business profile.",
        ar: "تختلف معلومات حساب الدفع عن المعلومات المرتبطة بملف المنشأة الموثّق.",
      },
    });
  }

  if (submitted.payment.accountName.trim() !== original.payment.accountName.trim()) {
    indicators.push({
      id: "beneficiary-changed",
      severity: "medium",
      title: { en: "Beneficiary name differs", ar: "اسم المستفيد مختلف" },
      detail: {
        en: `Beneficiary "${submitted.payment.accountName}" differs from "${original.payment.accountName}" on the original.`,
        ar: `اسم المستفيد "${submitted.payment.accountName}" يختلف عن "${original.payment.accountName}" في الأصل.`,
      },
    });
  }

  const registeredDomain =
    profile.fields.find((f) => f.key === "domain" && f.verified)?.value.toLowerCase() ??
    domainOf(original.business.email);
  const contactDomain = domainOf(submitted.business.email);
  if (contactDomain !== registeredDomain) {
    indicators.push({
      id: "contact-domain",
      severity: "medium",
      title: { en: "Look-alike contact email", ar: "بريد تواصل مشابه للأصلي" },
      detail: {
        en: `The contact email uses "${contactDomain}", which does not match the registered domain "${registeredDomain}".`,
        ar: `يستخدم بريد التواصل النطاق "${contactDomain}" وهو لا يطابق النطاق المسجّل "${registeredDomain}".`,
      },
    });
  }

  if (invoiceTotal(submitted) !== invoiceTotal(original)) {
    indicators.push({
      id: "amount-changed",
      severity: "high",
      title: { en: "Total amount changed", ar: "تم تغيير المبلغ الإجمالي" },
      detail: {
        en: `The total ${invoiceTotal(submitted)} ${submitted.currency} differs from the original ${invoiceTotal(original)} ${original.currency}.`,
        ar: `الإجمالي ${invoiceTotal(submitted)} ${submitted.currency} يختلف عن الأصل ${invoiceTotal(original)} ${original.currency}.`,
      },
    });
  }

  if (
    submitted.invoiceNumber !== original.invoiceNumber ||
    submitted.issueDate !== original.issueDate ||
    submitted.customer.name !== original.customer.name
  ) {
    indicators.push({
      id: "details-changed",
      severity: "medium",
      title: { en: "Invoice details changed", ar: "تم تغيير تفاصيل الفاتورة" },
      detail: {
        en: "Invoice number, date or customer details differ from the original record.",
        ar: "يختلف رقم الفاتورة أو تاريخها أو بيانات العميل عن السجل الأصلي.",
      },
    });
  }

  return indicators;
}

/** Full check: a received document (upload) compared with its verification record. */
export function verifyDocument(
  submitted: InvoiceDocument,
  record: VerificationRecord,
  profile: BusinessProfile,
  method: VerificationMethod,
  now: string,
): VerificationResult {
  const indicators = analyzeAgainstRecord(submitted, record, profile);
  const intact = fingerprint(submitted) === record.fingerprint;
  const clean = intact && indicators.length === 0 && record.signature.valid && record.businessVerified;
  const paymentIssue = indicators.some((i) => i.id === "payment-changed" || i.id === "payment-not-approved");

  const base = {
    method,
    reference: record.reference,
    verifiedAt: now,
    documentInfo: docInfo(submitted, submitted.payment.iban),
    source: record.businessVerified
      ? {
          state: "pass" as const,
          detail: {
            en: `Linked to the verified business profile of ${record.document.business.name}.`,
            ar: `مرتبط بملف المنشأة الموثّق لـ ${record.document.business.name}.`,
          },
        }
      : {
          state: "fail" as const,
          detail: { en: "The issuing business has not completed verification.", ar: "لم تُكمل المنشأة المُصدِرة التحقق." },
        },
    signature: record.signature.valid
      ? {
          state: "pass" as const,
          detail: {
            en: `Valid ${record.signature.algorithm} signature from key ${record.signature.keyId}.`,
            ar: `توقيع ${record.signature.algorithm} صالح من المفتاح ${record.signature.keyId}.`,
          },
        }
      : { state: "fail" as const, detail: { en: "Signature is not valid.", ar: "التوقيع غير صالح." } },
    integrity: intact
      ? {
          state: "pass" as const,
          detail: {
            en: "The document matches the original verified version exactly.",
            ar: "المستند مطابق تماماً للنسخة الأصلية الموثّقة.",
          },
        }
      : {
          state: "fail" as const,
          detail: {
            en: "The document content does not match the original verified version.",
            ar: "محتوى المستند لا يطابق النسخة الأصلية الموثّقة.",
          },
        },
    indicators,
    demo: true as const,
  };

  if (clean) {
    return {
      ...base,
      status: "verified",
      headline: { en: "Verified — document matches the original", ar: "موثّق — المستند مطابق للأصل" },
      explanation: {
        en: "This invoice was issued by a verified business, its digital signature is valid, and its content matches the original record. No suspicious indicators were found.",
        ar: "صدرت هذه الفاتورة عن منشأة موثّقة، وتوقيعها الرقمي صالح، ومحتواها مطابق للسجل الأصلي. لم يتم العثور على مؤشرات مريبة.",
      },
      actions: [
        {
          en: "You can proceed using the payment details shown on this invoice.",
          ar: "يمكنك المتابعة باستخدام بيانات الدفع الظاهرة في هذه الفاتورة.",
        },
        {
          en: "Keep the verification reference for your records.",
          ar: "احتفظ برقم مرجع التحقق ضمن سجلاتك.",
        },
      ],
    };
  }

  return {
    ...base,
    status: "warning",
    headline: paymentIssue
      ? { en: "Warning — document modification detected", ar: "تحذير — تم اكتشاف تعديل على المستند" }
      : { en: "Warning — review required", ar: "تحذير — يتطلب مراجعة" },
    explanation: paymentIssue
      ? {
          en: "The payment account information in this document differs from the original verified invoice. The QR reference and signature belong to a genuine invoice, but the content you received was changed after it was issued — a common pattern in invoice redirection fraud.",
          ar: "تختلف معلومات حساب الدفع في هذا المستند عن الفاتورة الأصلية الموثّقة. رمز QR والتوقيع يعودان لفاتورة حقيقية، لكن المحتوى الذي وصلك تم تغييره بعد إصداره — وهو نمط شائع في احتيال تحويل الفواتير.",
        }
      : {
          en: "Some details in this document differ from the original verified record. This does not prove fraud, but the differences should be confirmed with the issuing business.",
          ar: "بعض التفاصيل في هذا المستند تختلف عن السجل الأصلي الموثّق. هذا لا يثبت وجود احتيال، لكن يجب تأكيد الاختلافات مع المنشأة المُصدِرة.",
        },
    actions: [
      {
        en: "Contact the issuing business using its official contact information before making any payment.",
        ar: "تواصل مع المنشأة المُصدِرة عبر بيانات التواصل الرسمية قبل إجراء أي دفعة.",
      },
      { en: "Confirm payment details independently.", ar: "تأكد من بيانات الدفع بشكل مستقل." },
      {
        en: "Do not rely on suspicious payment instructions until they are confirmed.",
        ar: "لا تعتمد على تعليمات الدفع المشبوهة حتى يتم تأكيدها.",
      },
    ],
  };
}

/** Lookup by reference / QR: confirms the record exists, without seeing the received copy. */
export function verifyReferenceOnly(
  record: VerificationRecord,
  method: VerificationMethod,
  now: string,
): VerificationResult {
  const doc = record.document;
  return {
    status: "verified",
    method,
    reference: record.reference,
    verifiedAt: now,
    headline: { en: "Verified record found", ar: "تم العثور على سجل موثّق" },
    documentInfo: docInfo(doc, doc.payment.iban),
    source: {
      state: "pass",
      detail: {
        en: `Issued by the verified business ${doc.business.name}.`,
        ar: `صادر عن المنشأة الموثّقة ${doc.business.name}.`,
      },
    },
    signature: {
      state: record.signature.valid ? "pass" : "fail",
      detail: {
        en: `Signed with ${record.signature.algorithm} (key ${record.signature.keyId}).`,
        ar: `موقّع باستخدام ${record.signature.algorithm} (المفتاح ${record.signature.keyId}).`,
      },
    },
    integrity: {
      state: "not_checked",
      detail: {
        en: "Your copy was not compared. Upload the document you received to check that it hasn't been modified.",
        ar: "لم تتم مقارنة نسختك. ارفع المستند الذي استلمته للتأكد من عدم تعديله.",
      },
    },
    indicators: [],
    explanation: {
      en: "This reference belongs to a genuine invoice. Compare the invoice number, total and the last four digits of the payment account with the copy you received — fraudsters can reuse a real QR code on a modified document.",
      ar: "هذا المرجع يعود لفاتورة حقيقية. قارن رقم الفاتورة والإجمالي وآخر أربعة أرقام من حساب الدفع مع النسخة التي استلمتها — فقد يعيد المحتالون استخدام رمز QR حقيقي على مستند معدّل.",
    },
    actions: [
      {
        en: "Check that the details above match your copy exactly.",
        ar: "تأكد من تطابق التفاصيل أعلاه مع نسختك تماماً.",
      },
      {
        en: "For a full integrity check, upload the received document.",
        ar: "لإجراء فحص سلامة كامل، ارفع المستند المستلم.",
      },
    ],
    demo: true,
  };
}

/** No matching record: inconclusive, never labelled as fraud. */
export function notVerified(method: VerificationMethod, reason: Bilingual, now: string, reference?: string): VerificationResult {
  return {
    status: "not_verified",
    method,
    reference,
    verifiedAt: now,
    headline: { en: "Not verified — no matching record", ar: "غير موثّق — لا يوجد سجل مطابق" },
    source: {
      state: "unknown",
      detail: {
        en: "The document could not be linked to a registered business profile.",
        ar: "تعذّر ربط المستند بملف منشأة مسجّلة.",
      },
    },
    signature: {
      state: "unknown",
      detail: { en: "No WETHAQ digital signature could be confirmed.", ar: "تعذّر تأكيد توقيع رقمي من وِثاق." },
    },
    integrity: {
      state: "not_checked",
      detail: { en: "There is no original version to compare against.", ar: "لا توجد نسخة أصلية للمقارنة بها." },
    },
    indicators: [],
    explanation: reason,
    actions: [
      {
        en: "This result is inconclusive — it does not mean the document is fraudulent.",
        ar: "هذه النتيجة غير حاسمة — ولا تعني أن المستند احتيالي.",
      },
      {
        en: "Confirm the document directly with the sender using contact details you already trust.",
        ar: "تأكد من المستند مباشرة مع المرسل عبر بيانات تواصل تثق بها مسبقاً.",
      },
      {
        en: "Ask the issuer whether the document was issued through WETHAQ and request its verification reference.",
        ar: "اسأل الجهة المُصدِرة إن كان المستند صادراً عبر وِثاق واطلب رقم مرجع التحقق.",
      },
    ],
    demo: true,
  };
}
