FROM node:14.15.1-alpine

LABEL maintainer="kurthe <kurthe@tencent.com>"
LABEL descrition="protobuf service" 

RUN apk add --no-cache --update bash

WORKDIR /app

COPY . .

RUN \
  yarn install --pure-lockfile && \
  yarn run build && \
  rm -rf /app/src

ENV PORT 9000
ENV NODE_ENV='production'
ENV PINO_LOG_PATH='/app/logs'
ENV PROTOBUF_PATH='/app/protobufs'
ENV LOG_LEVEL='info'

EXPOSE ${PORT}

CMD ["node", "./dist/app.js"]

# Use to debug if things don't start:
# CMD ["/bin/sh", "-c", "sleep 3600"]