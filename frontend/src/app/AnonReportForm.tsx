'use client';

import { useState } from 'react';
import Link from 'next/link';

const REPORT_TYPES = [
  { value: 'noise_complaint',    label: 'Noise Complaint' },
  { value: 'medical_emergency',  label: 'Medical Emergency' },
  { value: 'suspicious_activity',label: 'Suspicious Activity' },
  { value: 'vandalism',          label: 'Vandalism' },
  { value: 'theft',              label: 'Theft' },
  { value: 'fire_hazard',        label: 'Fire / Hazard' },
  { value: 'harassment',         label: 'Harassment' },
  { value: 'incident',           label: 'General Incident' },
  { value: 'maintenance',        label: 'Maintenance / Facilities' },
  { value: 'other',              label: 'Other' },
] as const;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export default function AnonReportForm() {
  const [type, setType]               = useState('suspicious_activity');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [file, setFile]               = useState<File | null>(null);
  const [status, setStatus]           = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      let mediaData = null;
      if (file) {
        const fd = new FormData();
        fd.append('media', file);
        const upRes = await fetch(`${BACKEND_URL}/api/upload`, { method: 'POST', body: fd });
        if (upRes.ok) mediaData = (await upRes.json()).file;
      }

      const res = await fetch(`${BACKEND_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          description,
          is_anonymous: true,
          contact_name:  contactName  || null,
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null,
          media: mediaData,
        }),
      });

      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Submission failed. Please try again or call 541-346-2919.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-uo-ink">Report Received</h2>
        <p className="text-sm text-gray-500">
          Thank you. Campus Safety will review your report.
          {contactEmail && ' We may follow up at the email you provided.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <button
            onClick={() => {
              setStatus('idle');
              setDescription('');
              setContactName('');
              setContactEmail('');
              setContactPhone('');
              setFile(null);
              setType('suspicious_activity');
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            Submit Another
          </button>
          <Link
            href="/login"
            className="px-4 py-2 text-sm bg-uo-green text-white rounded-sm hover:opacity-90 text-center"
          >
            Sign In to Track Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm p-6 space-y-5">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type <span className="text-red-500">*</span></label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
        >
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder="Describe what happened, where, and when. Include as much detail as possible."
          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green resize-none"
        />
      </div>

      {/* Media */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attach Photo or Video (optional)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-600"
        />
      </div>

      {/* Contact (optional) */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          Contact Info — optional, only used to follow up
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Phone (optional)</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="541-000-0000"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-uo-green"
          />
        </div>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'submitting' || !description.trim()}
        className="w-full py-2.5 bg-uo-green text-white text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        For emergencies, call <strong>911</strong> or UO Public Safety at{' '}
        <strong>541-346-2919</strong>.
      </p>
    </form>
  );
}
