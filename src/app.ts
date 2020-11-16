import fastify from 'fastify'
import cors from 'fastify-cors'

import Logger from './helper/logger'
import config from './helper/config'

import Initialize from './plugins/initialize'
import ReplyDecorator from './decorators/reply'
import ErrorHandler from './plugins/error-handler'

import ProtobufController from './controllers/protobuf'

const app = fastify({
  logger: Logger({
    name: 'http',
    level: 'debug',
  }),
})

/**
 * Plugins
 */
app.register(cors)
app.register(Initialize)
app.register(ErrorHandler)

/**
 * Decorators
 */
app.register(ReplyDecorator)

/**
 * Contoller
 */
app.register(ProtobufController, { prefix: '/api/protobuf' })

app.listen(config.get('PORT'))
