import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type WorkspaceProjectRow = {
  id: string;
  name: string;
  projectId: string;
  startDate: string | null;
  deadline: string | null;
  createdAt: string;
};

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WorkspaceProjectRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: memberships } = await supabaseAdmin
      .from("project_members")
      .select("project_uuid")
      .eq("user_id", context.userId);

    const ids = (memberships ?? []).map((row) => row.project_uuid);

    const { data: led } = await supabaseAdmin
      .from("projects")
      .select("id, name, project_id, start_date, deadline, created_at")
      .eq("leader_id", context.userId);

    const rows = [...(led ?? [])];

    if (ids.length > 0) {
      const { data: joined } = await supabaseAdmin
        .from("projects")
        .select("id, name, project_id, start_date, deadline, created_at")
        .in("id", ids);
      for (const row of joined ?? []) {
        if (!rows.some((existing) => existing.id === row.id)) rows.push(row);
      }
    }

    return rows
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((row) => ({
        id: row.id,
        name: row.name,
        projectId: row.project_id,
        startDate: row.start_date,
        deadline: row.deadline,
        createdAt: row.created_at,
      }));
  });

function makeProjectCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export const createWorkspaceProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        name: z.string().trim().min(1).max(200),
        startDate: z.string().max(20).optional(),
        deadline: z.string().max(20).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<WorkspaceProjectRow> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let code = makeProjectCode();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { data: existing } = await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("project_id", code)
        .maybeSingle();
      if (!existing) break;
      code = makeProjectCode();
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("projects")
      .insert({
        name: data.name,
        project_id: code,
        leader_id: context.userId,
        start_date: data.startDate || null,
        deadline: data.deadline || null,
      })
      .select("id, name, project_id, start_date, deadline, created_at")
      .single();

    if (error || !inserted) throw new Error(error?.message ?? "Could not create project");

    return {
      id: inserted.id,
      name: inserted.name,
      projectId: inserted.project_id,
      startDate: inserted.start_date,
      deadline: inserted.deadline,
      createdAt: inserted.created_at,
    };
  });
