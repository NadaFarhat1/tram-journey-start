import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Lets people sign in with either an email address or a phone number.
 * Returns the email address tied to the account, or null when nothing matches.
 */
export const resolveLoginEmail = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ identifier: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const identifier = data.identifier.trim();
    if (identifier.includes("@")) return { email: identifier };

    const digits = digitsOnly(identifier);
    if (digits.length < 5) return { email: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("profiles")
      .select("email, phone")
      .neq("phone", "");

    const match = (rows ?? []).find((row) => {
      const rowDigits = digitsOnly(row.phone ?? "");
      return rowDigits.length > 0 && (rowDigits === digits || rowDigits.endsWith(digits));
    });

    return { email: match?.email ?? null };
  });

function makeProjectCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ name: z.string().trim().min(1).max(200).regex(/^[A-Za-z][A-Za-z0-9]*$/) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
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

    const { error } = await context.supabase
      .from("projects")
      .insert({ name: data.name, project_id: code, leader_id: context.userId });

    if (error) throw new Error(error.message);

    await context.supabase
      .from("profiles")
      .update({ setup_complete: true })
      .eq("id", context.userId);

    return { projectId: code };
  });

export const joinProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ projectId: z.string().trim().min(1).max(100) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id")
      .ilike("project_id", data.projectId)
      .maybeSingle();

    if (!project) return { ok: false as const };

    const { data: existing } = await context.supabase
      .from("project_members")
      .select("id")
      .eq("project_uuid", project.id)
      .eq("user_id", context.userId)
      .maybeSingle();

    if (!existing) {
      const { error } = await context.supabase
        .from("project_members")
        .insert({ project_uuid: project.id, user_id: context.userId });
      if (error) throw new Error(error.message);
    }

    await context.supabase
      .from("profiles")
      .update({ setup_complete: true })
      .eq("id", context.userId);

    return { ok: true as const };
  });
