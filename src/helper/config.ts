/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires */
import path from 'path'

import defaultConfig from '../config/default'
import IConfig from '../interfaces/config'

class Config {
  payload: IConfig

  constructor(payload: IConfig) {
    this.payload = payload
  }

  get(key: keyof IConfig) {
    return this.payload[key]
  }

  has(key: keyof IConfig) {
    return Boolean(this.payload[key])
  }
}

const NODE_ENV = process.env.NODE_ENV

let config = defaultConfig

if (NODE_ENV) {
  try {
    const modulePath = path.join(__dirname, '../config', NODE_ENV)
    const envConfig = require(modulePath)
    config = Object.assign({}, config, envConfig)
  } catch (e) {}
}

export default new Config(config)
