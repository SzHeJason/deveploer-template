import fastify from 'fastify'
import cors from 'fastify-cors'

import logger from './helper/logger'
import config from './helper/config'

import ReplyDecorator from './decorators/reply'
import ErrorHandler from './plugins/error-handler'

import DemoController from './controllers/demo'

const app = fastify({
  logger: logger({
    name: 'http',
  }),
})

app.addHook('preHandler', function (req, reply, next) {
  if (req.body) {
    req.log.info({ body: req.body }, 'parsed body')
  }
  next()
})

app.register(cors)

app.register(ErrorHandler)
app.register(ReplyDecorator)

app.register(DemoController)

app.listen(config.get('PORT'))
