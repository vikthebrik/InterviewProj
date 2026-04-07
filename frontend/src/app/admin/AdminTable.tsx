'use client';

import { useMemo, useState } from 'react';
import type { Report, ReportStatus } from './types';
import { REPORT_TYPES, STATUSES, STATUS_STYLES, TYPE_COLORS, statusLabel, typeLabel } from './types';

type SortKey = 'created_at' | 'type' | 'status';

function SortHeader({
  label, sortKey, current, dir, onSort,
}: {
  label: string; sortKey: SortKey;
  current: SortKey; dir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="text-left px-4 py-2.5 font-medium text-xs uppercase tracking-wide cursor-pointer select-none hover:text-uo-green transition-colors"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-[10px] ${active ? 'text-uo-green' : 'text-gray-300'}`}>
          {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );
}

export default function AdminTable({
  reports,
  adminId,
  selectedId,
  onRowClick,
  onStatusChange,
}: {
  reports: Report[];
  adminId: string;
  selectedId: string | null;
  onRowClick: (r: Report) => void;
  onStatusChange: (id: string, newStatus: ReportStatus, oldStatus: ReportStatus) => void;
}) {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');
  // 'active' = pending + under_review; 'all' = no filter; any other value = exact match
  const [statusFilter, setStatus]     = useState<'active' | 'all' | string>('active');
  const [dateFrom, setDateFrom]       = useState('');
  const [dateTo, setDateTo]           = useState('');
  const [sortKey, setSortKey]         = useState<SortKey>('created_at');
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports
      .filter((r) => {
        if (q && !(
          r.description?.toLowerCase().includes(q) ||
          r.type.includes(q) ||
          r.contact_name?.toLowerCase().includes(q) ||
          r.contact_email?.toLowerCase().includes(q)
        )) return false;
        if (typeFilter !== 'all' && r.type !== typeFilter) return false;
        if (statusFilter === 'active') {
          if (r.status !== 'pending' && r.status !== 'under_review') return false;
        } else if (statusFilter !== 'all' && r.status !== statusFilter) {
          return false;
        }
        if (dateFrom && new Date(r.created_at) < new Date(dateFrom)) return false;
        if (dateTo && new Date(r.created_at) > new Date(dateTo + 'T23:59:59')) return false;
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'created_at') return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        if (sortKey === 'type') return dir * a.type.localeCompare(b.type);
        if (sortKey === 'status') return dir * a.status.localeCompare(b.status);
        return 0;
      });
  }, [reports, search, typeFilter, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  function clearFilters() {
    setSearch(''); setTypeFilter('all'); setStatus('active');
    setDateFrom(''); setDateTo('');
  }
  const hasExtraFilters = search || typeFilter !== 'all' || dateFrom || dateTo;

  // Counts for quick-filter badges
  const activeCnt   = reports.filter((r) => r.status === 'pending' || r.status === 'under_review').length;
  const resolvedCnt = reports.filter((r) => r.status === 'resolved').length;

  const quickFilters: { key: string; label: string; count?: number }[] = [
    { key: 'active',   label: 'Active',    count: activeCnt },
    { key: 'all',      label: 'All Reports' },
    { key: 'resolved', label: 'Resolved',   count: resolvedCnt },
    { key: 'dismissed',label: 'Dismissed' },
  ];

  return (
    <div className="space-y-3">
      {/* Quick-filter presets */}
      <div className="flex gap-2 flex-wrap">
        {quickFilters.map((qf) => (
          <button
            key={qf.key}
            onClick={() => setStatus(qf.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
              statusFilter === qf.key
                ? 'bg-uo-green text-white border-uo-green'
                : 'bg-white text-gray-600 border-gray-200 hover:border-uo-green hover:text-uo-green'
            }`}
          >
            {qf.label}
            {qf.count !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                statusFilter === qf.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {qf.count}
              </span>
            )}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-auto self-center">
          {filtered.length} of {reports.length} reports
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="search"
          placeholder="Search description, type, reporter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-uo-green"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-sm px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
        >
          <option value="all">All Types</option>
          {REPORT_TYPES.map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-uo-green"
          title="From date"
        />
        <span className="text-gray-400 text-xs">—</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-sm px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-uo-green"
          title="To date"
        />
        {hasExtraFilters && (
          <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-uo-ledger text-gray-600 border-b border-gray-200">
              <tr>
                <SortHeader label="Date"   sortKey="created_at" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Type"   sortKey="type"       current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Status" sortKey="status"     current={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="text-left px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Reporter</th>
                <th className="text-left px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Description</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick(r)}
                  className={`border-t border-gray-100 cursor-pointer transition-colors ${
                    selectedId === r.id
                      ? 'bg-uo-ledger ring-1 ring-inset ring-uo-green'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs font-mono">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {typeLabel(r.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(r.id, e.target.value as ReportStatus, r.status);
                      }}
                      className={`text-xs px-2 py-0.5 rounded-sm border cursor-pointer focus:outline-none focus:ring-1 focus:ring-uo-green ${STATUS_STYLES[r.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {r.is_anonymous ? (
                      <span className="text-gray-400 italic">Anonymous</span>
                    ) : (
                      r.contact_name ?? <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <span className="line-clamp-2">{r.description}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">›</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    {(hasExtraFilters || statusFilter !== 'all') ? 'No reports match your filters.' : 'No reports yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
