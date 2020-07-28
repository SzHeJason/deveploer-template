import _ from 'lodash'
import pino from 'pino'

import { isDevelopment } from './environment'

export default function createLogger(
  options: string | pino.LoggerOptions,
  destination?: pino.DestinationStream
) {
  const _options: pino.LoggerOptions = {
    nestedKey: 'payload',
    prettyPrint: isDevelopment(),
    level: process.env.LOG_LEVEL || 'info',
  }

  if (_.isString(options)) {
    _options.name = options
  } else {
    Object.assign(_options, options)
  }

  if (destination) {
    return pino(_options, destination)
  }

  return pino(_options)
}
