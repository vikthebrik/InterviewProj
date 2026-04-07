'use client';

import { useMemo, useState } from 'react';
import type { Officer, Report, ReportStatus } from './types';
import {
  getPriority, getReportTags, isOverdue, timeAgo,
  REPORT_TYPES, STATUSES, statusLabel, typeLabel,
} from './types';

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortMode = 'priority' | 'newest' | 'oldest';

function sortReports(reports: Report[], mode: SortMode): Report[] {
  return [...reports].sort((a, b) => {
    if (mode === 'priority') {
      const diff = getPriority(a.type).level - getPriority(b.type).level;
      if (diff !== 0) return diff;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    return mode === 'newest' ? tb - ta : ta - tb;
  });
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ReportCard({
  report,
  selected,
  assignedOfficerName,
  onClick,
}: {
  report: Report;
  selected: boolean;
  assignedOfficerName: string | null;
  onClick: () => void;
}) {
  const priority = getPriority(report.type);
  const tags = getReportTags(report.type).slice(0, 2);
  const overdue = isOverdue(report);

  return (
    <article
      onClick={onClick}
      className={`flex flex-col bg-white rounded-sm cursor-pointer overflow-hidden border border-gray-200 border-l-4 transition-all ${priority.borderLeft} ${
        selected ? 'ring-2 ring-uo-green shadow-md' : 'hover:shadow-sm hover:border-gray-300'
      }`}
    >
      {/* Header: priority + overdue + age */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border tracking-wide whitespace-nowrap ${priority.badge}`}>
            {priority.label}
          </span>
          {overdue && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-500 text-white tracking-wide animate-pulse whitespace-nowrap">
              OVERDUE
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap flex-shrink-0">
          {timeAgo(report.created_at)}
        </span>
      </div>

      {/* Type */}
      <p className="px-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
        {typeLabel(report.type)}
      </p>

      {/* Description — overflow-hidden prevents layout bleed into footer */}
      <div className="px-3 pb-2 flex-shrink-0 overflow-hidden">
        <p className="text-sm text-uo-ink leading-snug line-clamp-2 overflow-hidden">
          {report.description ?? <span className="italic text-gray-400">No description provided</span>}
        </p>
      </div>

      {/* Footer: tags + reporter/officer */}
      <div className="px-3 pb-3 flex items-end justify-between gap-2 flex-shrink-0 mt-auto">
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-semibold px-1.5 py-0.5 bg-uo-ledger text-gray-400 rounded-sm uppercase tracking-wider border border-gray-200 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-right flex-shrink-0 min-w-0">
          {assignedOfficerName ? (
            <span className="text-[10px] text-uo-green font-medium truncate block">{assignedOfficerName}</span>
          ) : (
            <span className="text-[10px] text-gray-300 italic">Unassigned</span>
          )}
          <span className="text-[10px] text-gray-400 truncate block">
            {report.is_anonymous ? 'Anonymous' : (report.contact_name ?? '—')}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Column def ───────────────────────────────────────────────────────────────

type ColumnDef = {
  key: string;
  label: string;
  statuses: ReportStatus[];
  topBorder: string;
  headerBg: string;
  countBadge: string;
};

const COLUMNS: ColumnDef[] = [
  { key: 'pending',      label: 'PENDING',      statuses: ['pending'],               topBorder: 'border-t-red-400',   headerBg: 'bg-red-50',   countBadge: 'bg-red-100 text-red-700' },
  { key: 'under_review', label: 'UNDER REVIEW',  statuses: ['under_review'],          topBorder: 'border-t-blue-500',  headerBg: 'bg-blue-50',  countBadge: 'bg-blue-100 text-blue-700' },
  { key: 'closed',       label: 'CLOSED',        statuses: ['resolved', 'dismissed'], topBorder: 'border-t-green-500', headerBg: 'bg-green-50', countBadge: 'bg-green-100 text-green-700' },
];

const PRIORITY_LEVELS = [1, 2, 3, 4] as const;
const PRIORITY_LABELS: Record<number, string> = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4' };

// ─── Board ────────────────────────────────────────────────────────────────────

export default function AdminKanban({
  reports,
  officers,
  officerFilter,
  selectedId,
  onRowClick,
}: {
  reports: Report[];
  officers: Officer[];
  officerFilter: string | null;
  selectedId: string | null;
  onRowClick: (r: Report) => void;
}) {
  const [search,         setSearch]         = useState('');
  const [typeFilter,     setTypeFilter]     = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<Set<number>>(new Set());
  const [tagFilter,      setTagFilter]      = useState<Set<string>>(new Set());
  const [sortMode,       setSortMode]       = useState<SortMode>('priority');

  // Derive all unique tags from current report set
  const allTags = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((r) => getReportTags(r.type).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [reports]);

  // Officer name lookup
  const officerMap = useMemo(
    () => Object.fromEntries(officers.map((o) => [o.id, o.display_name ?? 'Officer'])),
    [officers]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter((r) => {
      if (q && !(
        r.description?.toLowerCase().includes(q) ||
        r.type.includes(q) ||
        r.contact_name?.toLowerCase().includes(q) ||
        typeLabel(r.type).toLowerCase().includes(q)
      )) return false;

      if (typeFilter !== 'all' && r.type !== typeFilter) return false;

      if (priorityFilter.size > 0 && !priorityFilter.has(getPriority(r.type).level)) return false;

      if (tagFilter.size > 0) {
        const rTags = new Set(getReportTags(r.type));
        if (![...tagFilter].some((t) => rTags.has(t))) return false;
      }

      if (officerFilter) {
        if (r.assigned_to !== officerFilter) return false;
      }

      return true;
    });
  }, [reports, search, typeFilter, priorityFilter, tagFilter, officerFilter]);

  const columns = useMemo(
    () => COLUMNS.map((col) => ({
      ...col,
      reports: sortReports(filtered.filter((r) => col.statuses.includes(r.status)), sortMode),
    })),
    [filtered, sortMode]
  );

  const activeCount   = reports.filter((r) => r.status === 'pending' || r.status === 'under_review').length;
  const criticalCount = reports.filter((r) => (r.status === 'pending' || r.status === 'under_review') && getPriority(r.type).level === 1).length;
  const overdueCount  = reports.filter((r) => isOverdue(r)).length;

  function togglePriority(level: number) {
    setPriorityFilter((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }
  function toggleTag(tag: string) {
    setTagFilter((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }
  function clearAll() {
    setSearch(''); setTypeFilter('all');
    setPriorityFilter(new Set()); setTagFilter(new Set());
  }
  const hasFilters = search || typeFilter !== 'all' || priorityFilter.size > 0 || tagFilter.size > 0 || officerFilter;

  return (
    <div className="space-y-3">

      {/* ── Filter toolbar ── */}
      <div className="bg-white border border-gray-200 rounded-sm p-3 space-y-2.5">

        {/* Row 1: search + type + sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="search"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-1 focus:ring-uo-green"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-sm px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
          >
            <option value="all">All Types</option>
            {REPORT_TYPES.map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-gray-400">Sort</span>
            <div className="flex border border-gray-200 rounded-sm overflow-hidden">
              {(['priority', 'newest', 'oldest'] as SortMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSortMode(m)}
                  className={`px-3 py-1 text-xs font-medium border-r border-gray-200 last:border-r-0 transition-colors capitalize ${
                    sortMode === m ? 'bg-uo-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: priority filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Priority</span>
          {PRIORITY_LEVELS.map((lvl) => {
            const p = getPriority(lvl === 1 ? 'fire_hazard' : lvl === 2 ? 'suspicious_activity' : lvl === 3 ? 'theft' : 'noise_complaint');
            const active = priorityFilter.has(lvl);
            return (
              <button
                key={lvl}
                onClick={() => togglePriority(lvl)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border tracking-wide transition-all ${
                  active ? p.badge + ' ring-1 ring-offset-1 ring-current' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                }`}
              >
                {PRIORITY_LABELS[lvl]}
              </button>
            );
          })}
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold ml-3">Tags</span>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => {
              const active = tagFilter.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border transition-all ${
                    active
                      ? 'bg-uo-green text-white border-uo-green'
                      : 'bg-uo-ledger text-gray-500 border-gray-200 hover:border-uo-green hover:text-uo-green'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto">
              Clear all
            </button>
          )}
        </div>

        {/* Result count */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5 border-t border-gray-100">
          <span>{filtered.length} of {reports.length} reports shown</span>
          <span>{activeCount} active · {reports.length} total</span>
        </div>
      </div>

      {/* ── Alert bar ── */}
      {(criticalCount > 0 || overdueCount > 0) && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 bg-red-50 border border-red-200 rounded-sm px-4 py-2.5">
          {criticalCount > 0 && (
            <span className="text-sm font-semibold text-red-700">
              ⚠ {criticalCount} P1 critical incident{criticalCount > 1 ? 's' : ''} active
            </span>
          )}
          {overdueCount > 0 && (
            <span className="text-sm text-orange-700 font-medium">
              · {overdueCount} report{overdueCount > 1 ? 's' : ''} unattended &gt;30 min
            </span>
          )}
        </div>
      )}

      {/* ── Kanban columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((col) => {
          const p1InCol = col.reports.filter((r) => getPriority(r.type).level === 1).length;
          return (
            <div
              key={col.key}
              className={`flex flex-col rounded-sm overflow-hidden bg-gray-50 border border-gray-200 border-t-4 ${col.topBorder}`}
            >
              <div className={`px-3 py-2.5 ${col.headerBg} border-b border-gray-200 flex items-center justify-between flex-shrink-0`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">{col.label}</h3>
                <div className="flex items-center gap-2">
                  {p1InCol > 0 && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded-sm">
                      P1: {p1InCol}
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${col.countBadge}`}>
                    {col.reports.length}
                  </span>
                </div>
              </div>
              <div className="overflow-y-auto p-3 space-y-2.5" style={{ maxHeight: '68vh' }}>
                {col.reports.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center">No reports</p>
                ) : (
                  col.reports.map((r) => (
                    <ReportCard
                      key={r.id}
                      report={r}
                      selected={r.id === selectedId}
                      assignedOfficerName={r.assigned_to ? (officerMap[r.assigned_to] ?? null) : null}
                      onClick={() => onRowClick(r)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
