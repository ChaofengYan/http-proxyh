const http = require('http');
const net = require('net');
const url = require('url');

//普通http代理
const request = (req, res) => {
  const {hostname,port=80,path,method,headers} = url.parse(req.url);
  console.log(`代理：${hostname}/${path}:${port}`);
  const _req = http.request({hostname,port,path,method,headers}, (_res) => {
    res.writeHead(_res.statusCode, _res.headers);
    _res.pipe(res);
  }).on('error', (e) => {
    res.end();
  });
  req.pipe(_req);
}

//CONNECT代理，适用https
const connect = (req, sock) => {
  const {port,hostname} = url.parse('http://' + req.url);
  console.log(`代理：${hostname}:${port}`);
  const _sock = net.connect(port, hostname, () => {
    sock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    _sock.pipe(sock);
  }).on('error', (e) => {
    sock.end();
  });
  sock.pipe(_sock);
}

http.createServer()
  .on('request', request)
  .on('connect', connect)
  .listen(8888, '0.0.0.0');
