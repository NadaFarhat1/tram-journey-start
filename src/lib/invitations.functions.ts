import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type InvitationDetails = {
  id: string;
  projectName: string;
  inviterName: string;
  email: string;
};

export const createInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        projectRef: z.string().min(1).max(100),
        projectName: z.string().min(1).max(200),
        email: z.string().trim().toLowerCase().email().max(255),
        inviterName: z.string().trim().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { data: row, error } = await context.supabase
      .from("project_invitations")
      .insert({
        project_ref: data.projectRef,
        project_name: data.projectName,
        email: data.email,
        inviter_id: context.userId,
        inviter_name: data.inviterName,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not create invitation");
    return { id: row.id };
  });

/** Public lookup by unguessable invitation id; returns only display fields. */
export const getInvitation = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<InvitationDetails | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("project_invitations")
      .select("id, project_name, inviter_name, email")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return {
      id: row.id,
      projectName: row.project_name,
      inviterName: row.inviter_name,
      email: row.email,
    };
  });
