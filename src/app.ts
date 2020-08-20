import fastify from 'fastify'

import logger from './helper/logger'
import config from './helper/config'

import DemoController from './controllers/demo'

const app = fastify({
  logger: logger({
    name: 'http',
  }),
})

app.register(DemoController)

app.listen(config.get('PORT'))
