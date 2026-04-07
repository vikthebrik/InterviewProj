import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const protectedRoutes = ['/reporter', '/admin', '/executive'];
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
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Role-based protection
  if (user && isProtectedRoute) {
    const role = user.user_metadata?.role as string | undefined;
    const isAdmin = role === 'admin' || role === 'root_admin';
    if (path.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    if (path.startsWith('/executive') && role !== 'executive') {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  // Logged-in users going to /login get redirected to their dashboard
  if (path === '/login' && user) {
    const role = user.user_metadata?.role as string | undefined;
    const dest =
      role === 'admin' || role === 'root_admin' ? '/admin'
      : role === 'executive' ? '/executive'
      : '/reporter';
    return NextResponse.redirect(new URL(dest, req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|ico)$).*)'],
};
