import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { supabase } from './lib/supabase';
import { renderDashboard } from './dashboard';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.get('/', async (_req, res) => {
  // Fetch aggregated metrics — no individual report data exposed
  const [reportRows, mediaCount] = await Promise.all([
    supabase.from('reports').select('status, is_anonymous, type'),
    supabase.from('media_logs').select('id', { count: 'exact', head: true }),
  ]);

  const rows = reportRows.data ?? [];
  const dbOk = !reportRows.error;

  const byType: Record<string, number> = {};
  let pending = 0, underReview = 0, resolved = 0, dismissed = 0, anonymous = 0;

  for (const r of rows) {
    if (r.status === 'pending')      pending++;
    if (r.status === 'under_review') underReview++;
    if (r.status === 'resolved')     resolved++;
    if (r.status === 'dismissed')    dismissed++;
    if (r.is_anonymous)              anonymous++;
    if (r.type) byType[r.type] = (byType[r.type] ?? 0) + 1;
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(renderDashboard({
    total:       rows.length,
    pending,
    underReview,
    resolved,
    dismissed,
    anonymous,
    withMedia:   mediaCount.count ?? 0,
    byType,
    dbOk,
    uptimeMs:    process.uptime() * 1000,
  }));
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'UO Internal Reporting Backend' });
});

// POST /api/reports — insert a new report (anonymous or authenticated)
app.post('/api/reports', async (req, res) => {
  const { user_id, type, description, media, is_anonymous, contact_name, contact_email, contact_phone } = req.body as {
    user_id?: string | null;
    type: string;
    description: string;
    is_anonymous?: boolean;
    contact_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    media?: { bucket_path: string; thumbnail_path: string | null; mimeType: string } | null;
  };

  if (!type || !description) {
    res.status(400).json({ error: 'type and description are required' });
    return;
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      user_id: user_id ?? null,
      type,
      description,
      status: 'pending',
      is_anonymous: is_anonymous ?? !user_id,
      contact_name:  contact_name  ?? null,
      contact_email: contact_email ?? null,
      contact_phone: contact_phone ?? null,
    })
    .select('id')
    .single();

  if (error || !report) {
    console.error('Insert report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
    return;
  }

  // If media was uploaded, create a media_log row
  if (media) {
    const mediaType = media.mimeType?.startsWith('video') ? 'video' : 'image';
    await supabase.from('media_logs').insert({
      report_id: report.id,
      media_type: mediaType,
      bucket_path: media.bucket_path,
      thumbnail_path: media.thumbnail_path,
    });
  }

  res.status(201).json({ success: true, report_id: report.id });
});

// PATCH /api/reports/:id/status — update status and write audit log
app.patch('/api/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, old_status, changed_by } = req.body as {
    status: string;
    old_status: string;
    changed_by: string;
  };

  const { error: updateError } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', id);

  if (updateError) {
    console.error('Update status error:', updateError);
    res.status(500).json({ error: 'Failed to update status' });
    return;
  }

  // Write audit log (best-effort)
  await supabase.from('audit_logs').insert({
    report_id: id,
    changed_by,
    old_status,
    new_status: status,
  });

  res.json({ success: true });
});

// GET /api/reports/realtime — SSE proxy for Supabase Realtime
app.get('/api/reports/realtime', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: {"event": "connected"}\n\n');

  const channel = supabase
    .channel('reports-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'reports' },
      (payload) => {
        res.write(`data: ${JSON.stringify({ event: 'new_report', data: payload.new })}\n\n`);
      }
    )
    .subscribe();

  req.on('close', () => {
    supabase.removeChannel(channel);
  });
});

// POST /api/upload — upload media to Supabase Storage
app.post('/api/upload', upload.single('media'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const { createReadStream } = await import('fs');
  const fs = await import('fs/promises');

  const ext = req.file.originalname.split('.').pop() ?? 'bin';
  const bucketPath = `uploads/${Date.now()}-${req.file.filename}.${ext}`;

  try {
    const fileBuffer = await fs.readFile(req.file.path);

    const { error: uploadError } = await supabase.storage
      .from('report-media')
      .upload(bucketPath, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      res.status(500).json({ error: 'Failed to upload to storage' });
      return;
    }

    // Clean up temp file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        bucket_path: bucketPath,
        // thumbnail generation (FFmpeg) is post-PoC
        thumbnail_path: null,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload processing failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend proxy listening at http://localhost:${port}`);
});
