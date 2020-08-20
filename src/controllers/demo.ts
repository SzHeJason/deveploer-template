import { FastifyPluginCallback } from 'fastify'

const DemoController: FastifyPluginCallback = (server, options, next) => {
  server.get('/demo', (request, reply) => {
    reply.send('hello world')
  })
  next()
}

export default DemoController
