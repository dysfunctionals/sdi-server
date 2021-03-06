import socketIo from 'socket.io';
import { Server } from 'http';

import Socket from './Socket';

import PlayerStore from '../store/PlayerStore';
import ShipStore from '../store/ShipStore';

export default class ClientSocket extends Socket {

  constructor(server: Server) {
    super(server);
  }

  listen(): void {
    this.io
    .of('/client')
    .on('connect', (socket: socketIo.Socket) => {
      socket.on('ENTER_GAME', () => {
        PlayerStore.assignRole(socket.id.replace('/client#', ''))
        .then((encodedRole: string) => {
          const decodedRole: string[] = encodedRole.split('-');
          socket.emit('ROLE_SELECTED', JSON.stringify({
            ship: decodedRole[0],
            role: decodedRole[1],
          }));
        })
        .catch(() => {
          socket.emit('GAME_FULL', true);
          socket.disconnect();
        });
      });

      socket.on('POWER_CHANGED', (encodedData) => {
        const { ship, ...distribution } = encodedData;
        ShipStore.changePowerDistribution(ship, distribution);
      });

      socket.on('ANGLE_CHANGED', (encodedData) => {
        const { ship, role, angle, on: active } = encodedData;
        ShipStore.changeAngle(ship, role, angle, active);
      });

      socket.on('disconnect', () => {
        PlayerStore.deassignRole(socket.id.replace('/client#', ''));
      });
    });
  }
}
