'use client';

import { useState, useEffect } from 'react';

type Report = {
  id: string;
  type: string;
  status: string;
  description: string | null;
  created_at: string;
  user_id: string;
};

const STATUSES = ['pending', 'under_review', 'resolved', 'dismissed'] as const;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default function AdminTable({ reports: initial, adminId }: { reports: Report[]; adminId: string }) {
  const [reports, setReports] = useState<Report[]>(initial);

  useEffect(() => {
    const es = new EventSource(`${BACKEND_URL}/api/reports/realtime`);
    es.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.event === 'new_report' && payload.data) {
        setReports((prev) => [payload.data as Report, ...prev]);
      }
    };
    return () => es.close();
  }, []);

  async function updateStatus(reportId: string, newStatus: string, oldStatus: string) {
    const res = await fetch(`${BACKEND_URL}/api/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, old_status: oldStatus, changed_by: adminId }),
    });
    if (res.ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    }
  }

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-uo-ledger text-uo-ink">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Date</th>
            <th className="text-left px-4 py-2 font-medium">Type</th>
            <th className="text-left px-4 py-2 font-medium">Description</th>
            <th className="text-left px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 capitalize">{r.type}</td>
              <td className="px-4 py-2 text-gray-700 max-w-sm truncate">{r.description}</td>
              <td className="px-4 py-2">
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value, r.status)}
                  className="border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-uo-green capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                No reports yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
