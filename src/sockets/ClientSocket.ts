import socketIo from 'socket.io';
import { Server } from 'http';

import Socket from './Socket';

import PlayerStore from '../store/PlayerStore';
import ShipStore from '../store/ShipStore';

export default class ClientSocket extends Socket {

  constructor(server: Server) {
    super(server, '/socket');
  }

  listen(): void {
    this.io
    .of('/client')
    .on('connect', (socket: socketIo.Socket) => {
      socket.on('ENTER_GAME', () => {
        PlayerStore.assignRole(socket.id.replace('/client#', ''))
        .then((encodedRole: string) => {
          const decodedRole: string[] = encodedRole.split('-');
          // tslint:disable-next-line
          console.log(`User ${socket.id.replace('/client#', '')} connected to ship ${decodedRole[0]} and role ${decodedRole[1]}`);
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
        // tslint:disable-next-line
        console.log(`Ship ${ship} power distributions is now ${distribution.join(',')}`);
        ShipStore.changePowerDistribution(ship, distribution);
      });

      socket.on('ANGLE_CHANGED', (encodedData) => {
        const { ship, role, angle, on: active } = encodedData;
        console.log(`${role} of ship ${ship} is pointed at ${angle}`);
        ShipStore.changeAngle(ship, role, angle, active);
      });

      socket.on('disconnect', () => {
        PlayerStore.deassignRole(socket.id.replace('/client#', ''));
      });
    });
  }
}
