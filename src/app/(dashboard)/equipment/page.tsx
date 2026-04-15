import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import KpiCard from "@/components/ui/KpiCard";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Package, DollarSign, Cpu, Key, Armchair } from "lucide-react";

const SUGGESTED_EQUIPMENT: { category: string; items: { name: string; purpose: string; estimatedCost: string }[] }[] = [
  {
    category: "Computing",
    items: [
      { name: "Development Laptop", purpose: "Primary workstation for development and design", estimatedCost: "R20,000 – R45,000" },
      { name: "Desktop Workstation", purpose: "High-performance rendering and heavy compilation tasks", estimatedCost: "R15,000 – R35,000" },
      { name: "External Monitor ×2", purpose: "Extended display for productivity and design work", estimatedCost: "R3,000 – R8,000 each" },
      { name: "External SSD / Backup Drive", purpose: "Project backups and portable file storage", estimatedCost: "R800 – R2,500" },
      { name: "USB-C Hub / Docking Station", purpose: "Connects peripherals to laptop via single cable", estimatedCost: "R600 – R2,000" },
    ],
  },
  {
    category: "Peripherals",
    items: [
      { name: "Mechanical Keyboard", purpose: "Ergonomic and fast typing for long coding sessions", estimatedCost: "R1,000 – R3,500" },
      { name: "Ergonomic Mouse", purpose: "Reduces wrist strain during extended use", estimatedCost: "R600 – R2,500" },
      { name: "Webcam (1080p+)", purpose: "Professional video calls and client meetings", estimatedCost: "R800 – R2,500" },
      { name: "USB Microphone / Headset", purpose: "Clear audio for calls, recordings, and training sessions", estimatedCost: "R700 – R4,000" },
      { name: "Drawing Tablet (Wacom)", purpose: "Precise design input for UI/UX and digital art", estimatedCost: "R1,500 – R6,000" },
    ],
  },
  {
    category: "Mobile",
    items: [
      { name: "Business Smartphone", purpose: "Client communication and mobile testing", estimatedCost: "R8,000 – R25,000" },
      { name: "Tablet / iPad", purpose: "Portable design reviews, presentations, and note-taking", estimatedCost: "R6,000 – R20,000" },
    ],
  },
  {
    category: "Networking",
    items: [
      { name: "Business Router (Wi-Fi 6)", purpose: "Fast, stable internet for the home office or studio", estimatedCost: "R2,000 – R6,000" },
      { name: "UPS Battery Backup", purpose: "Protects equipment and uptime during power cuts", estimatedCost: "R1,500 – R5,000" },
      { name: "NAS / Network Storage", purpose: "Centralised local file server and backup solution", estimatedCost: "R4,000 – R12,000" },
    ],
  },
  {
    category: "Software Licences",
    items: [
      { name: "Adobe Creative Cloud", purpose: "Industry-standard suite for design, video, and photography", estimatedCost: "R500 – R1,200/mo" },
      { name: "Figma (Pro seat)", purpose: "UI/UX design, prototyping, and client handoffs", estimatedCost: "R350 – R700/mo" },
      { name: "Microsoft 365 Business", purpose: "Email, Word, Excel, Teams for business productivity", estimatedCost: "R250 – R600/mo" },
      { name: "GitHub Pro / Copilot", purpose: "Code repository, CI/CD, and AI coding assistant", estimatedCost: "R200 – R500/mo" },
      { name: "Project Management Tool", purpose: "Task tracking, sprints, and client project boards", estimatedCost: "R0 – R400/mo" },
    ],
  },
  {
    category: "Office",
    items: [
      { name: "Standing / Sit-Stand Desk", purpose: "Ergonomic workspace that supports long work sessions", estimatedCost: "R4,000 – R15,000" },
      { name: "Ergonomic Chair", purpose: "Lumbar support for hours of seated work", estimatedCost: "R3,000 – R12,000" },
      { name: "Printer / Scanner", purpose: "Contracts, invoices, and physical document handling", estimatedCost: "R1,500 – R5,000" },
      { name: "Ring Light / Studio Lighting", purpose: "Professional appearance in video calls and recordings", estimatedCost: "R500 – R2,500" },
      { name: "Whiteboard", purpose: "Visual planning, architecture diagrams, and brainstorming", estimatedCost: "R400 – R1,800" },
    ],
  },
];

export default async function EquipmentPage() {
  const supabase = await createClient();
  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .order("name");

  const activeItems = equipment?.filter((e) => e.status === "active") ?? [];
  const IT_CATEGORIES = ["computing", "peripherals", "mobile", "networking", "other"];
  const hardwareItems = (equipment ?? []).filter((e) => IT_CATEGORIES.includes(e.category));
  const officeItems = (equipment ?? []).filter((e) => e.category === "office");
  const softwareItems = (equipment ?? []).filter((e) => e.category === "software_licence");

  const totalAssetValue = activeItems.reduce((sum, e) => sum + (e.current_value ?? 0), 0);
  const hardwareValue = hardwareItems.filter((e) => e.status === "active").reduce((sum, e) => sum + (e.current_value ?? 0), 0);
  const officeValue = officeItems.filter((e) => e.status === "active").reduce((sum, e) => sum + (e.current_value ?? 0), 0);
  const softwareValue = softwareItems.filter((e) => e.status === "active").reduce((sum, e) => sum + (e.current_value ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Equipment Registry"
        description="Track company assets, hardware, and software licences"
        actions={
          <Link
            href="/equipment/new"
            className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Equipment
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Asset Value"
          value={formatCurrency(totalAssetValue)}
          subtitle={`${activeItems.length} active items`}
          icon={DollarSign}
        />
        <KpiCard
          title="IT Hardware Value"
          value={formatCurrency(hardwareValue)}
          subtitle={`${hardwareItems.length} items`}
          icon={Cpu}
        />
        <KpiCard
          title="Office Equipment Value"
          value={formatCurrency(officeValue)}
          subtitle={`${officeItems.length} items`}
          icon={Armchair}
        />
        <KpiCard
          title="Software Licences Value"
          value={formatCurrency(softwareValue)}
          subtitle={`${softwareItems.length} licences`}
          icon={Key}
        />
      </div>

      {/* IT Hardware Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={15} className="text-teal" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">IT Hardware</h2>
          <span className="text-xs text-gray-500 ml-1">({hardwareItems.length} items)</span>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hardwareItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">
                      No hardware added yet.
                    </td>
                  </tr>
                ) : (
                  hardwareItems.map((item) => (
                    <tr key={item.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        {(item.brand || item.model) && (
                          <div className="text-xs text-gray-400 mt-0.5">{[item.brand, item.model].filter(Boolean).join(" ")}</div>
                        )}
                        {item.serial_number && (
                          <div className="text-xs text-gray-500 mt-0.5">S/N: {item.serial_number}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400 capitalize">{item.category.replace("_", " ")}</td>
                      <td className="px-5 py-3 text-sm text-gray-400 capitalize">{item.condition}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{formatCurrency(item.purchase_price)}</td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(item.current_value)}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/equipment/${item.id}/edit`} className="text-xs text-gray-500 hover:text-teal transition-colors">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Office Equipment Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Armchair size={15} className="text-teal" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Office Equipment</h2>
          <span className="text-xs text-gray-500 ml-1">({officeItems.length} items)</span>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {officeItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      No office equipment added yet.
                    </td>
                  </tr>
                ) : (
                  officeItems.map((item) => (
                    <tr key={item.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        {(item.brand || item.model) && (
                          <div className="text-xs text-gray-400 mt-0.5">{[item.brand, item.model].filter(Boolean).join(" ")}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400 capitalize">{item.condition}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{formatCurrency(item.purchase_price)}</td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(item.current_value)}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/equipment/${item.id}/edit`} className="text-xs text-gray-500 hover:text-teal transition-colors">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Office Equipment Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Armchair size={15} className="text-teal" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Office Equipment</h2>
          <span className="text-xs text-gray-500 ml-1">({officeItems.length} items)</span>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {officeItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      No office equipment added yet.
                    </td>
                  </tr>
                ) : (
                  officeItems.map((item) => (
                    <tr key={item.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        {(item.brand || item.model) && (
                          <div className="text-xs text-gray-400 mt-0.5">{[item.brand, item.model].filter(Boolean).join(" ")}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400 capitalize">{item.condition}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{formatCurrency(item.purchase_price)}</td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(item.current_value)}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/equipment/${item.id}/edit`} className="text-xs text-gray-500 hover:text-teal transition-colors">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Software Licences Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Key size={15} className="text-teal" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Software Licences</h2>
          <span className="text-xs text-gray-500 ml-1">({softwareItems.length} items)</span>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {softwareItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                      No software licences added yet.
                    </td>
                  </tr>
                ) : (
                  softwareItems.map((item) => (
                    <tr key={item.id} className="hover:bg-card transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 mt-0.5">{item.notes}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">{formatCurrency(item.purchase_price)}</td>
                      <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(item.current_value)}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/equipment/${item.id}/edit`} className="text-xs text-gray-500 hover:text-teal transition-colors">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Suggested Equipment */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Package size={18} className="text-teal" />
          <h2 className="text-base font-semibold text-foreground">Suggested Equipment for a Software & Design Business</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          A reference guide to help you identify assets worth acquiring or tracking. Prices are approximate South African market estimates.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {SUGGESTED_EQUIPMENT.map((section) => (
            <div key={section.category} className="glass-card p-5">
              <h3 className="text-xs font-semibold text-teal uppercase tracking-wider mb-3">{section.category}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.purpose}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{item.estimatedCost}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
