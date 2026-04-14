import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  generateInvoiceNumber,
  isValidEmail,
  validateUploadedFile,
  escapeHtml,
} from "@/lib/utils";

// ─── formatCurrency ───────────────────────────────────────────────────────────
// en-ZA locale format varies by OS (e.g. "R2 500,00" vs "R2,500.00").
// We test the semantic contract: correct Rand prefix, correct digit content,
// and always two decimal places — not locale-specific punctuation.

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

describe("formatCurrency", () => {
  it("always starts with the R prefix", () => {
    expect(formatCurrency(0)).toMatch(/^R/);
    expect(formatCurrency(250000)).toMatch(/^R/);
  });

  it("divides by 100 to produce Rands — zero cents", () => {
    // 0 cents → R0.00  digits: "000"
    expect(digits(formatCurrency(0))).toBe("000");
  });

  it("divides by 100 — 1 cent", () => {
    // 1 cent → R0.01  digits: "001"
    expect(digits(formatCurrency(1))).toBe("001");
  });

  it("divides by 100 — 99 cents", () => {
    // 99 cents → R0.99  digits: "099"
    expect(digits(formatCurrency(99))).toBe("099");
  });

  it("divides by 100 — 250 000 cents = R2 500", () => {
    // 250000 cents → R2500.00  digits: "250000"
    expect(digits(formatCurrency(250000))).toBe("250000");
  });

  it("always includes exactly two decimal digits", () => {
    // Strip everything except the last group of digits (after decimal separator)
    const result = formatCurrency(100);
    // The string ends with two decimal digits (locale sep + 2 digits)
    expect(result).toMatch(/\d{2}$/);
  });
});

// ─── generateInvoiceNumber ───────────────────────────────────────────────────

describe("generateInvoiceNumber", () => {
  const year = new Date().getFullYear();

  it("pads sequence 1 to three digits", () => {
    expect(generateInvoiceNumber(1)).toBe(`INV-${year}-001`);
  });

  it("pads sequence 42 to three digits", () => {
    expect(generateInvoiceNumber(42)).toBe(`INV-${year}-042`);
  });

  it("does not pad three-digit sequence", () => {
    expect(generateInvoiceNumber(100)).toBe(`INV-${year}-100`);
  });

  it("allows overflow beyond three digits", () => {
    expect(generateInvoiceNumber(1234)).toBe(`INV-${year}-1234`);
  });
});

// ─── isValidEmail ────────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("accepts a standard email", () => {
    expect(isValidEmail("keenan@swiftdesignz.co.za")).toBe(true);
  });

  it("accepts a subdomain email", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  it("rejects email without @", () => {
    expect(isValidEmail("notanemail")).toBe(false);
  });

  it("rejects email with space", () => {
    expect(isValidEmail("foo bar@example.com")).toBe(false);
  });

  it("rejects email with missing domain part", () => {
    expect(isValidEmail("foo@")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

// ─── validateUploadedFile ────────────────────────────────────────────────────

function makeFile(name: string, type: string, sizeBytes: number): File {
  return new File(["x".repeat(sizeBytes)], name, { type });
}

describe("validateUploadedFile", () => {
  it("returns null for valid PDF", () => {
    expect(validateUploadedFile(makeFile("contract.pdf", "application/pdf", 1024))).toBeNull();
  });

  it("returns null for valid PNG", () => {
    expect(validateUploadedFile(makeFile("logo.png", "image/png", 512))).toBeNull();
  });

  it("returns null for valid JPEG", () => {
    expect(validateUploadedFile(makeFile("photo.jpg", "image/jpeg", 512))).toBeNull();
  });

  it("returns error for unsupported extension .js", () => {
    const result = validateUploadedFile(makeFile("script.js", "text/javascript", 100));
    expect(result).toBeTypeOf("string");
    expect(result).toBeTruthy();
  });

  it("returns error for unsupported MIME even with valid extension", () => {
    const result = validateUploadedFile(makeFile("file.pdf", "text/html", 100));
    expect(result).toBeTruthy();
  });

  it("returns error when file exceeds 10 MB", () => {
    const result = validateUploadedFile(makeFile("huge.pdf", "application/pdf", 11 * 1024 * 1024));
    expect(result).toBeTruthy();
    expect(result).toContain("10 MB");
  });
});

// ─── escapeHtml ──────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes <, >, &, quotes", () => {
    expect(escapeHtml('<img src="x" onerror=\'alert(1)\'>&')).toBe(
      "&lt;img src=&quot;x&quot; onerror=&#039;alert(1)&#039;&gt;&amp;"
    );
  });

  it("returns plain strings unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});
