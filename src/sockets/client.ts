import socketIo from 'socket.io';
import { Server } from 'http';

export default class ClientSocket {

  io: socketIo.Server;

  constructor(server: Server) {
    this.io = socketIo(server);
  }

  init(): void {
    this.io.on('connect', (socket: socketIo.Socket) => {

    });
  }
}
