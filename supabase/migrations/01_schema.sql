-- 1. Create Reports Table
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Media Logs Table
CREATE TABLE public.media_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL,
    bucket_path TEXT NOT NULL,
    thumbnail_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Row Level Security Policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_logs ENABLE ROW LEVEL SECURITY;

-- Reporter can select/insert their own reports
CREATE POLICY "Reporters can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Reporters can insert reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins and Executives can view all reports (Using custom claims)
CREATE POLICY "Admins/Execs view all reports" ON public.reports
    FOR SELECT USING (
        COALESCE((auth.jwt()->>'role')::text, '') IN ('admin', 'executive')
    );

-- 4. Materialized Views for Analytics
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

-- Index for Mat Views
CREATE UNIQUE INDEX ON public.mv_weekly_report_metrics (report_week, status);
CREATE UNIQUE INDEX ON public.mv_monthly_media_distribution (report_month, media_type);
