'use client';

import { useState } from 'react';

export default function AdminTabs({
  tableContent,
  calendarContent,
  tableLabel = 'All Reports',
}: {
  tableContent: React.ReactNode;
  calendarContent: React.ReactNode;
  tableLabel?: string;
}) {
  const [tab, setTab] = useState<'table' | 'calendar'>('table');

  const tabs = [
    { key: 'table' as const, label: tableLabel },
    { key: 'calendar' as const, label: 'Calendar' },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-b-2 border-uo-green text-uo-green'
                : 'text-gray-500 hover:text-uo-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'table' ? tableContent : calendarContent}
    </div>
  );
}
