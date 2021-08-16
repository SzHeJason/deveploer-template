export {}

declare global {
  interface IProcessEnv {
    NODE_ENV: 'development' | 'production' | 'testing'
    /**
     * pino 文件存放地址
     * @tip 不填默认打印在控制台
     */
    PINO_LOG_PATH?: string
  }

  declare namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
