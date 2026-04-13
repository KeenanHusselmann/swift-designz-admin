import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format cents to Rand string — e.g. 250000 → "R2,500.00" */
export function formatCurrency(cents: number): string {
  const rand = cents / 100;
  return `R${rand.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a date string to readable format */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Generate an invoice number — e.g. "INV-2026-001" */
export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(sequence).padStart(3, "0")}`;
}

// ── Security utilities ───────────────────────────────────────────────────────

/** Basic email format validation */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Escape HTML special characters to prevent XSS in email templates */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

/** Max file size for uploads (10 MB) */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/** Allowed MIME types for file uploads */
export const ALLOWED_UPLOAD_MIMES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

/** Validate an uploaded file (type + size). Returns error string or null. */
export function validateUploadedFile(file: File): string | null {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const allowedExts = ["pdf", "png", "jpg", "jpeg", "webp"];
  if (!allowedExts.includes(ext)) return "Only PDF, PNG, JPG, and WebP files are allowed.";
  if (!ALLOWED_UPLOAD_MIMES.includes(file.type)) return "Invalid file type.";
  if (file.size > MAX_UPLOAD_SIZE) return "File must be under 10 MB.";
  return null;
}

/** Generate a secure random filename for uploads */
export function secureFileName(ext: string): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex}.${ext}`;
}
