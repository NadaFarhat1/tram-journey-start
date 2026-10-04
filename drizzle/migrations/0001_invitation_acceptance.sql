ALTER TABLE public.project_invitations ALTER COLUMN inviter_id DROP NOT NULL;
ALTER TABLE public.project_invitations ADD COLUMN IF NOT EXISTS accepted_user_id uuid;
ALTER TABLE public.project_invitations ADD COLUMN IF NOT EXISTS accepted_name text;
ALTER TABLE public.project_invitations ADD COLUMN IF NOT EXISTS accepted_at timestamptz;
GRANT ALL ON public.project_invitations TO service_role;