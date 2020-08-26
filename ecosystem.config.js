const APP_NAME = 'fastify'
const LOG_PATH = `/data/log/${APP_NAME}`

module.exports = {
  apps: [
    {
      name: APP_NAME,
      script: './dist/app.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PINO_LOG_PATH: LOG_PATH,
      },
      error: `${LOG_PATH}/pm2-error.log`,
      output: `${LOG_PATH}/pm2-out.log`,
      merge_logs: true,
    },
  ],
}
