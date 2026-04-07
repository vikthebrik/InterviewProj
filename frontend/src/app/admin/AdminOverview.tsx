import type { Report, ReportStatus } from './types';
import { getPriority, isOverdue } from './types';

function StatCard({
  label,
  value,
  sub,
  colorClass,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  colorClass: string;
  accent?: string;
}) {
  return (
    <div className={`rounded-sm border p-4 ${colorClass} ${accent ? `border-l-4 ${accent}` : ''}`}>
      <p className="text-2xl font-bold font-serif leading-none">{value}</p>
      <p className="text-[10px] font-semibold mt-2 uppercase tracking-widest opacity-80">{label}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}

export default function AdminOverview({ reports }: { reports: Report[] }) {
  const counts = reports.reduce<Record<ReportStatus, number>>(
    (acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; },
    { pending: 0, under_review: 0, resolved: 0, dismissed: 0 }
  );
  const total = reports.length;
  const resolutionRate = total === 0 ? 0 : Math.round((counts.resolved / total) * 100);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = reports.filter((r) => new Date(r.created_at) >= todayStart).length;

  const activeReports = reports.filter(
    (r) => r.status === 'pending' || r.status === 'under_review'
  );
  const criticalCount = activeReports.filter((r) => getPriority(r.type).level === 1).length;
  const overdueCount = reports.filter((r) => isOverdue(r)).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* Operational urgency — shown first */}
      <StatCard
        label="P1 Critical"
        value={criticalCount}
        sub="active"
        colorClass={criticalCount > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-gray-50 border-gray-200 text-gray-500'}
        accent={criticalCount > 0 ? 'border-l-red-500' : undefined}
      />
      <StatCard
        label="Overdue"
        value={overdueCount}
        sub=">30 min pending"
        colorClass={overdueCount > 0 ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-gray-50 border-gray-200 text-gray-500'}
        accent={overdueCount > 0 ? 'border-l-orange-500' : undefined}
      />

      {/* Status breakdown */}
      <StatCard
        label="Pending"
        value={counts.pending}
        colorClass="bg-yellow-50 border-yellow-200 text-yellow-900"
      />
      <StatCard
        label="Under Review"
        value={counts.under_review}
        colorClass="bg-blue-50 border-blue-200 text-blue-900"
      />
      <StatCard
        label="Resolved"
        value={counts.resolved}
        colorClass="bg-green-50 border-green-200 text-green-900"
      />
      <StatCard
        label="Dismissed"
        value={counts.dismissed}
        colorClass="bg-gray-50 border-gray-200 text-gray-700"
      />
      <StatCard
        label="Resolution Rate"
        value={`${resolutionRate}%`}
        sub={`${counts.resolved} of ${total}`}
        colorClass="bg-uo-ledger border-gray-200 text-uo-ink"
      />
      <StatCard
        label="Today"
        value={todayCount}
        sub="new reports"
        colorClass="bg-white border-uo-green/40 text-uo-ink"
      />
    </div>
  );
}
