import socketIo from 'socket.io';
import { Server } from 'http';

export default class ClientSocket {

  io: socketIo.Server;

  constructor(server: Server) {
    this.io = socketIo(server, {
      path: '/socket',
    });

    this.init();
  }

  init(): void {
    this.io
    .of('/client')
    .on('connect', (socket: socketIo.Socket) => {
      socket.on('name', (name: string) => {
        socket.emit('greet', `Hello ${name}!`);
      });
    });
  }
}
