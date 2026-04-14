// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DollarSign, TrendingUp } from "lucide-react";
import KpiCard from "@/components/ui/KpiCard";

describe("KpiCard snapshots", () => {
  it("renders with required props only", () => {
    const { container } = render(
      <KpiCard title="Revenue" value="R12,500.00" icon={DollarSign} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with subtitle and trend up", () => {
    const { container } = render(
      <KpiCard
        title="Net Profit"
        value="R8,000.00"
        subtitle="This month"
        icon={TrendingUp}
        trend="up"
        trendValue="+12%"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with trend down", () => {
    const { container } = render(
      <KpiCard
        title="Expenses"
        value="R4,500.00"
        icon={TrendingUp}
        trend="down"
        trendValue="-5%"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with neutral trend", () => {
    const { container } = render(
      <KpiCard
        title="Invoices"
        value="14"
        icon={DollarSign}
        trend="neutral"
        trendValue="No change"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
