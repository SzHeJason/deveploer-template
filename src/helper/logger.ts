import _ from 'lodash'
import path from 'path'
import pino from 'pino'
import fs from 'fs-extra'

import { isDevelopment, isProduction } from './environment'
import config from './config'

const loggerCache: Record<string, pino.Logger> = {}

export default function createLogger(
  options: string | pino.LoggerOptions,
  destination?: pino.DestinationStream
) {
  const _options: pino.LoggerOptions = {
    nestedKey: 'payload',
    prettyPrint: isDevelopment,
    level: process.env.LOG_LEVEL || 'info',
  }

  if (_.isString(options)) {
    _options.name = options
  } else {
    Object.assign(_options, options)
  }

  if (!_options.name) {
    _options.name = 'default'
  }

  if (loggerCache[_options.name]) {
    return loggerCache[_options.name]
  }

  let logger: pino.Logger
  const basePath = config.get('LOG_BASE_PATH')

  if (destination) {
    logger = pino(_options, destination)
  } else if (basePath && isProduction) {
    // 将日志输出到文件
    const dest = path.join(basePath, _options.name)

    fs.ensureDirSync(basePath)

    logger = pino(
      _options,
      pino.destination({
        dest,
        sync: false,
      })
    )
  } else {
    logger = pino(_options)
  }

  loggerCache[_options.name] = logger

  return logger
}
