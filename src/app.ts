import fastify from 'fastify'

import logger from './helper/logger'
import config from './helper/config'

const app = fastify({
  logger: logger('http'),
})

app.listen(config.get('PORT'))
