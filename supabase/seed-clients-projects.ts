// Seed script: Add clients and their projects
// Run: npx tsx supabase/seed-clients-projects.ts

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Parse .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex);
  const val = trimmed.slice(eqIndex + 1);
  process.env[key] = val;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const clientsData = [
  { name: "Rehoboth Community Trust", email: "info@rehobothcommunitytrust.org", company: "Rehoboth Community Trust" },
  { name: "Donny Dunn", email: "donny@dunmoretraining.co.za", company: "Dunmore Training" },
  { name: "Mariaan Basson", email: "mariaan@iaacademy.co.za", company: "IA Academy" },
  { name: "Karin Husselmann", email: "karin@tbfreefoundation.org", company: "TB Free Foundation" },
  { name: "Ruth Gwasira", email: "ruth@rubysfaithjewellery.co.za", company: "Ruby's Faith Jewellery" },
  { name: "Richenda Miller", email: "richenda@essential420.co.za", company: "Essential420" },
  { name: "Ambrose Isaacs", email: "ambrose@it-guru.online", company: "IT-Guru.Online" },
  { name: "Ancel Miller", email: "ancel@highlymedicated.co.za", company: "Highly Medicated" },
  { name: "Yvonne Steenkamp", email: "yvonne@fryse.co.za", company: "Fryse" },
];

const projectsMap: Record<string, { projectName: string; service: string }> = {
  "Rehoboth Community Trust": { projectName: "Rehoboth Community Trust", service: "Web Development" },
  "Dunmore Training": { projectName: "Dunmore Training", service: "Web Development" },
  "IA Academy": { projectName: "IA Academy", service: "Web Development" },
  "TB Free Foundation": { projectName: "TB Free Foundation", service: "Web Development" },
  "Ruby's Faith Jewellery": { projectName: "Ruby's Faith Jewellery Store", service: "E-Commerce" },
  "Essential420": { projectName: "Essential420", service: "Web Development" },
  "IT-Guru.Online": { projectName: "IT-Guru.Online", service: "Web Development" },
  "Highly Medicated": { projectName: "Highly Medicated", service: "Web Development" },
  "Fryse": { projectName: "Fryse", service: "Web Development" },
};

async function seed() {
  console.log("Inserting clients...");
  const { data: clients, error: clientErr } = await supabase
    .from("clients")
    .insert(clientsData)
    .select("id, company");

  if (clientErr) {
    console.error("Client insert failed:", clientErr.message);
    process.exit(1);
  }

  console.log(`Inserted ${clients.length} clients`);

  const projectRows = clients.map((c) => {
    const mapping = projectsMap[c.company!];
    return {
      client_id: c.id,
      name: mapping.projectName,
      service: mapping.service,
      status: "in_progress",
    };
  });

  console.log("Inserting projects...");
  const { data: projects, error: projErr } = await supabase
    .from("projects")
    .insert(projectRows)
    .select("id, name");

  if (projErr) {
    console.error("Project insert failed:", projErr.message);
    process.exit(1);
  }

  console.log(`Inserted ${projects.length} projects`);
  projects.forEach((p) => console.log(`  - ${p.name}`));
  console.log("Done!");
}

seed();
