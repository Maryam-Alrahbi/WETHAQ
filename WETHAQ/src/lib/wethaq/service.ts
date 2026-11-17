import type { Bilingual } from "@/lib/i18n";
import { modifiedInvoice, originalInvoice, SAMPLE_REFERENCE } from "./demo-data";
import { notVerified, verifyDocument, verifyReferenceOnly } from "./engine";
import { fingerprint } from "./fingerprint";
import { addActivity, getAllRecords, getProfile, saveIssuedRecord } from "./store";
import type { InvoiceDocument, VerificationMethod, VerificationRecord, VerificationResult } from "./types";

/**
 * Frontend/backend boundary. Every function here is async so it can be replaced by a server
 * function (OCR, AI analysis, signature verification, secure records) without touching the UI.
 * Today it runs entirely in the browser on simulated data.
 */

export class VerificationError extends Error {
  constructor(public readonly bilingual: Bilingual) {
    super(bilingual.en);
  }
}

export const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const ACCEPTED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

export function normalizeReference(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export function findRecord(reference: string): VerificationRecord | undefined {
  const ref = normalizeReference(reference);
  return getAllRecords().find((r) => r.reference === ref);
}

export function validateFile(file: File): Bilingual | null {
  const name = file.name.toLowerCase();
  const okType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.some((e) => name.endsWith(e));
  if (!okType) {
    return {
      en: "Unsupported file type. Please upload a PDF, PNG, JPG or JPEG file.",
      ar: "نوع الملف غير مدعوم. يرجى رفع ملف PDF أو PNG أو JPG أو JPEG.",
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { en: "The file is larger than 10 MB.", ar: "حجم الملف أكبر من 10 ميغابايت." };
  }
  if (file.size === 0) {
    return { en: "The file appears to be empty.", ar: "يبدو أن الملف فارغ." };
  }
  return null;
}

export async function verifyByReference(reference: string, method: VerificationMethod = "reference"): Promise<VerificationResult> {
  const ref = normalizeReference(reference);
  if (!/^WTQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(ref)) {
    throw new VerificationError({
      en: "That doesn't look like a WETHAQ reference. It should look like WTQ-7F3K-0148.",
      ar: "هذا لا يبدو كمرجع من وِثاق. يجب أن يكون بالشكل WTQ-7F3K-0148.",
    });
  }
  await wait(1800);
  const record = findRecord(ref);
  if (!record) {
    return notVerified(
      method,
      {
        en: "No verification record exists for this reference. The reference may be mistyped, or the document was not issued through WETHAQ.",
        ar: "لا يوجد سجل تحقق لهذا المرجع. قد يكون المرجع مكتوباً بشكل خاطئ، أو أن المستند لم يصدر عبر وِثاق.",
      },
      now(),
      ref,
    );
  }
  addActivity({ tone: "verified", text: { en: `${record.document.invoiceNumber} looked up by reference.`, ar: `تم البحث عن ${record.document.invoiceNumber} عبر المرجع.` } });
  return verifyReferenceOnly(record, method, now());
}

/** Demonstration scenario: verify the original or the tampered copy of INV-2026-0148. */
export async function verifySample(kind: "original" | "modified"): Promise<VerificationResult> {
  await wait(2600);
  const record = findRecord(SAMPLE_REFERENCE)!;
  const doc = kind === "original" ? originalInvoice : modifiedInvoice;
  const result = verifyDocument(doc, record, getProfile(), "upload", now());
  addActivity(
    result.status === "verified"
      ? { tone: "verified", text: { en: "INV-2026-0148 verified — original copy.", ar: "تم التحقق من INV-2026-0148 — النسخة الأصلية." } }
      : { tone: "warning", text: { en: "A modified copy of INV-2026-0148 was checked — payment details did not match.", ar: "تم فحص نسخة معدّلة من INV-2026-0148 — بيانات الدفع غير مطابقة." } },
  );
  return result;
}

/**
 * User-uploaded files: OCR, AI analysis and signature extraction need a connected backend, so
 * the demo can only report that no verification record could be matched.
 */
export async function verifyUploadedFile(file: File): Promise<VerificationResult> {
  const problem = validateFile(file);
  if (problem) throw new VerificationError(problem);
  await wait(2600);
  return notVerified(
    "upload",
    {
      en: `Demo mode: "${file.name}" could not be matched to a WETHAQ verification record. Real OCR, AI analysis and signature checks are not connected yet, so uploaded files can't be read. Try the sample invoices to see a full analysis.`,
      ar: `وضع العرض التوضيحي: تعذّر مطابقة "${file.name}" مع سجل تحقق في وِثاق. لم يتم ربط التعرّف الضوئي والتحليل الذكي وفحص التوقيع بعد، لذا لا يمكن قراءة الملفات المرفوعة. جرّب الفواتير النموذجية لرؤية تحليل كامل.`,
    },
    now(),
  );
}

export function generateReference(invoiceNumber: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const tail = invoiceNumber.replace(/[^A-Z0-9]/gi, "").slice(-4).toUpperCase().padStart(4, "0");
  return `WTQ-${rand}-${tail}`;
}

export async function issueInvoice(doc: InvoiceDocument): Promise<VerificationRecord> {
  await wait(1400);
  const record: VerificationRecord = {
    reference: generateReference(doc.invoiceNumber),
    document: doc,
    fingerprint: fingerprint(doc),
    signature: { algorithm: "ECDSA P-256 / SHA-256", keyId: "alnoor-signing-key-01", signedAt: now(), valid: true },
    businessVerified: getProfile().verificationStatus === "verified",
    checks: 0,
  };
  saveIssuedRecord(record);
  addActivity({ tone: "info", text: { en: `${doc.invoiceNumber} issued and digitally signed (demo).`, ar: `تم إصدار ${doc.invoiceNumber} وتوقيعها رقمياً (عرض توضيحي).` } });
  return record;
}
