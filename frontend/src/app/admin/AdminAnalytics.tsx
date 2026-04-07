'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { Report, WeeklyMetric } from './types';
import { typeLabel } from './types';

const TYPE_CHART_COLORS: Record<string, string> = {
  noise_complaint:     '#fbbf24',
  medical_emergency:   '#ef4444',
  suspicious_activity: '#f97316',
  vandalism:           '#a855f7',
  theft:               '#ec4899',
  fire_hazard:         '#dc2626',
  harassment:          '#f43f5e',
  incident:            '#3b82f6',
  maintenance:         '#6b7280',
  hazard:              '#f59e0b',
  other:               '#94a3b8',
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <h3 className="font-serif text-sm font-semibold text-uo-ink mb-4">{title}</h3>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AdminAnalytics({
  reports,
  weeklyMetrics,
}: {
  reports: Report[];
  weeklyMetrics: WeeklyMetric[];
}) {
  // 1. Type distribution
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of reports) counts[r.type] = (counts[r.type] ?? 0) + 1;
    return Object.entries(counts)
      .map(([type, count]) => ({ name: typeLabel(type), count, type }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  // 2. Weekly volume stacked by status
  const weeklyData = useMemo(() => {
    const map: Record<string, Record<string, unknown>> = {};
    for (const m of weeklyMetrics) {
      const week = new Date(m.report_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[week]) map[week] = { week };
      map[week][m.status] = m.total_reports;
    }
    return Object.values(map).reverse();
  }, [weeklyMetrics]);

  // 3. Resolution rate over time
  const resolutionData = useMemo(() => {
    const map: Record<string, { resolved: number; total: number }> = {};
    for (const m of weeklyMetrics) {
      const week = new Date(m.report_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[week]) map[week] = { resolved: 0, total: 0 };
      map[week].total += m.total_reports;
      if (m.status === 'resolved') map[week].resolved += m.total_reports;
    }
    return Object.entries(map)
      .reverse()
      .map(([week, { resolved, total }]) => ({
        week,
        rate: total === 0 ? 0 : Math.round((resolved / total) * 100),
      }));
  }, [weeklyMetrics]);

  if (reports.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-sm text-gray-400">
        No report data available for analytics.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <ChartCard title="Incident Type Distribution">
        <BarChart data={typeData} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
          <Tooltip />
          <Bar dataKey="count" name="Reports" radius={[0, 2, 2, 0]}>
            {typeData.map((entry) => (
              <Cell key={entry.type} fill={TYPE_CHART_COLORS[entry.type] ?? '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>

      <ChartCard title="Weekly Report Volume by Status">
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="pending"      stackId="a" fill="#fbbf24" name="Pending" />
          <Bar dataKey="under_review" stackId="a" fill="#60a5fa" name="Under Review" />
          <Bar dataKey="resolved"     stackId="a" fill="#004F2D" name="Resolved" />
          <Bar dataKey="dismissed"    stackId="a" fill="#9ca3af" name="Dismissed" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Weekly Resolution Rate (%)">
        <LineChart data={resolutionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
          <Tooltip formatter={(v) => [`${v}%`, 'Resolution Rate']} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#004F2D"
            strokeWidth={2}
            dot={{ r: 3, fill: '#004F2D' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartCard>

    </div>
  );
}
