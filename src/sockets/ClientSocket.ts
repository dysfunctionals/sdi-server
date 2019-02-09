import socketIo from 'socket.io';
import { Server } from 'http';

import Socket from './Socket';

import PlayersStore from '../store/PlayersStore';

export default class ClientSocket extends Socket {

  constructor(server: Server) {
    super(server, '/socket');
  }

  listen(): void {
    this.io
    .of('/client')
    .on('connect', (socket: socketIo.Socket) => {
      socket.on('NAME_SELECTION', (name: string) => {
        if (name.length !== 2 || !(/^[a-zA-Z]+$/).test(name)) {
          socket.emit('INVALID_NAME', true);
          return;
        }
        PlayersStore.assignRole()
        .then((encodedRole: string) => {
          const decodedRole: string[] = encodedRole.split('-');
          socket.emit('ROLE_SELECTED', JSON.stringify({
            ship: decodedRole[0],
            role: decodedRole[1],
          }));
        })
        .catch(() => {
          socket.emit('GAME_FULL', true);
        });
      });
    });
  }
}
