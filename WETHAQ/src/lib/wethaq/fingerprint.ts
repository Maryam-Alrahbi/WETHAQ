import type { InvoiceDocument } from "./types";

/** Stable serialisation so the same content always produces the same fingerprint. */
export function canonicalize(doc: InvoiceDocument): string {
  const sortKeys = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === "object") {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = sortKeys((value as Record<string, unknown>)[key]);
          return acc;
        }, {});
    }
    return value;
  };
  return JSON.stringify(sortKeys(doc));
}

/**
 * Demo fingerprint (two FNV-1a passes → 128-bit hex). Production integrity checks must use
 * SHA-256 over the signed file plus a real digital signature verified against the issuer's key.
 */
export function fingerprint(doc: InvoiceDocument): string {
  const text = canonicalize(doc);
  const pass = (seed: number) => {
    let h = seed >>> 0;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  };
  return [0x811c9dc5, 0x2c9277b5, 0x9e3779b9, 0x7f4a7c15].map(pass).join("");
}

export function invoiceTotal(doc: Pick<InvoiceDocument, "lines">): number {
  return Math.round(doc.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0) * 1000) / 1000;
}

export function maskAccount(iban: string): string {
  const compact = iban.replace(/\s+/g, "");
  return `${compact.slice(0, 2)}•• •••• •••• ${compact.slice(-4)}`;
}

export function domainOf(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}
