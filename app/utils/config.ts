/* eslint-disable @typescript-eslint/no-var-requires,no-empty */
/**
 * 根据环境变量合并 config 
 */
import path from 'path'

import State from './state'
import baseConfig from '../../config/base'
import IConfig from '../../interfaces/config'

const NODE_ENV = process.env.NODE_ENV

let config = baseConfig

if (NODE_ENV) {
  try {
    const modulePath = path.join(__dirname, '../config', `${NODE_ENV}.ts`)
    const envConfig = require(modulePath)
    // eslint-disable-next-line
    config = Object.assign({}, config, envConfig.default)
  } catch (e) { }
}

export default new State<IConfig>(config)
