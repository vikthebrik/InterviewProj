import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import type { Report } from '@/app/admin/types';
import ReporterFormSection from './ReporterFormSection';
import ReporterReportsTable from './ReporterReportsTable';

export default async function ReporterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: reports }, { data: profile }] = await Promise.all([
    supabase
      .from('reports')
      .select('id, type, status, description, created_at, user_id, contact_name, contact_email, is_anonymous')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('profiles').select('display_name').eq('id', user.id).single(),
  ]);

  const safeReports = (reports ?? []) as Report[];
  const displayName = profile?.display_name ?? user.email ?? 'Reporter';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const pending  = safeReports.filter((r) => r.status === 'pending').length;
  const resolved = safeReports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-uo-paper">
      <header className="bg-uo-green text-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest font-medium">UO Campus Safety</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-7 h-7 rounded-full bg-uo-yellow text-uo-ink flex items-center justify-center text-xs font-bold">
                {initials}
              </span>
              <h1 className="font-serif text-lg">{displayName}</h1>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-uo-yellow hover:underline">Sign Out</button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-7 space-y-7">
        {/* Stat chips */}
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 text-center min-w-[90px]">
            <p className="text-2xl font-bold font-serif text-uo-ink">{safeReports.length}</p>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-1">Submitted</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-sm px-4 py-3 text-center min-w-[90px]">
            <p className="text-2xl font-bold font-serif text-yellow-900">{pending}</p>
            <p className="text-[10px] uppercase tracking-wide text-yellow-700 mt-1">Pending</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3 text-center min-w-[90px]">
            <p className="text-2xl font-bold font-serif text-green-900">{resolved}</p>
            <p className="text-[10px] uppercase tracking-wide text-green-700 mt-1">Resolved</p>
          </div>
        </div>

        {/* Collapsible report form */}
        <ReporterFormSection userId={user.id} hasReports={safeReports.length > 0} />

        {/* Reports table */}
        <section>
          <h2 className="font-serif text-lg text-uo-ink mb-3">Your Reports</h2>
          <ReporterReportsTable reports={safeReports} />
        </section>
      </main>
    </div>
  );
}
