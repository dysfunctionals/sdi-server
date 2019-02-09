import socketIo from 'socket.io';
import { Server } from 'http';

export default abstract class Socket {

  protected io: socketIo.Server;

  constructor(server: Server, path: string) {
    this.io = socketIo(server, {
      path,
    });
  }

  abstract listen(): void;
}
