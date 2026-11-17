import type { Bilingual } from "@/lib/i18n";
import { fingerprint } from "./fingerprint";
import type { InvoiceDocument, PaymentDetails, VerificationRecord } from "./types";

/** All data in this file is simulated for the WETHAQ demonstration. */

export type ProfileField = {
  key: "name" | "registrationNumber" | "email" | "phone" | "website" | "domain";
  value: string;
  verified: boolean;
};

export type ApprovedAccount = PaymentDetails & { id: string; verified: boolean; addedAt: string };

export type BusinessProfile = {
  fields: ProfileField[];
  accounts: ApprovedAccount[];
  verificationStatus: "verified" | "pending";
};

export const demoProfile: BusinessProfile = {
  verificationStatus: "verified",
  fields: [
    { key: "name", value: "Al Noor Trading LLC", verified: true },
    { key: "registrationNumber", value: "CR 1234567 (sample)", verified: true },
    { key: "email", value: "accounts@alnoortrading.om", verified: true },
    { key: "phone", value: "+968 9000 0000 (sample)", verified: true },
    { key: "website", value: "https://alnoortrading.om", verified: true },
    { key: "domain", value: "alnoortrading.om", verified: true },
  ],
  accounts: [
    {
      id: "acc-1",
      bankName: "Muscat Commercial Bank (sample)",
      accountName: "Al Noor Trading LLC",
      iban: "OM81 0270 0000 1234 5678 4821",
      verified: true,
      addedAt: "2026-03-02",
    },
  ],
};

const business = {
  name: "Al Noor Trading LLC",
  registrationNumber: "CR 1234567 (sample)",
  email: "accounts@alnoortrading.om",
  phone: "+968 9000 0000 (sample)",
  domain: "alnoortrading.om",
};

const approvedPayment: PaymentDetails = {
  bankName: demoProfile.accounts[0].bankName,
  accountName: demoProfile.accounts[0].accountName,
  iban: demoProfile.accounts[0].iban,
};

export const SAMPLE_REFERENCE = "WTQ-7F3K-0148";

export const originalInvoice: InvoiceDocument = {
  invoiceNumber: "INV-2026-0148",
  issueDate: "2026-11-10",
  business,
  customer: { name: "Gulf Horizon Logistics", contact: "procurement@gulfhorizon.example" },
  lines: [
    { description: "Office network installation", quantity: 1, unitPrice: 1850 },
    { description: "Annual maintenance contract", quantity: 1, unitPrice: 640 },
    { description: "Cat6 cabling (per point)", quantity: 24, unitPrice: 12.5 },
  ],
  currency: "OMR",
  payment: approvedPayment,
};

/** The tampered copy from the demonstration scenario: payment account and contact email changed. */
export const modifiedInvoice: InvoiceDocument = {
  ...originalInvoice,
  business: { ...business, email: "accounts@alnoor-tradlng.com" },
  payment: {
    bankName: "Coastal Savings Bank",
    accountName: "Al Noor Trading",
    iban: "OM43 0510 0000 7788 1100 9907",
  },
};

function makeRecord(
  reference: string,
  doc: InvoiceDocument,
  checks: number,
): VerificationRecord {
  return {
    reference,
    document: doc,
    fingerprint: fingerprint(doc),
    signature: {
      algorithm: "ECDSA P-256 / SHA-256",
      keyId: "alnoor-signing-key-01",
      signedAt: `${doc.issueDate}T09:30:00Z`,
      valid: true,
    },
    businessVerified: true,
    checks,
  };
}

const seedInvoice = (
  invoiceNumber: string,
  issueDate: string,
  customer: string,
  contact: string,
  description: string,
  quantity: number,
  unitPrice: number,
): InvoiceDocument => ({
  ...originalInvoice,
  invoiceNumber,
  issueDate,
  customer: { name: customer, contact },
  lines: [{ description, quantity, unitPrice }],
});

export const demoRecords: VerificationRecord[] = [
  makeRecord(SAMPLE_REFERENCE, originalInvoice, 7),
  makeRecord(
    "WTQ-2M9Q-0147",
    seedInvoice("INV-2026-0147", "2026-11-04", "Sohar Fresh Markets", "finance@soharfresh.example", "POS terminals supply", 6, 145),
    3,
  ),
  makeRecord(
    "WTQ-8JD2-0146",
    seedInvoice("INV-2026-0146", "2026-10-27", "Nizwa Dental Clinic", "admin@nizwadental.example", "IT support retainer (October)", 1, 420),
    2,
  ),
  makeRecord(
    "WTQ-5RT7-0145",
    seedInvoice("INV-2026-0145", "2026-10-15", "Salalah Hospitality Group", "ap@salalahhg.example", "Wi-Fi access points", 18, 96),
    5,
  ),
  makeRecord(
    "WTQ-1KX4-0144",
    seedInvoice("INV-2026-0144", "2026-09-30", "Gulf Horizon Logistics", "procurement@gulfhorizon.example", "Server rack and UPS", 1, 2310),
    4,
  ),
  makeRecord(
    "WTQ-9PL3-0143",
    seedInvoice("INV-2026-0143", "2026-09-12", "Muttrah Books & Co.", "owner@muttrahbooks.example", "Laptop configuration", 8, 35),
    1,
  ),
];

export type ActivityItem = { id: string; date: string; tone: "verified" | "warning" | "info"; text: Bilingual };

export const demoActivity: ActivityItem[] = [
  {
    id: "a1",
    date: "2026-11-16T14:12:00Z",
    tone: "warning",
    text: {
      en: "A modified copy of INV-2026-0148 was checked — payment details did not match.",
      ar: "تم فحص نسخة معدّلة من INV-2026-0148 — بيانات الدفع غير مطابقة.",
    },
  },
  {
    id: "a2",
    date: "2026-11-15T10:05:00Z",
    tone: "verified",
    text: {
      en: "INV-2026-0148 was verified by a recipient via QR code.",
      ar: "تم التحقق من INV-2026-0148 من قبل المستلم عبر رمز QR.",
    },
  },
  {
    id: "a3",
    date: "2026-11-10T09:30:00Z",
    tone: "info",
    text: { en: "INV-2026-0148 issued and digitally signed.", ar: "تم إصدار INV-2026-0148 وتوقيعها رقمياً." },
  },
  {
    id: "a4",
    date: "2026-11-05T08:47:00Z",
    tone: "verified",
    text: { en: "INV-2026-0147 verified by Sohar Fresh Markets.", ar: "تم التحقق من INV-2026-0147 من قبل أسواق صحار الطازجة." },
  },
];
