import socketIo from 'socket.io';
import { Server } from 'http';

import Socket from './Socket';

export default class ClientSocket extends Socket {

  constructor(server: Server) {
    super(server, '/socket');
  }

  listen(): void {
    this.io
    .of('/client')
    .on('connect', (socket: socketIo.Socket) => {
      socket.on('name', (name: string) => {
        socket.emit('greet', `Hello ${name}!`);
      });
    });
  }
}
