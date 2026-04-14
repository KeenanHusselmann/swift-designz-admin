// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PageHeader from "@/components/ui/PageHeader";

describe("PageHeader snapshots", () => {
  it("renders with title only", () => {
    const { container } = render(<PageHeader title="Clients" />);
    expect(container).toMatchSnapshot();
  });

  it("renders with title and description", () => {
    const { container } = render(
      <PageHeader title="Invoices" description="Manage and track all invoices" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders backHref link when provided", () => {
    const { container, getByRole } = render(
      <PageHeader title="Invoice #001" backHref="/invoices" />
    );
    expect(container).toMatchSnapshot();
    // Back link should be present
    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/invoices");
  });

  it("does NOT render back link when backHref is omitted", () => {
    const { queryByRole } = render(<PageHeader title="Dashboard" />);
    expect(queryByRole("link")).toBeNull();
  });

  it("renders actions slot", () => {
    const { getByText, container } = render(
      <PageHeader
        title="Leads"
        actions={<button>Add Lead</button>}
      />
    );
    expect(container).toMatchSnapshot();
    expect(getByText("Add Lead")).toBeTruthy();
  });

  it("renders all props together", () => {
    const { container } = render(
      <PageHeader
        title="Client Detail"
        description="View and manage client"
        backHref="/clients"
        actions={<button>Edit</button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
