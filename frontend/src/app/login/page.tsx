import Image from "next/image";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md border-t-4 border-uo-green overflow-hidden rounded-sm">
        <div className="bg-uo-green py-6 px-4 sm:px-6 text-center">
          <Image
            className="mx-auto h-16 w-auto"
            src="/oregon-yellow.svg"
            alt="University of Oregon"
            width={64}
            height={64}
          />
          <h2 className="mt-4 text-center text-2xl font-serif text-white tracking-tight">
            Central Authentication Service
          </h2>
        </div>
        <div className="py-8 px-4 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
              {error}
            </div>
          )}
          <form className="space-y-6" action={login}>
            <div>
              <label htmlFor="duckid" className="block text-sm font-medium text-gray-700">
                Duck ID
              </label>
              <div className="mt-1">
                <input
                  id="duckid"
                  name="duckid"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-uo-green focus:border-uo-green sm:text-sm"
                  placeholder="Enter your Duck ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-uo-green focus:border-uo-green sm:text-sm"
                  placeholder="Enter your Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-uo-green focus:ring-uo-green border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-uo-green hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-uo-ink bg-uo-yellow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uo-yellow"
              >
                Log In
              </button>
            </div>
            
            {/* Quick access links for the prototype */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4 text-center">Development Access (Bypass Auth):</p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/reporter" className="text-uo-green hover:underline">Reporter</Link>
                <Link href="/admin" className="text-uo-green hover:underline">Admin</Link>
                <Link href="/executive" className="text-uo-green hover:underline">Executive</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer Text resembling Duck ID portal */}
      <div className="mt-8 text-center text-xs text-gray-500 max-w-sm">
        <p>For security reasons, please log out and exit your web browser when you are done accessing services that require authentication!</p>
      </div>
    </div>
  );
}
