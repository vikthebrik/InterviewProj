import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import ReportForm from './ReportForm';

export default async function ReporterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: reports } = await supabase
    .from('reports')
    .select('id, type, status, description, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-uo-paper">
      <header className="bg-uo-green text-white px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl">UO Reporting — Reporter</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-uo-yellow hover:underline">
            Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-uo-ink mb-4">Submit a Report</h2>
          <ReportForm userId={user.id} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-uo-ink mb-4">Your Reports</h2>
          {reports && reports.length > 0 ? (
            <div className="border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-uo-ledger text-uo-ink">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Date</th>
                    <th className="text-left px-4 py-2 font-medium">Type</th>
                    <th className="text-left px-4 py-2 font-medium">Status</th>
                    <th className="text-left px-4 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-600">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 capitalize">{r.type}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-uo-ledger text-uo-ink capitalize">
                          {r.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700 truncate max-w-xs">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No reports submitted yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
