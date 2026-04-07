'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const duckId = formData.get('duckid') as string;
  const password = formData.get('password') as string;

  // For PoC: Duck ID maps to email as duckid@uoregon.edu
  const email = duckId.includes('@') ? duckId : `${duckId}@uoregon.edu`;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect('/login?error=Invalid+Duck+ID+or+password');
  }

  const role = data.user.user_metadata?.role as string | undefined;
  if (role === 'admin' || role === 'root_admin') redirect('/admin');
  if (role === 'executive') redirect('/executive');
  redirect('/reporter');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
