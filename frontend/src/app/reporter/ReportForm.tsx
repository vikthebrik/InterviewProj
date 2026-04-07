'use client';

import { useState } from 'react';

const REPORT_TYPES = [
  { value: 'noise_complaint',     label: 'Noise Complaint' },
  { value: 'medical_emergency',   label: 'Medical Emergency' },
  { value: 'suspicious_activity', label: 'Suspicious Activity' },
  { value: 'vandalism',           label: 'Vandalism' },
  { value: 'theft',               label: 'Theft' },
  { value: 'fire_hazard',         label: 'Fire / Hazard' },
  { value: 'harassment',          label: 'Harassment' },
  { value: 'incident',            label: 'General Incident' },
  { value: 'maintenance',         label: 'Maintenance / Facilities' },
  { value: 'other',               label: 'Other' },
] as const;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default function ReportForm({ userId }: { userId: string }) {
  const [type, setType] = useState<string>('suspicious_activity');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      let mediaData = null;

      if (file) {
        const formData = new FormData();
        formData.append('media', file);
        const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          mediaData = await uploadRes.json();
        }
      }

      const res = await fetch(`${BACKEND_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          type,
          description,
          media: mediaData?.file ?? null,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      setStatus('success');
      setMessage('Report submitted successfully.');
      setDescription('');
      setFile(null);
      setType('incident');
    } catch {
      setStatus('error');
      setMessage('Failed to submit report. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green capitalize"
        >
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green resize-none"
          placeholder="Describe the incident or issue..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attach Media (optional)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-600"
        />
      </div>

      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-2 px-4 bg-uo-green text-white text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
