/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires */
import path from 'path'

import IConfig from '../interfaces/config'
import baseConfig from '../config/base'

const NODE_ENV = process.env.NODE_ENV

class Config {
  payload: IConfig

  constructor(payload: IConfig) {
    this.payload = payload
  }

  get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.payload[key]
  }

  has(key: keyof IConfig) {
    return Boolean(this.payload[key])
  }
}

let config = baseConfig

if (NODE_ENV) {
  try {
    const modulePath = path.join(__dirname, '../config', `${NODE_ENV}.ts`)
    const envConfig = require(modulePath)
    // eslint-disable-next-line
    config = Object.assign({}, config, envConfig.default)
  } catch (e) {}
}

export default new Config(config)