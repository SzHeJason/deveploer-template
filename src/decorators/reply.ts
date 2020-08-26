import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginCallback, FastifyReply } from 'fastify'

import { ResponseStruct } from '../interfaces/struct'

declare module 'fastify' {
  interface FastifyReply {
    sendSuccess<T = any>(data: T): ResponseStruct<T>
  }
}

const ReplyDecorator: FastifyPluginCallback = (server, options, done) => {
  server.decorateReply('sendSuccess', function (
    this: FastifyReply,
    data: unknown
  ) {
    this.send({
      data,
      code: 0,
      subcode: 0,
      message: 'success',
    })
  })

  done()
}

export default fastifyPlugin(ReplyDecorator)
