-- Migration 07: Add officer assignment to reports
-- Allows admins to assign a specific officer to each report for dispatch tracking.

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON public.reports(assigned_to);

-- Admins can update the assigned_to field
-- (covered by existing "Admins can update report status" policy which allows all UPDATE)
