import pino from 'pino'

import State from './state'

const cache = new State<Record<string, pino.Logger>>({})

const rootLogger = pino({
  formatters: {
    level (label: string) {
      return {
        level: label
      }
    }
  }
})

export default function createLogger (name: string) {
  if (cache.has(name)) {
    return cache.get(name)
  }

  const logger = rootLogger.child({
    name
  })

  cache.set(name, logger)

  return logger
}
