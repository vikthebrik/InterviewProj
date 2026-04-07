import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import AdminOverview from './AdminOverview';
import AdminClientShell from './AdminClientShell';
import type { Officer, Report, WeeklyMetric } from './types';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role as string | undefined;

  const isAdmin    = role === 'admin' || role === 'root_admin';
  const isExec     = role === 'executive';
  if (!user || (!isAdmin && !isExec)) redirect('/login');

  const svc = createServiceClient();

  const [
    { data: reports },
    { data: weeklyMetrics },
    { data: profile },
    { data: officerProfiles },
  ] = await Promise.all([
    svc
      .from('reports')
      .select('id, type, status, description, created_at, user_id, contact_name, contact_email, is_anonymous, assigned_to')
      .order('created_at', { ascending: false })
      .limit(200),
    svc
      .from('mv_weekly_report_metrics')
      .select('report_week, status, total_reports')
      .order('report_week', { ascending: false })
      .limit(20),
    svc.from('profiles').select('display_name').eq('id', user.id).single(),
    // Officers = all admin/root_admin profiles (for dispatch roster)
    svc.from('profiles').select('id, display_name').in('role', ['admin', 'root_admin']),
  ]);

  const safeReports  = (reports ?? []) as Report[];
  const safeMetrics  = (weeklyMetrics ?? []) as WeeklyMetric[];
  const safeOfficers = (officerProfiles ?? []) as Officer[];
  const displayName  = profile?.display_name ?? user.email ?? 'Admin';
  const initials     = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const readOnly     = isExec; // executives get read-only board view, no PII

  return (
    <div className="min-h-screen bg-uo-paper">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-uo-green text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <span>UO Campus Safety</span>
              <span>/</span>
              <span className="text-white font-medium">
                {isExec ? 'Executive Overview' : 'Admin Dashboard'}
              </span>
            </div>
            {role === 'root_admin' && (
              <span className="text-[9px] bg-uo-yellow text-uo-ink px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                Root
              </span>
            )}
            {isExec && (
              <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                Read Only
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-sm px-3 py-1.5 text-sm">
              <span className="w-6 h-6 rounded-full bg-uo-yellow text-uo-ink flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </span>
              <span className="hidden sm:block text-sm">{displayName}</span>
            </div>
            <form action={logout}>
              <button type="submit" className="text-sm text-uo-yellow hover:underline">Sign Out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        <AdminOverview reports={safeReports} />
        <AdminClientShell
          initialReports={safeReports}
          weeklyMetrics={safeMetrics}
          officers={safeOfficers}
          adminId={user.id}
          readOnly={readOnly}
        />
      </main>
    </div>
  );
}
