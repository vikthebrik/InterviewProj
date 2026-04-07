'use client';

import { useEffect, useState } from 'react';
import type { AuditLog, Officer, Report, ReportStatus } from './types';
import {
  getPriority, getReportTags, getSuggestedAction,
  STATUSES, STATUS_DOT, STATUS_STYLES, statusLabel, timeAgo, typeLabel,
} from './types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

function AuditTimeline({ logs, loading }: { logs: AuditLog[]; loading: boolean }) {
  if (loading) return <p className="text-xs text-gray-400 py-2">Loading activity...</p>;
  if (logs.length === 0) return <p className="text-xs text-gray-400 italic py-2">No activity yet.</p>;
  return (
    <div className="space-y-3 mt-2">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[log.new_status]}`} />
            <div className="w-px flex-1 bg-gray-200 mt-1" />
          </div>
          <div className="pb-3 min-w-0">
            {log.old_status && log.old_status !== log.new_status ? (
              <p className="text-xs text-uo-ink font-medium">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${STATUS_STYLES[log.old_status]}`}>
                  {statusLabel(log.old_status)}
                </span>
                {' → '}
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${STATUS_STYLES[log.new_status]}`}>
                  {statusLabel(log.new_status)}
                </span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 font-medium">Note added</p>
            )}
            {log.note && <p className="text-xs text-gray-600 mt-1 italic">"{log.note}"</p>}
            <p className="text-[10px] text-gray-400 font-mono mt-1">
              {log.changer_name ?? 'System'} · {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportDetailPanel({
  report,
  officers,
  adminId,
  readOnly,
  onClose,
  onStatusChange,
  onAssign,
}: {
  report: Report | null;
  officers: Officer[];
  adminId: string;
  readOnly: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: ReportStatus, oldStatus: ReportStatus) => void;
  onAssign: (id: string, officerId: string | null) => void;
}) {
  const [auditLogs,    setAuditLogs]    = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [note,         setNote]         = useState('');
  const [noteSaving,   setNoteSaving]   = useState(false);

  useEffect(() => {
    if (!report) { setAuditLogs([]); return; }
    setAuditLoading(true);
    fetch(`/api/reports/${report.id}/audit`)
      .then((r) => r.json())
      .then(({ logs }) => setAuditLogs(logs ?? []))
      .catch(() => setAuditLogs([]))
      .finally(() => setAuditLoading(false));
  }, [report?.id]);

  async function handleNoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim() || !report || readOnly) return;
    setNoteSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/reports/${report.id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim(), changed_by: adminId }),
      });
      const optimistic: AuditLog = {
        id: crypto.randomUUID(),
        report_id: report.id,
        changed_by: adminId,
        old_status: report.status,
        new_status: report.status,
        note: note.trim(),
        created_at: new Date().toISOString(),
        changer_name: 'You',
      };
      setAuditLogs((prev) => [optimistic, ...prev]);
      setNote('');
    } finally {
      setNoteSaving(false);
    }
  }

  const open     = report !== null;
  const priority = report ? getPriority(report.type) : null;
  const tags     = report ? getReportTags(report.type) : [];
  const action   = report ? getSuggestedAction(report.type) : '';
  const assignedOfficer = report?.assigned_to
    ? officers.find((o) => o.id === report.assigned_to) ?? null
    : null;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed right-0 top-0 h-full z-40 w-[420px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-200 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Report detail"
      >
        {/* Header */}
        <div className={`flex items-start justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-uo-ledger ${priority ? `border-l-4 ${priority.borderLeft}` : ''}`}>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] text-gray-400 tracking-wider">
              #{report?.id.slice(0, 8).toUpperCase()} · {report ? timeAgo(report.created_at) : ''}
            </span>
            <h2 className="font-serif text-base font-semibold text-uo-ink mt-0.5">
              {report ? typeLabel(report.type) : ''}
            </h2>
            {priority && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border tracking-wide ${priority.badge}`}>
                  {priority.label}
                </span>
                {tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 bg-white text-gray-500 rounded-sm uppercase tracking-wider border border-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3 flex-shrink-0 mt-1">×</button>
        </div>

        {/* Body */}
        {report && (
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {/* Suggested action */}
            <div className="border-l-4 border-uo-yellow bg-yellow-50 px-3 py-2.5 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-yellow-700 font-bold mb-1">Suggested Action</p>
              <p className="text-sm text-yellow-900 leading-snug">{action}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">Status</label>
              {readOnly ? (
                <span className={`inline-block text-xs px-3 py-1.5 rounded-sm border font-medium ${STATUS_STYLES[report.status]}`}>
                  {statusLabel(report.status)}
                </span>
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(report.id, s, report.status)}
                      className={`text-[10px] font-semibold py-1.5 px-1 rounded-sm border transition-colors uppercase tracking-wide ${
                        report.status === s
                          ? 'bg-uo-green text-white border-uo-green'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-uo-green hover:text-uo-green'
                      }`}
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Officer assignment — hidden in readOnly */}
            {!readOnly && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">
                  Assigned Officer
                </label>
                <select
                  value={report.assigned_to ?? ''}
                  onChange={(e) => onAssign(report.id, e.target.value || null)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
                >
                  <option value="">— Unassigned —</option>
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>{o.display_name ?? 'Officer'}</option>
                  ))}
                </select>
                {assignedOfficer && (
                  <p className="text-xs text-uo-green mt-1">
                    Currently assigned to {assignedOfficer.display_name}
                  </p>
                )}
              </div>
            )}

            {/* Submitted */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Submitted</label>
              <p className="text-sm font-mono text-gray-600">
                {new Date(report.created_at).toLocaleString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                  year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            {/* Reporter — PII hidden in readOnly */}
            {!readOnly && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">Reporter</label>
                {report.is_anonymous ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2.5">
                    <p className="text-xs text-gray-400 italic">Anonymous submission</p>
                  </div>
                ) : (
                  <div className="bg-uo-ledger rounded-sm px-3 py-2.5 space-y-1">
                    {report.contact_name && <p className="text-sm font-medium text-uo-ink">{report.contact_name}</p>}
                    {report.contact_email && (
                      <a href={`mailto:${report.contact_email}`} className="text-xs text-uo-green hover:underline block">
                        {report.contact_email}
                      </a>
                    )}
                    {!report.contact_name && !report.contact_email && (
                      <p className="text-xs text-gray-400 italic">No contact info provided</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">Description</label>
              <p className="text-sm text-uo-ink leading-relaxed whitespace-pre-wrap bg-gray-50 border border-gray-100 rounded-sm px-3 py-2.5">
                {report.description ?? <span className="text-gray-400 italic">No description provided.</span>}
              </p>
            </div>

            {/* Notes — hidden in readOnly */}
            {!readOnly && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">Add Note</label>
                <form onSubmit={handleNoteSubmit} className="space-y-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Internal note visible to admins only..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!note.trim() || noteSaving}
                    className="px-3 py-1.5 text-xs bg-uo-green text-white rounded-sm hover:opacity-90 disabled:opacity-40"
                  >
                    {noteSaving ? 'Saving...' : 'Save Note'}
                  </button>
                </form>
              </div>
            )}

            {/* Audit trail */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Activity</label>
              <AuditTimeline logs={auditLogs} loading={auditLoading} />
            </div>

          </div>
        )}
      </aside>
    </>
  );
}
