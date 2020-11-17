import { FastifyPluginCallback } from 'fastify'

import protobufService from '../services/protobuf'

import { bodySchema, BodySchme } from '../schemas/protobuf'

const ProtobufController: FastifyPluginCallback = (server, options, next) => {
  server.post<{
    Body: BodySchme
  }>(
    '/',
    {
      schema: {
        body: bodySchema,
      },
    },
    async (request, reply) => {
      const res = await protobufService.request(request.body)

      reply.send(res)
    }
  )

  next()
}

export default ProtobufController
