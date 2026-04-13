import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const agents = [
  {
    name: "Analytics",
    purpose:
      "Analytics and reporting — spending charts, cost breakdowns, financial data, budget tracking, and cost projections.",
    model: "Claude Sonnet",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in employee-management project. Add new charts, spending reports, and analytics features.",
  },
  {
    name: "Data-Layer",
    purpose:
      "Data/backend specialist — SQLite database operations, data models, Provider state management, schema design, migrations, and CRUD operations.",
    model: "Claude Sonnet",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in employee-management project. Handles all data layer work including AppState synchronization.",
  },
  {
    name: "Flutter-UI",
    purpose:
      "Flutter UI specialist — building screens, widgets, dialogs, fixing UI bugs, Material 3 dark theme, responsive desktop layouts, and navigation.",
    model: "Claude Sonnet",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in employee-management project. Handles all Flutter UI/component work.",
  },
  {
    name: "Tester",
    purpose:
      "Testing specialist — writing and running Flutter widget and unit tests, test coverage, mocking patterns, and regression testing.",
    model: "Claude Sonnet",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in employee-management project. Handles test-driven development and verifying functionality.",
  },
  {
    name: "UI-UX Designer",
    purpose:
      "Expert UI/UX design critic — research-backed, opinionated design feedback citing Nielsen Norman Group studies. Avoids generic aesthetics and provides distinctive design direction.",
    model: "Claude Opus",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in employee-management project. Specialises in usability research and evidence-based design decisions.",
  },
  {
    name: "Swift Marketing & Branding",
    purpose:
      "Marketing and branding specialist for Swift Designz — social media posts, email signatures, ad copy, website copy, and brand assets following Swift Designz brand guidelines.",
    model: "Claude Opus",
    provider: "Anthropic/GitHub",
    monthly_cost: 17600,
    status: "active",
    config_notes:
      "Used in swift-designz-admin project. Strictly follows Swift Designz brand colours and tone.",
  },
];

async function seedAgents() {
  // Fetch existing names to avoid duplicates
  const { data: existing } = await supabase.from("ai_agents").select("name");
  const existingNames = new Set((existing || []).map((a) => a.name));

  const toInsert = agents.filter((a) => !existingNames.has(a.name));

  if (toInsert.length === 0) {
    console.log("All agents already exist — nothing to insert.");
    return;
  }

  console.log(`Seeding ${toInsert.length} agent(s)...`);

  for (const agent of toInsert) {
    const { data, error } = await supabase
      .from("ai_agents")
      .insert(agent)
      .select("id, name")
      .single();

    if (error) {
      console.error(`  ✗ ${agent.name}:`, error.message);
    } else {
      console.log(`  ✓ ${data.name} (${data.id})`);
    }
  }

  console.log("\nDone.");
}

seedAgents().catch(console.error);
