import fastify from 'fastify'
import { nanoid } from 'nanoid'


import config from './app/utils/config'

const app = fastify({
  genReqId(){
    return nanoid()
  }
})

app.listen(config.get('PORT'), '0.0.0.0').then(() => {
  console.log(
    '\x1B[36m%s\x1B[0m',
    `[${Date.now()}] START (default): Server listening at http://0.0.0.0:${config.get(
      'PORT'
    )}`
  )
})
