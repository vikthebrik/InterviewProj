import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportsCalendar from '../admin/ReportsCalendar';
import AdminTabs from '../admin/AdminTabs';

export default async function ExecutivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'executive') redirect('/login');

  const [{ data: reports }, { data: weeklyMetrics }] = await Promise.all([
    supabase.from('reports').select('id, type, status, description, created_at, contact_name, is_anonymous'),
    supabase.from('mv_weekly_report_metrics').select('report_week, status, total_reports').order('report_week', { ascending: false }).limit(20),
  ]);

  const safeReports = reports ?? [];

  // Aggregate counts by status
  const counts = safeReports.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: 'Pending',      value: counts['pending']      ?? 0, color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { label: 'Under Review', value: counts['under_review'] ?? 0, color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { label: 'Resolved',     value: counts['resolved']     ?? 0, color: 'bg-green-50 border-green-200 text-green-800' },
    { label: 'Dismissed',    value: counts['dismissed']    ?? 0, color: 'bg-gray-50 border-gray-200 text-gray-600' },
  ];

  const chartData = Object.values(
    (weeklyMetrics ?? []).reduce<Record<string, Record<string, unknown>>>((acc, row) => {
      const week = new Date(row.report_week as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[week]) acc[week] = { week };
      acc[week][row.status as string] = row.total_reports;
      return acc;
    }, {})
  ).reverse();

  const dashboardContent = (
    <section>
      <div className="bg-white border border-gray-200 rounded-sm p-4" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="pending"      fill="#FEE123" name="Pending" />
            <Bar dataKey="under_review" fill="#60a5fa" name="Under Review" />
            <Bar dataKey="resolved"     fill="#004F2D" name="Resolved" />
            <Bar dataKey="dismissed"    fill="#9ca3af" name="Dismissed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-uo-paper">
      <header className="bg-uo-green text-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl">UO Reporting — Executive Dashboard</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-uo-yellow hover:underline">Sign Out</button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Status summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <div key={c.label} className={`border rounded-sm p-4 ${c.color}`}>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs mt-1 font-medium">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs: chart vs calendar */}
        <AdminTabs
          tableContent={dashboardContent}
          calendarContent={<ReportsCalendar reports={safeReports} />}
          tableLabel="Weekly Trends"
        />
      </main>
    </div>
  );
}
