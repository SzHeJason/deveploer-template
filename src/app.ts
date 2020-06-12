import http from 'http'

http.createServer((req, res) => {
  res.end('Hello World!')
}).listen('8080', () => {
  console.log('listen 127.0.0.1:8080')
})
