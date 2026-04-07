import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Auth check using session client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role as string | undefined;

  if (!user || (role !== 'admin' && role !== 'root_admin')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Data fetch using service client (bypasses RLS)
  const svc = createServiceClient();

  const { data, error } = await svc
    .from('audit_logs')
    .select('id, old_status, new_status, note, created_at, changed_by, profiles!audit_logs_changed_by_fkey ( display_name )')
    .eq('report_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback: try without the join if FK name is wrong
    const { data: plain, error: plainErr } = await svc
      .from('audit_logs')
      .select('id, old_status, new_status, note, created_at, changed_by')
      .eq('report_id', id)
      .order('created_at', { ascending: false });

    if (plainErr) return Response.json({ error: plainErr.message }, { status: 500 });
    return Response.json({ logs: plain ?? [] });
  }

  const logs = (data ?? []).map((log) => {
    const { profiles, ...rest } = log as typeof log & { profiles: { display_name: string } | null };
    return { ...rest, changer_name: profiles?.display_name ?? null };
  });

  return Response.json({ logs });
}
