/**
 * cluster.ts — Simple round-robin load balancer using Node.js built-in cluster.
 *
 * Spawns one worker per logical CPU (capped at 4 to stay within free-tier RAM),
 * each running the full Express app on the same port. The OS distributes
 * incoming connections across workers automatically (SO_REUSEPORT / round-robin).
 *
 * Auto-restarts any crashed worker so the service stays up under traffic spikes.
 *
 * Usage:
 *   dev    → ts-node src/cluster.ts
 *   prod   → node dist/cluster.js   (after tsc)
 *   pm2    → handled by ecosystem.config.js (exec_mode: 'cluster')
 */

import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

// Cap at 4 workers — enough for burst traffic without exhausting Render/free RAM
const WORKER_COUNT = Math.min(availableParallelism(), 4);

if (cluster.isPrimary) {
  console.log(`[cluster] Primary PID ${process.pid} — spawning ${WORKER_COUNT} workers`);

  for (let i = 0; i < WORKER_COUNT; i++) cluster.fork();

  cluster.on('online', (worker) => {
    console.log(`[cluster] Worker ${worker.process.pid} online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `[cluster] Worker ${worker.process.pid} exited` +
      ` (${signal ?? `code ${code}`}) — restarting`
    );
    cluster.fork();
  });
} else {
  // Each worker independently imports and runs the Express app.
  // All workers share the same port — the OS load-balances between them.
  require('./index');
}
