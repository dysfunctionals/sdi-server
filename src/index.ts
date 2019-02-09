import express from 'express';
import http from 'http';
import ClientSocket from './sockets/client';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const socket: ClientSocket = new ClientSocket(server);

server.listen(3000, (err: Error) => {
  if (err) {
    throw err;
  }
  // tslint:disable-next-line
  console.log('Server listening on port 3000');
});
