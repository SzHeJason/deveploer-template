FROM node:14-alpine as builder

WORKDIR /build

COPY package.json yarn.lock tsconfig.json .npmrc  ./
COPY app ./app
COPY config ./config

RUN yarn install --pure-lockfile  && \
  yarn run tsc -- --outDir ./dist

######## 分割线 ######## 


FROM node:14-alpine

WORKDIR /app

COPY --from=builder /build/dist ./
COPY package.json yarn.lock .npmrc ./

RUN yarn install --pure-lockfile --production

CMD ["npm","start"]
