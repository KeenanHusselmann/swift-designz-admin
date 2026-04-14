import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase server client — must be declared before the import that uses it
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Helper: build a fake Supabase client stub
function buildClient(user: object | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
  };
}

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws a redirect to /login when no session exists", async () => {
    vi.mocked(createClient).mockResolvedValueOnce(buildClient(null) as never);

    // redirect() in our setup mock throws Error("REDIRECT:<url>")
    await expect(requireAuth()).rejects.toThrow("REDIRECT:/login");
  });

  it("returns the authenticated user when a session exists", async () => {
    const mockUser = { id: "user-abc", email: "admin@swiftdesignz.co.za" };
    vi.mocked(createClient).mockResolvedValueOnce(buildClient(mockUser) as never);

    const user = await requireAuth();
    expect(user).toEqual(mockUser);
  });

  it("calls createClient exactly once per invocation", async () => {
    const mockUser = { id: "user-xyz", email: "test@test.com" };
    vi.mocked(createClient).mockResolvedValueOnce(buildClient(mockUser) as never);

    await requireAuth();
    expect(vi.mocked(createClient)).toHaveBeenCalledTimes(1);
  });
});
