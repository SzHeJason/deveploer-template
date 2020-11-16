import fastifyPlugin from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'

const Initialize: FastifyPluginCallback = (server, options, done) => {
  server.addHook('onReady', function (next) {
    if (!process.env.PROTOBUF_PATH) {
      next(new Error('缺少启动的环境变量 PROTOBUF_PATH'))
    }

    next()
  })

  server.addHook('preHandler', function (req, reply, next) {
    if (req.body) {
      req.log.info({ body: req.body }, 'parsed body')
    }

    next()
  })

  done()
}

export default fastifyPlugin(Initialize)
