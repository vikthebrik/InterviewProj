import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const protectedRoutes = ['/reporter', '/admin'];
const publicRoutes = ['/login', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
  const isPublicRoute = publicRoutes.includes(path);

  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Role-based protection for /admin — admin, root_admin, and executive all allowed
  if (user && path.startsWith('/admin')) {
    const role = user.user_metadata?.role as string | undefined;
    const canAccessAdmin = role === 'admin' || role === 'root_admin' || role === 'executive';
    if (!canAccessAdmin) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  // Reporters trying to access /reporter — just needs to be logged in (handled above)

  // Logged-in users going to /login → redirect to their dashboard
  if (path === '/login' && user) {
    const role = user.user_metadata?.role as string | undefined;
    const dest = (role === 'admin' || role === 'root_admin' || role === 'executive')
      ? '/admin'
      : '/reporter';
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|ico)$).*)'],
};
