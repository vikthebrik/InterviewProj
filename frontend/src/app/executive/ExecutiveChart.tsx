'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartRow = Record<string, unknown>;

export default function ExecutiveChart({ data }: { data: ChartRow[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="pending"      fill="#FEE123" name="Pending" />
          <Bar dataKey="under_review" fill="#60a5fa" name="Under Review" />
          <Bar dataKey="resolved"     fill="#004F2D" name="Resolved" />
          <Bar dataKey="dismissed"    fill="#9ca3af" name="Dismissed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
