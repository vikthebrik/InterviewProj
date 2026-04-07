import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import AdminTable from './AdminTable';
import ReportsCalendar from './ReportsCalendar';
import AdminTabs from './AdminTabs';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role as string | undefined;
  if (!user || (role !== 'admin' && role !== 'root_admin')) redirect('/login');

  const { data: reports } = await supabase
    .from('reports')
    .select('id, type, status, description, created_at, user_id, contact_name, contact_email, is_anonymous')
    .order('created_at', { ascending: false })
    .limit(200);

  const safeReports = reports ?? [];

  return (
    <div className="min-h-screen bg-uo-paper">
      <header className="bg-uo-green text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-xl">UO Reporting — Admin</h1>
          {role === 'root_admin' && (
            <span className="text-[10px] bg-uo-yellow text-uo-ink px-2 py-0.5 rounded font-bold tracking-widest uppercase">
              Root
            </span>
          )}
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-uo-yellow hover:underline">
            Sign Out
          </button>
        </form>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdminTabs
          tableContent={<AdminTable reports={safeReports} adminId={user.id} />}
          calendarContent={<ReportsCalendar reports={safeReports} />}
        />
      </main>
    </div>
  );
}
