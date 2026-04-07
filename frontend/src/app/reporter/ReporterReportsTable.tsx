'use client';

import React, { useState } from 'react';
import type { Report } from '@/app/admin/types';
import { STATUS_STYLES, TYPE_COLORS, statusLabel, typeLabel } from '@/app/admin/types';

export default function ReporterReportsTable({ reports }: { reports: Report[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (reports.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm px-6 py-10 text-center text-sm text-gray-400">
        No reports submitted yet.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-uo-ledger text-gray-600 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wide font-medium">Date</th>
            <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wide font-medium">Type</th>
            <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wide font-medium">Status</th>
            <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wide font-medium hidden sm:table-cell">Preview</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <React.Fragment key={r.id}>
              <tr
                onClick={() => setExpandedId((id) => (id === r.id ? null : r.id))}
                className={`border-t border-gray-100 cursor-pointer transition-colors ${
                  expandedId === r.id ? 'bg-uo-ledger' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[r.type] ?? 'bg-gray-100'}`}>
                    {typeLabel(r.type)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-sm ${STATUS_STYLES[r.status]}`}>
                    {statusLabel(r.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell max-w-xs">
                  <span className="line-clamp-1">{r.description}</span>
                </td>
                <td className="px-4 py-3 text-gray-300 text-xs">
                  {expandedId === r.id ? '▲' : '▾'}
                </td>
              </tr>
              {expandedId === r.id && (
                <tr>
                  <td colSpan={5} className="px-5 py-4 bg-uo-ledger border-t border-gray-200">
                    <p className="text-sm text-uo-ink leading-relaxed">{r.description}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-2">
                      ID: {r.id}
                    </p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
