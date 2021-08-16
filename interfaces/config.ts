export default interface IConfig extends IProcessEnv {
  /**
   * 服务监听端口
   */
  PORT: number
}

export interface WhiteListConfig {
  protobuf: string[]
}
