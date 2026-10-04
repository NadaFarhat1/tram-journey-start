CREATE TABLE public.project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_ref text NOT NULL,
  project_name text NOT NULL,
  email text NOT NULL,
  inviter_id uuid NOT NULL,
  inviter_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.project_invitations TO authenticated;
GRANT ALL ON public.project_invitations TO service_role;
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inviters read own invitations" ON public.project_invitations FOR SELECT TO authenticated USING (inviter_id = auth.uid());
CREATE POLICY "Inviters create invitations" ON public.project_invitations FOR INSERT TO authenticated WITH CHECK (inviter_id = auth.uid());