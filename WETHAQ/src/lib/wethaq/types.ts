import type { Bilingual } from "@/lib/i18n";

export type PaymentDetails = {
  bankName: string;
  accountName: string;
  iban: string;
};

export type InvoiceLine = { description: string; quantity: number; unitPrice: number };

export type InvoiceDocument = {
  invoiceNumber: string;
  issueDate: string; // ISO date
  business: {
    name: string;
    registrationNumber: string;
    email: string;
    phone: string;
    domain: string;
  };
  customer: { name: string; contact: string };
  lines: InvoiceLine[];
  currency: string;
  payment: PaymentDetails;
};

/** Stored by WETHAQ when a business issues a document. Only the issuer sees the full document. */
export type VerificationRecord = {
  reference: string;
  document: InvoiceDocument;
  fingerprint: string;
  signature: { algorithm: string; keyId: string; signedAt: string; valid: boolean };
  businessVerified: boolean;
  checks: number;
};

export type VerificationStatus = "verified" | "warning" | "not_verified";
export type CheckState = "pass" | "fail" | "not_checked" | "unknown";
export type Severity = "high" | "medium" | "low";

export type RiskIndicator = {
  id: string;
  severity: Severity;
  title: Bilingual;
  detail: Bilingual;
};

export type VerificationMethod = "upload" | "reference" | "qr";

export type VerificationResult = {
  status: VerificationStatus;
  headline: Bilingual;
  method: VerificationMethod;
  reference?: string;
  verifiedAt: string;
  documentInfo?: {
    type: Bilingual;
    number: string;
    issuer: string;
    issueDate: string;
    total: number;
    currency: string;
    maskedAccount: string;
  };
  source: { state: CheckState; detail: Bilingual };
  signature: { state: CheckState; detail: Bilingual };
  integrity: { state: CheckState; detail: Bilingual };
  indicators: RiskIndicator[];
  explanation: Bilingual;
  actions: Bilingual[];
  demo: true;
};
