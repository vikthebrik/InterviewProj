'use client';

import { useState } from 'react';

type Tab = 'reports' | 'list' | 'analytics';

export default function AdminTabs({
  reportsContent,
  listContent,
  analyticsContent,
  defaultTab = 'reports',
  reportsLabel = 'Reports',
}: {
  reportsContent: React.ReactNode;
  listContent?: React.ReactNode | null;
  analyticsContent: React.ReactNode | null;
  defaultTab?: Tab;
  reportsLabel?: string;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  const tabs: { key: Tab; label: string; hidden?: boolean }[] = [
    { key: 'reports',   label: reportsLabel },
    { key: 'list',      label: 'List',      hidden: !listContent },
    { key: 'analytics', label: 'Analytics', hidden: analyticsContent === null },
  ];

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.filter((t) => !t.hidden).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'border-b-2 border-uo-green text-uo-green'
                : 'text-gray-500 hover:text-uo-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'reports'   && reportsContent}
      {tab === 'list'      && listContent}
      {tab === 'analytics' && analyticsContent}
    </div>
  );
}
