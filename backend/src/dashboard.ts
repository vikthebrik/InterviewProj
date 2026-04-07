const UO_GREEN  = '#004F2D';
const UO_YELLOW = '#FEE123';

type Metrics = {
  total:       number;
  pending:     number;
  underReview: number;
  resolved:    number;
  dismissed:   number;
  anonymous:   number;
  withMedia:   number;
  byType:      Record<string, number>;
  dbOk:        boolean;
  uptimeMs:    number;
};

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function bar(value: number, total: number, width = 20) {
  const filled = total === 0 ? 0 : Math.round((value / total) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function fmtUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function typeLabel(t: string) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function renderDashboard(m: Metrics): string {
  const resolutionRate = pct(m.resolved, m.total);
  const anonRate       = pct(m.anonymous, m.total);
  const mediaRate      = pct(m.withMedia, m.total);
  const now            = new Date().toISOString();

  const typeRows = Object.entries(m.byType)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => `
      <div class="type-row">
        <span class="type-label">${typeLabel(type)}</span>
        <span class="type-bar">${bar(count, m.total, 18)}</span>
        <span class="type-count">${count}</span>
        <span class="type-pct dim">${pct(count, m.total)}%</span>
      </div>`).join('');

  const statusItems = [
    { label: 'PENDING',      value: m.pending,     color: UO_YELLOW },
    { label: 'UNDER_REVIEW', value: m.underReview, color: '#60a5fa' },
    { label: 'RESOLVED',     value: m.resolved,    color: '#4ade80' },
    { label: 'DISMISSED',    value: m.dismissed,   color: '#6b7280' },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="30">
  <title>UO Reporting · API Monitor</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green:   ${UO_GREEN};
      --yellow:  ${UO_YELLOW};
      --bg:      #080e09;
      --surface: #0d160e;
      --border:  #1a2e1c;
      --dim:     #3d5c40;
      --text:    #c8ddc9;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      min-height: 100vh;
      padding: 0 0 40px;
    }

    /* ── Header ── */
    .header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .logo-block {
      display: flex; align-items: center; gap: 8px;
      border-right: 1px solid var(--border); padding-right: 16px;
    }
    .logo-o {
      width: 22px; height: 22px;
      border: 2px solid var(--yellow);
      border-radius: 50%;
      display: inline-block;
    }
    .logo-text { color: var(--yellow); font-weight: 700; font-size: 11px; letter-spacing: .15em; }
    .sys-title { color: var(--text); font-weight: 500; font-size: 12px; letter-spacing: .08em; }

    .status-pill {
      display: flex; align-items: center; gap: 6px;
      font-size: 10px; letter-spacing: .1em; font-weight: 500;
    }
    .dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 6px #4ade80;
      animation: pulse 2s ease-in-out infinite;
    }
    .dot.warn { background: var(--yellow); box-shadow: 0 0 6px var(--yellow); }
    .dot.err  { background: #f87171; box-shadow: 0 0 6px #f87171; animation: none; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

    .ts { color: var(--dim); font-size: 10px; letter-spacing: .05em; }

    /* ── Layout ── */
    .container { max-width: 960px; margin: 0 auto; padding: 28px 24px; }

    .section-label {
      font-size: 9px; letter-spacing: .2em; color: var(--dim);
      text-transform: uppercase; font-weight: 500;
      margin-bottom: 10px; border-bottom: 1px solid var(--border);
      padding-bottom: 4px;
    }

    /* ── Stat grid ── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--surface);
      padding: 18px 20px;
    }
    .stat-label {
      font-size: 9px; letter-spacing: .18em;
      text-transform: uppercase; color: var(--dim);
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 32px; font-weight: 700;
      color: var(--yellow); line-height: 1;
    }
    .stat-value.ok  { color: #4ade80; }
    .stat-value.err { color: #f87171; }
    .stat-value.sm  { font-size: 20px; }
    .stat-sub {
      font-size: 10px; color: var(--dim); margin-top: 4px;
    }

    /* ── Status breakdown ── */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      margin-bottom: 24px;
    }
    .status-card {
      background: var(--surface);
      padding: 14px 16px;
      border-top: 2px solid var(--border);
    }
    .status-label { font-size: 9px; letter-spacing: .15em; color: var(--dim); }
    .status-value { font-size: 26px; font-weight: 700; line-height: 1.2; }
    .status-pct   { font-size: 10px; color: var(--dim); }

    /* ── Type distribution ── */
    .type-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 18px 20px;
      margin-bottom: 24px;
    }
    .type-row {
      display: grid;
      grid-template-columns: 180px 1fr 36px 36px;
      align-items: center;
      gap: 12px;
      padding: 5px 0;
      border-bottom: 1px solid var(--border);
    }
    .type-row:last-child { border-bottom: none; }
    .type-label  { font-size: 11px; color: var(--text); }
    .type-bar    { color: var(--green); letter-spacing: -.5px; font-size: 10px; }
    .type-count  { text-align: right; color: var(--yellow); font-weight: 500; }
    .type-pct    { text-align: right; font-size: 10px; }
    .dim         { color: var(--dim); }

    /* ── Endpoint table ── */
    .endpoint-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      border: 1px solid var(--border);
      margin-bottom: 24px;
    }
    .endpoint-table th {
      text-align: left; font-size: 9px; letter-spacing: .15em;
      text-transform: uppercase; color: var(--dim);
      padding: 8px 14px; border-bottom: 1px solid var(--border);
      font-weight: 500;
    }
    .endpoint-table td {
      padding: 9px 14px;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
    }
    .endpoint-table tr:last-child td { border-bottom: none; }
    .method {
      display: inline-block; padding: 2px 7px;
      border-radius: 2px; font-size: 9px; font-weight: 700;
      letter-spacing: .08em;
    }
    .GET    { background: #0f2e1a; color: #4ade80; border: 1px solid #1a4a2a; }
    .POST   { background: #1a1f0a; color: var(--yellow); border: 1px solid #2a300a; }
    .PATCH  { background: #0a1a2e; color: #60a5fa; border: 1px solid #0a2040; }
    .path   { color: var(--text); margin-left: 8px; }
    .desc   { color: var(--dim); font-size: 11px; }
    .badge  {
      font-size: 9px; letter-spacing: .1em;
      padding: 1px 6px; border-radius: 2px;
    }
    .badge-sse { background: #1a0a2e; color: #a78bfa; border: 1px solid #2a1040; }

    /* ── Footer ── */
    .footer {
      text-align: center; color: var(--dim);
      font-size: 10px; letter-spacing: .1em;
      margin-top: 32px;
    }
    .refresh-note { font-size: 9px; color: var(--dim); margin-top: 4px; }

    @media (max-width: 600px) {
      .status-grid { grid-template-columns: repeat(2, 1fr); }
      .type-row { grid-template-columns: 1fr 60px 30px; }
      .type-bar { display: none; }
    }
  </style>
</head>
<body>

<header class="header">
  <div class="header-left">
    <div class="logo-block">
      <span class="logo-o"></span>
      <span class="logo-text">UO</span>
    </div>
    <span class="sys-title">CAMPUS SAFETY · API MONITOR</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px">
    <div class="status-pill">
      <span class="dot${m.dbOk ? '' : ' err'}"></span>
      <span style="color:${m.dbOk ? '#4ade80' : '#f87171'}">${m.dbOk ? 'OPERATIONAL' : 'DEGRADED'}</span>
    </div>
    <span class="ts">${now}</span>
  </div>
</header>

<div class="container">

  <!-- Top stats -->
  <div class="section-label">System Overview</div>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Total Reports</div>
      <div class="stat-value">${m.total}</div>
      <div class="stat-sub">all time</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Resolution Rate</div>
      <div class="stat-value${resolutionRate >= 50 ? ' ok' : ''}">${resolutionRate}<span style="font-size:16px">%</span></div>
      <div class="stat-sub">${m.resolved} resolved</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Anonymous</div>
      <div class="stat-value sm">${anonRate}<span style="font-size:14px">%</span></div>
      <div class="stat-sub">of all submissions</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">With Media</div>
      <div class="stat-value sm">${mediaRate}<span style="font-size:14px">%</span></div>
      <div class="stat-sub">attachments</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Database</div>
      <div class="stat-value${m.dbOk ? ' ok' : ' err'}" style="font-size:18px">${m.dbOk ? 'ONLINE' : 'ERROR'}</div>
      <div class="stat-sub">supabase/postgres</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Uptime</div>
      <div class="stat-value sm" style="font-size:16px">${fmtUptime(m.uptimeMs)}</div>
      <div class="stat-sub">api process</div>
    </div>
  </div>

  <!-- Status breakdown -->
  <div class="section-label">Report Status Distribution</div>
  <div class="status-grid">
    ${statusItems.map(s => `
    <div class="status-card" style="border-top-color:${s.color}">
      <div class="status-label">${s.label}</div>
      <div class="status-value" style="color:${s.color}">${s.value}</div>
      <div class="status-pct">${pct(s.value, m.total)}% of total</div>
      <div style="margin-top:6px;height:2px;background:var(--border)">
        <div style="height:100%;width:${pct(s.value, m.total)}%;background:${s.color};opacity:.6"></div>
      </div>
    </div>`).join('')}
  </div>

  <!-- Type distribution -->
  <div class="section-label">Incident Type Breakdown</div>
  <div class="type-panel">
    ${typeRows || '<div class="dim" style="padding:8px 0;font-size:11px">No reports recorded yet.</div>'}
  </div>

  <!-- Endpoints -->
  <div class="section-label">API Endpoints</div>
  <table class="endpoint-table">
    <thead>
      <tr>
        <th>Method</th>
        <th>Path</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="method GET">GET</span></td>
        <td class="path">/api/health</td>
        <td class="desc">Service heartbeat</td>
      </tr>
      <tr>
        <td><span class="method POST">POST</span></td>
        <td class="path">/api/reports</td>
        <td class="desc">Submit report (anonymous or authenticated)</td>
      </tr>
      <tr>
        <td><span class="method PATCH">PATCH</span></td>
        <td class="path">/api/reports/:id/status</td>
        <td class="desc">Update report status + write audit log</td>
      </tr>
      <tr>
        <td><span class="method GET">GET</span> <span class="badge badge-sse">SSE</span></td>
        <td class="path">/api/reports/realtime</td>
        <td class="desc">Live report stream via Server-Sent Events</td>
      </tr>
      <tr>
        <td><span class="method POST">POST</span></td>
        <td class="path">/api/upload</td>
        <td class="desc">Media upload → Supabase Storage</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    UNIVERSITY OF OREGON &nbsp;·&nbsp; CAMPUS SAFETY REPORTING SYSTEM &nbsp;·&nbsp; INTERNAL USE ONLY
    <div class="refresh-note">auto-refresh every 30s &nbsp;·&nbsp; node ${process.version}</div>
  </div>

</div>
</body>
</html>`;
}
