// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StatusBadge from "@/components/ui/StatusBadge";

// Test key variants that cover different badge colour classes
const VARIANTS = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "active",
  "draft",
  "sent",
  "paid",
  "partial",
  "overdue",
  "planning",
  "in_progress",
  "completed",
  "cancelled",
  "prospective",
  "exited",
  "unknown_status", // falls back to badge-draft
] as const;

describe("StatusBadge snapshots", () => {
  for (const status of VARIANTS) {
    it(`renders "${status}" variant`, () => {
      const { container } = render(<StatusBadge status={status} />);
      expect(container).toMatchSnapshot();
    });
  }

  it("replaces underscores with spaces in label", () => {
    const { getByText } = render(<StatusBadge status="in_progress" />);
    expect(getByText("in progress")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatusBadge status="active" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
