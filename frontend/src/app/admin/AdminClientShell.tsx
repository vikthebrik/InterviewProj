'use client';

import { useEffect, useState } from 'react';
import type { Officer, Report, ReportStatus, WeeklyMetric } from './types';
import AdminKanban from './AdminKanban';
import AdminTable from './AdminTable';
import AdminTabs from './AdminTabs';
import AdminAnalytics from './AdminAnalytics';
import OfficerRoster from './OfficerRoster';
import ReportDetailPanel from './ReportDetailPanel';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default function AdminClientShell({
  initialReports,
  weeklyMetrics,
  officers,
  adminId,
  readOnly = false,
}: {
  initialReports: Report[];
  weeklyMetrics: WeeklyMetric[];
  officers: Officer[];
  adminId: string;
  readOnly?: boolean;
}) {
  const [reports,        setReports]        = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [officerFilter,  setOfficerFilter]  = useState<string | null>(null);

  // SSE for live new reports
  useEffect(() => {
    const es = new EventSource(`${BACKEND_URL}/api/reports/realtime`);
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.event === 'new_report' && payload.data) {
          setReports((prev) => [payload.data as Report, ...prev]);
        }
      } catch { /* ignore parse errors */ }
    };
    return () => es.close();
  }, []);

  function handleStatusChange(id: string, newStatus: ReportStatus, oldStatus: ReportStatus) {
    if (readOnly) return;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setSelectedReport((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
    fetch(`${BACKEND_URL}/api/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, old_status: oldStatus, changed_by: adminId }),
    }).catch(console.error);
  }

  function handleAssign(id: string, officerId: string | null) {
    if (readOnly) return;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, assigned_to: officerId } : r)));
    setSelectedReport((prev) => (prev?.id === id ? { ...prev, assigned_to: officerId } : prev));
    fetch(`${BACKEND_URL}/api/reports/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_to: officerId }),
    }).catch(console.error);
  }

  function handleRowClick(report: Report) {
    setSelectedReport((prev) => (prev?.id === report.id ? null : report));
  }

  return (
    <>
      {/* Officer roster strip — hidden in readOnly (executive) mode */}
      {!readOnly && (
        <OfficerRoster
          officers={officers}
          reports={reports}
          activeOfficerId={officerFilter}
          onSelect={setOfficerFilter}
        />
      )}

      <AdminTabs
        reportsLabel="Board"
        reportsContent={
          <AdminKanban
            reports={reports}
            officers={officers}
            officerFilter={officerFilter}
            selectedId={selectedReport?.id ?? null}
            onRowClick={handleRowClick}
          />
        }
        listContent={
          !readOnly ? (
            <AdminTable
              reports={reports}
              adminId={adminId}
              selectedId={selectedReport?.id ?? null}
              onRowClick={handleRowClick}
              onStatusChange={handleStatusChange}
            />
          ) : null
        }
        analyticsContent={<AdminAnalytics reports={reports} weeklyMetrics={weeklyMetrics} />}
      />

      <ReportDetailPanel
        report={selectedReport}
        officers={officers}
        adminId={adminId}
        readOnly={readOnly}
        onClose={() => setSelectedReport(null)}
        onStatusChange={handleStatusChange}
        onAssign={handleAssign}
      />
    </>
  );
}
