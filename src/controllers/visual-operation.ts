import { FastifyPluginCallback } from 'fastify'

const VisualOperationController: FastifyPluginCallback = (
  server,
  options,
  next
) => {
  server.get('/', (request, reply) => {
    reply.send('hello world')
  })
  next()
}

export default VisualOperationController
