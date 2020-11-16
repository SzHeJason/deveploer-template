import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'

import logger from '../helper/logger'
import ServiceError from '../helper/error'

const ErrorHandler: FastifyPluginCallback = (server, options, done) => {
  server.setErrorHandler(function (error, request, reply) {
    if (error instanceof ServiceError) {
      const result = error.toObject()

      logger('service-error').error({
        ...result,
        stack: error.stack,
      })

      reply.statusCode = 200
      reply.send(result)

      return
    }

    logger('server-error').error(error)

    reply.send(error)
  })

  done()
}

export default fastifyPlugin(ErrorHandler)
