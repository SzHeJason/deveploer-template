import fastify from 'fastify'

import logger from './helper/logger'
import config from './helper/config'

import VisualOperationController from './controllers/visual-operation'

const app = fastify({
  logger: logger({
    name: 'http',
  }),
})

app.register(VisualOperationController)

app.listen(config.get('PORT'))
