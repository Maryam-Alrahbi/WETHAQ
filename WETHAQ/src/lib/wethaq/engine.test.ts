import { describe, expect, it } from "vitest";
import { demoProfile, demoRecords, modifiedInvoice, originalInvoice, SAMPLE_REFERENCE } from "./demo-data";
import { notVerified, verifyDocument, verifyReferenceOnly } from "./engine";

const record = demoRecords.find((r) => r.reference === SAMPLE_REFERENCE)!;
const NOW = "2026-11-17T09:00:00Z";

describe("WETHAQ verification rules", () => {
  it("marks the original invoice as verified", () => {
    const result = verifyDocument(originalInvoice, record, demoProfile, "upload", NOW);
    expect(result.status).toBe("verified");
    expect(result.integrity.state).toBe("pass");
    expect(result.indicators).toHaveLength(0);
  });

  it("flags the modified invoice as a warning because the payment account changed", () => {
    const result = verifyDocument(modifiedInvoice, record, demoProfile, "upload", NOW);
    expect(result.status).toBe("warning");
    expect(result.headline.en).toBe("Warning — document modification detected");
    expect(result.integrity.state).toBe("fail");
    expect(result.indicators.map((i) => i.id)).toContain("payment-changed");
    expect(result.explanation.en).toContain(
      "The payment account information in this document differs from the original verified invoice.",
    );
    expect(result.actions[0].en).toBe(
      "Contact the issuing business using its official contact information before making any payment.",
    );
  });

  it("flags a changed total even when the payment account is untouched", () => {
    const tampered = { ...originalInvoice, lines: [{ description: "x", quantity: 1, unitPrice: 1 }] };
    const result = verifyDocument(tampered, record, demoProfile, "upload", NOW);
    expect(result.status).toBe("warning");
    expect(result.indicators.map((i) => i.id)).toContain("amount-changed");
  });

  it("never calls a document without a record fraudulent", () => {
    const result = notVerified("upload", { en: "none", ar: "none" }, NOW);
    expect(result.status).toBe("not_verified");
    expect(result.actions[0].en).toContain("does not mean the document is fraudulent");
  });

  it("does not claim integrity was checked for a reference-only lookup", () => {
    const result = verifyReferenceOnly(record, "qr", NOW);
    expect(result.integrity.state).toBe("not_checked");
  });

  it("only shows the last four digits of the payment account", () => {
    const result = verifyReferenceOnly(record, "reference", NOW);
    expect(result.documentInfo?.maskedAccount).toBe("OM•• •••• •••• 4821");
  });
});
