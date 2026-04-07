import Image from 'next/image';
import Link from 'next/link';
import AnonReportForm from './AnonReportForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-uo-paper flex flex-col">
      {/* Header */}
      <header className="bg-uo-green px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/oregon-yellow.svg" alt="UO" width={36} height={36} />
          <span className="text-white font-serif text-lg tracking-tight">
            UO Campus Safety Reporting
          </span>
        </div>
        {/* Subtle login — visible but not the focus */}
        <Link
          href="/login"
          className="text-xs text-uo-yellow/70 hover:text-uo-yellow transition-colors"
        >
          Staff / Student Sign In
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-uo-ink">Submit a Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            No account needed. You may provide contact info if you&apos;d like to be reached.
            <span className="ml-1">
              <Link href="/login" className="text-uo-green hover:underline">
                Sign in
              </Link>{' '}
              to track submitted reports.
            </span>
          </p>
        </div>

        <AnonReportForm />
      </main>

      {/* Footer — root admin access is here, styled as system text */}
      <footer className="py-4 text-center">
        <p className="text-[10px] text-gray-300 tracking-widest select-none">
          UNIVERSITY OF OREGON &nbsp;·&nbsp; CAMPUS SAFETY &nbsp;·&nbsp;{' '}
          {/* Root admin: inconspicuous portal link */}
          <Link
            href="/login?portal=admin"
            className="text-gray-300 hover:text-gray-400 transition-colors"
            tabIndex={-1}
          >
            SYSTEM
          </Link>
        </p>
      </footer>
    </div>
  );
}
