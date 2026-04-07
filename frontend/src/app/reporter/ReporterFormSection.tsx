'use client';

import { useState } from 'react';
import ReportForm from './ReportForm';

export default function ReporterFormSection({
  userId,
  hasReports,
}: {
  userId: string;
  hasReports: boolean;
}) {
  const [open, setOpen] = useState(!hasReports);

  return (
    <section>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left py-2 border-b border-gray-200 group"
      >
        <h2 className="font-serif text-lg text-uo-ink">Submit a Report</h2>
        <span className={`text-gray-400 group-hover:text-uo-green transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="mt-4">
          <ReportForm userId={userId} />
        </div>
      )}
    </section>
  );
}
