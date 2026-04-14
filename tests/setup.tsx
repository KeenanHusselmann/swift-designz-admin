import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// ── Next.js navigation ───────────────────────────────────────────────────────
// redirect() normally throws an internal Next.js error — we throw a plain Error
// so tests can assert on it with rejects.toThrow("REDIRECT:/login")
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// ── next/link → plain <a> for snapshot rendering ─────────────────────────────
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => React.createElement("a", { href, className, ...rest }, children),
}));

// ── next/headers — not available outside Next.js runtime ─────────────────────
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn(), delete: vi.fn() })),
  headers: vi.fn(() => ({ get: vi.fn() })),
}));
