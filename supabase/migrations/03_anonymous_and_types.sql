-- 1. Expand report_type enum with safety/crime categories
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'noise_complaint';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'medical_emergency';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'suspicious_activity';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'vandalism';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'theft';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'fire_hazard';
ALTER TYPE public.report_type ADD VALUE IF NOT EXISTS 'harassment';

-- 2. Add contact + anonymous fields to reports
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS contact_name  TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS is_anonymous  BOOLEAN NOT NULL DEFAULT false;

-- user_id is already nullable — anonymous reports just leave it NULL.

-- 3. Allow root_admin role in profiles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('reporter', 'admin', 'executive', 'root_admin'));

-- 4. RLS: anonymous (unauthenticated) users can INSERT reports with no user_id
CREATE POLICY "Anonymous users can submit reports" ON public.reports
  FOR INSERT WITH CHECK (user_id IS NULL AND is_anonymous = true);

-- 5. RLS: root_admin can do everything admin can
CREATE POLICY "Root admin views all reports" ON public.reports
  FOR SELECT USING (
    COALESCE((auth.jwt()->>'role')::text, '') = 'root_admin'
  );

CREATE POLICY "Root admin updates reports" ON public.reports
  FOR UPDATE USING (
    COALESCE((auth.jwt()->>'role')::text, '') = 'root_admin'
  );

CREATE POLICY "Root admin views all profiles" ON public.profiles
  FOR SELECT USING (
    COALESCE((auth.jwt()->>'role')::text, '') = 'root_admin'
  );

CREATE POLICY "Root admin views audit logs" ON public.audit_logs
  FOR SELECT USING (
    COALESCE((auth.jwt()->>'role')::text, '') = 'root_admin'
  );

CREATE POLICY "Root admin inserts audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    COALESCE((auth.jwt()->>'role')::text, '') = 'root_admin'
  );
