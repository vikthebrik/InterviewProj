-- Migration 06: Fix RLS policies to correctly check custom roles
-- Root cause: auth.jwt()->>'role' always returns 'authenticated' (Supabase built-in claim).
-- Custom roles (admin, root_admin, executive, reporter) are stored in raw_user_meta_data,
-- which appears in the JWT under 'user_metadata'. Use auth.jwt()->'user_metadata'->>'role'.

-- ─── reports ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can update report status" ON public.reports;
DROP POLICY IF EXISTS "Root admin views all reports"    ON public.reports;
DROP POLICY IF EXISTS "Root admin updates reports"      ON public.reports;

-- Admins can view all reports
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'root_admin')
  );

-- Admins can update report status
CREATE POLICY "Admins can update report status" ON public.reports
  FOR UPDATE USING (
    (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'root_admin')
  );

-- Executives can view all reports (no PII enforced in app layer)
DROP POLICY IF EXISTS "Executives can view all reports" ON public.reports;
CREATE POLICY "Executives can view all reports" ON public.reports
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role') = 'executive'
  );

-- ─── profiles ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins/Execs can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Root admin views all profiles"      ON public.profiles;

CREATE POLICY "Admins/Execs can view all profiles" ON public.profiles
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'root_admin', 'executive')
  );

-- ─── audit_logs ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can insert audit logs"     ON public.audit_logs;
DROP POLICY IF EXISTS "Admins/Execs can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Root admin views audit logs"      ON public.audit_logs;
DROP POLICY IF EXISTS "Root admin inserts audit logs"    ON public.audit_logs;

CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'root_admin')
  );

CREATE POLICY "Admins/Execs can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'root_admin', 'executive')
  );
