import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanupDuplicateAgents() {
  const { data, error } = await supabase
    .from("ai_agents")
    .select("id, name, created_at")
    .order("name")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch agents:", error.message);
    return;
  }

  console.log(`Found ${data.length} total agents:`);
  data.forEach((a) => console.log(`  ${a.name} — ${a.id} (${a.created_at})`));

  // Group by name, keep first (oldest), collect rest for deletion
  const seen = new Map<string, string>();
  const toDelete: string[] = [];

  for (const agent of data) {
    if (seen.has(agent.name)) {
      toDelete.push(agent.id);
    } else {
      seen.set(agent.name, agent.id);
    }
  }

  if (toDelete.length === 0) {
    console.log("\nNo duplicates found.");
    return;
  }

  console.log(`\nDeleting ${toDelete.length} duplicate(s)...`);
  const { error: delError } = await supabase
    .from("ai_agents")
    .delete()
    .in("id", toDelete);

  if (delError) {
    console.error("Delete failed:", delError.message);
  } else {
    console.log(`Deleted ${toDelete.length} duplicate agent(s). Done.`);
  }
}

cleanupDuplicateAgents().catch(console.error);
