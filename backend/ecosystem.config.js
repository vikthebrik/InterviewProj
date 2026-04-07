// PM2 ecosystem — production cluster mode.
// cluster.js forks N workers each running the Express app on the same port.
// Run:  npm run prod   Stop: npm run prod:stop
module.exports = {
  apps: [
    {
      name: 'uo-safety-backend',
      script: 'dist/cluster.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '400M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
