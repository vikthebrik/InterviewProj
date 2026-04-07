export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type ReportType =
  | 'noise_complaint' | 'medical_emergency' | 'suspicious_activity'
  | 'vandalism' | 'theft' | 'fire_hazard' | 'harassment'
  | 'incident' | 'maintenance' | 'hazard' | 'other';

export type Report = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  description: string | null;
  created_at: string;
  user_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  is_anonymous: boolean;
  assigned_to: string | null;
};

export type Officer = {
  id: string;
  display_name: string | null;
};

export type AuditLog = {
  id: string;
  report_id: string;
  changed_by: string | null;
  old_status: ReportStatus | null;
  new_status: ReportStatus;
  note: string | null;
  created_at: string;
  changer_name?: string | null;
};

export type WeeklyMetric = {
  report_week: string;
  status: ReportStatus;
  total_reports: number;
};

export const STATUSES: ReportStatus[] = ['pending', 'under_review', 'resolved', 'dismissed'];

export const REPORT_TYPES: ReportType[] = [
  'noise_complaint', 'medical_emergency', 'suspicious_activity', 'vandalism',
  'theft', 'fire_hazard', 'harassment', 'incident', 'maintenance', 'hazard', 'other',
];

export const TYPE_COLORS: Record<string, string> = {
  noise_complaint:     'bg-yellow-100 text-yellow-900',
  medical_emergency:   'bg-red-100 text-red-900',
  suspicious_activity: 'bg-orange-100 text-orange-900',
  vandalism:           'bg-purple-100 text-purple-900',
  theft:               'bg-pink-100 text-pink-900',
  fire_hazard:         'bg-red-200 text-red-900',
  harassment:          'bg-rose-100 text-rose-900',
  incident:            'bg-blue-100 text-blue-900',
  maintenance:         'bg-gray-100 text-gray-700',
  hazard:              'bg-amber-100 text-amber-900',
  other:               'bg-slate-100 text-slate-700',
};

export const STATUS_STYLES: Record<ReportStatus, string> = {
  pending:      'bg-yellow-50 text-yellow-800 border border-yellow-200',
  under_review: 'bg-blue-50 text-blue-800 border border-blue-200',
  resolved:     'bg-green-50 text-green-800 border border-green-200',
  dismissed:    'bg-gray-50 text-gray-600 border border-gray-200',
};

export const STATUS_DOT: Record<ReportStatus, string> = {
  pending:      'bg-yellow-400',
  under_review: 'bg-blue-400',
  resolved:     'bg-green-500',
  dismissed:    'bg-gray-400',
};

export function typeLabel(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Priority system ─────────────────────────────────────────────────────────

export type Priority = {
  level: 1 | 2 | 3 | 4;
  label: string;
  badge: string;      // Tailwind classes for the priority badge
  borderLeft: string; // Tailwind border-l color class
  columnAccent: string;
};

const PRIORITY_MAP: Record<string, Priority> = {
  fire_hazard:         { level: 1, label: 'P1 CRITICAL', badge: 'bg-red-50 text-red-700 border-red-400',        borderLeft: 'border-l-red-500',    columnAccent: 'text-red-600' },
  medical_emergency:   { level: 1, label: 'P1 CRITICAL', badge: 'bg-red-50 text-red-700 border-red-400',        borderLeft: 'border-l-red-500',    columnAccent: 'text-red-600' },
  suspicious_activity: { level: 2, label: 'P2 HIGH',     badge: 'bg-orange-50 text-orange-700 border-orange-400', borderLeft: 'border-l-orange-500', columnAccent: 'text-orange-600' },
  harassment:          { level: 2, label: 'P2 HIGH',     badge: 'bg-orange-50 text-orange-700 border-orange-400', borderLeft: 'border-l-orange-500', columnAccent: 'text-orange-600' },
  theft:               { level: 3, label: 'P3 MODERATE', badge: 'bg-amber-50 text-amber-700 border-amber-400',   borderLeft: 'border-l-amber-400',  columnAccent: 'text-amber-600' },
  vandalism:           { level: 3, label: 'P3 MODERATE', badge: 'bg-amber-50 text-amber-700 border-amber-400',   borderLeft: 'border-l-amber-400',  columnAccent: 'text-amber-600' },
  incident:            { level: 3, label: 'P3 MODERATE', badge: 'bg-amber-50 text-amber-700 border-amber-400',   borderLeft: 'border-l-amber-400',  columnAccent: 'text-amber-600' },
  hazard:              { level: 3, label: 'P3 MODERATE', badge: 'bg-amber-50 text-amber-700 border-amber-400',   borderLeft: 'border-l-amber-400',  columnAccent: 'text-amber-600' },
  noise_complaint:     { level: 4, label: 'P4 LOW',      badge: 'bg-blue-50 text-blue-700 border-blue-300',     borderLeft: 'border-l-blue-400',   columnAccent: 'text-blue-600' },
  maintenance:         { level: 4, label: 'P4 LOW',      badge: 'bg-blue-50 text-blue-700 border-blue-300',     borderLeft: 'border-l-blue-400',   columnAccent: 'text-blue-600' },
  other:               { level: 4, label: 'P4 LOW',      badge: 'bg-blue-50 text-blue-700 border-blue-300',     borderLeft: 'border-l-blue-400',   columnAccent: 'text-blue-600' },
};

const DEFAULT_PRIORITY: Priority = {
  level: 4, label: 'P4 LOW',
  badge: 'bg-blue-50 text-blue-700 border-blue-300',
  borderLeft: 'border-l-blue-400',
  columnAccent: 'text-blue-600',
};

export function getPriority(type: string): Priority {
  return PRIORITY_MAP[type] ?? DEFAULT_PRIORITY;
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

const TAGS_MAP: Record<string, string[]> = {
  fire_hazard:         ['FIRE', 'EMERGENCY', 'EVACUATE', 'FD-CALL'],
  medical_emergency:   ['MEDICAL', 'EMS', 'EMERGENCY', '911'],
  suspicious_activity: ['SUSPICIOUS', 'SECURITY', 'INVESTIGATE'],
  harassment:          ['HARASSMENT', 'CONDUCT', 'STUDENT-AFFAIRS'],
  theft:               ['THEFT', 'PROPERTY', 'POLICE-REPORT'],
  vandalism:           ['VANDALISM', 'PROPERTY', 'FACILITIES'],
  incident:            ['INCIDENT', 'POLICE-REPORT'],
  hazard:              ['HAZARD', 'FACILITIES', 'EHS'],
  noise_complaint:     ['NOISE', 'CONDUCT', 'RESIDENTIAL'],
  maintenance:         ['MAINTENANCE', 'FACILITIES', 'WORK-ORDER'],
  other:               ['GENERAL'],
};

export function getReportTags(type: string): string[] {
  return TAGS_MAP[type] ?? ['GENERAL'];
}

// ─── Suggested actions ────────────────────────────────────────────────────────

const ACTIONS_MAP: Record<string, string> = {
  fire_hazard:         'Evacuate area immediately. Contact UOFD (541-682-5111). Do not re-enter until all-clear.',
  medical_emergency:   'Call 911. Dispatch nearest officer. Contact UO Health Center: 541-346-2770.',
  suspicious_activity: 'Dispatch officer to investigate. Do not approach alone. Document physical description.',
  harassment:          'Contact UOPD. Refer reporter to Student Conduct Office. Document all details.',
  theft:               'Secure the area. Contact UOPD to file report. Preserve any physical evidence.',
  vandalism:           'Document with photos. Contact Facilities Management. File UOPD report if significant.',
  incident:            'Assess situation. Dispatch officer. Escalate to supervisor if unclear.',
  hazard:              'Cordon off area if possible. Contact EHS / Facilities Management. Post warning signage.',
  noise_complaint:     'Dispatch officer to issue warning. Log response time. Escalate if repeat complaint.',
  maintenance:         'Create Facilities work order. Mark urgent only if safety risk. Otherwise standard queue.',
  other:               'Review details and assess priority. Escalate to supervisor if uncertain.',
};

export function getSuggestedAction(type: string): string {
  return ACTIONS_MAP[type] ?? 'Review report and assign appropriate response.';
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

export function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function isOverdue(report: Report): boolean {
  if (report.status !== 'pending') return false;
  return Date.now() - new Date(report.created_at).getTime() > 30 * 60_000;
}
