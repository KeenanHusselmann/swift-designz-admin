import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Supabase admin client ────────────────────────────────────────────────
// The mock must be set up before the route module is imported.
const mockSingle = vi.fn().mockResolvedValue({ data: { id: "lead-test-1" }, error: null });

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: mockSingle })),
      })),
    })),
  })),
}));

import { OPTIONS, POST } from "@/app/api/leads/route";

// ── Request factory ───────────────────────────────────────────────────────────
function makePost(body: object, ip = "127.0.0.1"): Request {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const VALID_LEAD = { name: "Jane Doe", email: "jane@example.co.za", source: "quote_form" };

// ── OPTIONS — CORS preflight ──────────────────────────────────────────────────
describe("OPTIONS /api/leads", () => {
  it("returns 204 No Content", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
  });

  it("includes Access-Control-Allow-Origin header", async () => {
    const res = await OPTIONS();
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });

  it("allows POST and OPTIONS methods", async () => {
    const res = await OPTIONS();
    const methods = res.headers.get("Access-Control-Allow-Methods") ?? "";
    expect(methods).toContain("POST");
    expect(methods).toContain("OPTIONS");
  });
});

// ── POST /api/leads — validation ──────────────────────────────────────────────
describe("POST /api/leads — validation", () => {
  it("returns 400 when name is missing", async () => {
    const res = await POST(makePost({ email: "x@x.com" }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makePost({ name: "Test" }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makePost({ name: "Test", email: "not-an-email" }) as never);
    expect(res.status).toBe(400);
  });
});

// ── POST /api/leads — success ─────────────────────────────────────────────────
describe("POST /api/leads — success", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: { id: "lead-test-1" }, error: null });
  });

  it("returns 200 with id on valid submission", async () => {
    const res = await POST(makePost(VALID_LEAD, "203.0.113.1") as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("lead-test-1");
    expect(json.success).toBe(true);
  });

  it("propagates CORS headers on success", async () => {
    const res = await POST(makePost(VALID_LEAD, "203.0.113.2") as never);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });
});

// ── POST /api/leads — rate limiting ──────────────────────────────────────────
describe("POST /api/leads — rate limiting", () => {
  it("returns 429 after 5 requests from the same IP", async () => {
    // Use a unique IP not used by any other test to avoid rate limit bleed
    const ip = "10.111.222.33";
    for (let i = 0; i < 5; i++) {
      await POST(makePost(VALID_LEAD, ip) as never);
    }
    const res = await POST(makePost(VALID_LEAD, ip) as never);
    expect(res.status).toBe(429);
  });

  it("does not rate-limit a different IP", async () => {
    // Same test as above but from a different IP — should stay 200
    const res = await POST(makePost(VALID_LEAD, "10.111.222.34") as never);
    expect(res.status).toBe(200);
  });
});
