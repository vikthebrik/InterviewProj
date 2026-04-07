'use client';

import type { Officer, Report } from './types';

export default function OfficerRoster({
  officers,
  reports,
  activeOfficerId,
  onSelect,
}: {
  officers: Officer[];
  reports: Report[];
  activeOfficerId: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (officers.length === 0) return null;

  // Count active assignments per officer
  const activeCounts = reports
    .filter((r) => r.status === 'pending' || r.status === 'under_review')
    .reduce<Record<string, number>>((acc, r) => {
      if (r.assigned_to) acc[r.assigned_to] = (acc[r.assigned_to] ?? 0) + 1;
      return acc;
    }, {});

  const unassignedActive = reports.filter(
    (r) => (r.status === 'pending' || r.status === 'under_review') && !r.assigned_to
  ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-sm px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex-shrink-0">
          Officers On Duty
        </span>

        {officers.map((officer) => {
          const count = activeCounts[officer.id] ?? 0;
          const isActive = activeOfficerId === officer.id;

          return (
            <button
              key={officer.id}
              onClick={() => onSelect(isActive ? null : officer.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm font-medium transition-all ${
                isActive
                  ? 'bg-uo-green text-white border-uo-green shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-uo-green hover:text-uo-green'
              }`}
            >
              <span>{officer.display_name ?? 'Officer'}</span>
              {count > 0 ? (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                  isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                }`}>
                  {count} active
                </span>
              ) : (
                <span className={`text-[10px] font-semibold ${isActive ? 'text-white/70' : 'text-green-600'}`}>
                  Available
                </span>
              )}
            </button>
          );
        })}

        {unassignedActive > 0 && (
          <span className="text-xs text-gray-400 ml-auto">
            {unassignedActive} unassigned
          </span>
        )}
      </div>
    </div>
  );
}
