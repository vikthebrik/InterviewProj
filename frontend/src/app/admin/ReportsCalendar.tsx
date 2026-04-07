'use client';

import { useState } from 'react';

type Report = {
  id: string;
  type: string;
  status: string;
  description: string | null;
  created_at: string;
  contact_name?: string | null;
  is_anonymous?: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  noise_complaint:    'bg-yellow-200 text-yellow-900',
  medical_emergency:  'bg-red-200 text-red-900',
  suspicious_activity:'bg-orange-200 text-orange-900',
  vandalism:          'bg-purple-200 text-purple-900',
  theft:              'bg-pink-200 text-pink-900',
  fire_hazard:        'bg-red-300 text-red-900',
  harassment:         'bg-rose-200 text-rose-900',
  incident:           'bg-blue-200 text-blue-900',
  maintenance:        'bg-gray-200 text-gray-800',
  hazard:             'bg-amber-200 text-amber-900',
  other:              'bg-slate-200 text-slate-800',
};

function typeLabel(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ReportsCalendar({ reports }: { reports: Report[] }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selected, setSelected] = useState<Report[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Group reports by YYYY-MM-DD
  const byDay: Record<string, Report[]> = {};
  for (const r of reports) {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(r);
  }

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  function clickDay(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(key);
    setSelected(byDay[key] ?? []);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="px-3 py-1 text-sm border border-gray-300 rounded-sm hover:bg-gray-50">←</button>
        <span className="font-medium text-uo-ink">{monthName}</span>
        <button onClick={next} className="px-3 py-1 text-sm border border-gray-300 rounded-sm hover:bg-gray-50">→</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-medium">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-uo-paper min-h-[80px]" />;
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayReports = byDay[key] ?? [];
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSelected = selectedDay === key;

          return (
            <div
              key={key}
              onClick={() => clickDay(day)}
              className={`bg-white min-h-[80px] p-1 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'ring-2 ring-uo-green ring-inset' : ''}`}
            >
              <div className={`text-xs font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-uo-green text-white' : 'text-gray-600'}`}>
                {day}
              </div>
              <div className="space-y-px">
                {dayReports.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className={`text-[10px] px-1 rounded truncate leading-4 ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-700'}`}
                  >
                    {typeLabel(r.type)}
                  </div>
                ))}
                {dayReports.length > 3 && (
                  <div className="text-[10px] text-gray-400 pl-1">+{dayReports.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day detail panel */}
      {selected !== null && (
        <div className="border border-gray-200 rounded-sm bg-white">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-uo-ink">
              {selectedDay} — {selected.length} report{selected.length !== 1 ? 's' : ''}
            </span>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          {selected.length === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-400">No reports on this day.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {selected.map((r) => (
                <li key={r.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[r.type] ?? 'bg-gray-100'}`}>
                      {typeLabel(r.type)}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{r.status?.replace('_', ' ')}</span>
                    {r.is_anonymous && <span className="text-xs text-gray-400">· anonymous</span>}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{r.description}</p>
                  {r.contact_name && (
                    <p className="text-xs text-gray-400">Contact: {r.contact_name}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
