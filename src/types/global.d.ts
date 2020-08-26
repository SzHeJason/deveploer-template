export {}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PINO_LOG_PATH?: string
    }
  }
}
