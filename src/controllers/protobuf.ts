import { FastifyPluginCallback, FastifyRequest } from 'fastify'

import protobufService, { RequestParams } from '../services/protobuf'

const ProtobufController: FastifyPluginCallback = (server, options, next) => {
  server.post(
    '/',
    async (request: FastifyRequest<{ Body: RequestParams }>, reply) => {
      const res = await protobufService.request({
        key: '9.131.136.26:9000',
        file: 'rank.proto',
        packageName: 'wesing.service.rank_center',
        serviceName: 'RankCenter',
        action: 'GetActivityConfig',
        payload: {
          activity_id: '5f4e2ad56f643136f6035e16',
        },
        ...request,
      })

      reply.send(res)
    }
  )

  next()
}

export default ProtobufController
