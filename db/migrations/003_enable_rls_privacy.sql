-- Privacy: enable Row Level Security so the public anon key cannot
-- read other customers' tickets. Application APIs use the service role
-- and filter customer queries by session email.

ALTER TABLE IF EXISTS public.support_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_anon_select" ON public.support_requests;
DROP POLICY IF EXISTS "deny_authenticated_select" ON public.support_requests;
DROP POLICY IF EXISTS "customers_select_own_by_email" ON public.support_requests;
DROP POLICY IF EXISTS "no_direct_client_writes" ON public.support_requests;

-- Direct client access is denied. All reads/writes go through Next.js
-- route handlers that enforce customer vs admin sessions.
CREATE POLICY "deny_anon_select"
  ON public.support_requests
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "deny_authenticated_select"
  ON public.support_requests
  FOR SELECT
  TO authenticated
  USING (false);

REVOKE INSERT, UPDATE, DELETE ON public.support_requests FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS support_requests_email_idx
  ON public.support_requests (lower(email));
