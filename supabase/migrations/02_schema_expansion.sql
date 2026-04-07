-- 1. Enums for constrained values
CREATE TYPE public.report_type AS ENUM ('incident', 'maintenance', 'hazard', 'other');
CREATE TYPE public.report_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');

-- 2. Alter existing columns to use enums
-- Drop materialized views that depend on these columns, then recreate after
DROP MATERIALIZED VIEW IF EXISTS public.mv_weekly_report_metrics;
DROP MATERIALIZED VIEW IF EXISTS public.mv_monthly_media_distribution;

-- Drop default first — PostgreSQL can't auto-cast a text default to an enum
ALTER TABLE public.reports ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.reports
  ALTER COLUMN type TYPE public.report_type USING type::public.report_type,
  ALTER COLUMN status TYPE public.report_status USING status::public.report_status;

ALTER TABLE public.reports ALTER COLUMN status SET DEFAULT 'pending'::public.report_status;

-- Recreate materialized views
CREATE MATERIALIZED VIEW public.mv_weekly_report_metrics AS
SELECT
    date_trunc('week', created_at) AS report_week,
    status,
    COUNT(*) AS total_reports
FROM public.reports
GROUP BY 1, 2;

CREATE MATERIALIZED VIEW public.mv_monthly_media_distribution AS
SELECT
    date_trunc('month', created_at) AS report_month,
    media_type,
    COUNT(*) AS total_media
FROM public.media_logs
GROUP BY 1, 2;

CREATE UNIQUE INDEX ON public.mv_weekly_report_metrics (report_week, status);
CREATE UNIQUE INDEX ON public.mv_monthly_media_distribution (report_month, media_type);

-- 3. Profiles table (one row per auth user, stores display name + role)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('reporter', 'admin', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Admins/execs can view all profiles
CREATE POLICY "Admins/Execs can view all profiles" ON public.profiles
    FOR SELECT USING (
        COALESCE((auth.jwt()->>'role')::text, '') IN ('admin', 'executive')
    );

-- 4. Trigger to auto-create a profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'reporter')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Audit logs table (tracks status changes on reports)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES auth.users(id),
    old_status public.report_status,
    new_status public.report_status NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can write audit logs
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        COALESCE((auth.jwt()->>'role')::text, '') = 'admin'
    );

-- Admins and execs can view audit logs
CREATE POLICY "Admins/Execs can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        COALESCE((auth.jwt()->>'role')::text, '') IN ('admin', 'executive')
    );

-- 6. Add RLS policy for admins to update report status
CREATE POLICY "Admins can update report status" ON public.reports
    FOR UPDATE USING (
        COALESCE((auth.jwt()->>'role')::text, '') = 'admin'
    );

-- 7. Enable Supabase Realtime on the reports table
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
