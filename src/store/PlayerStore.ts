import { Multi } from 'redis';

import Store from './Store';

export default class PlayerStore extends Store {

  // Populare the empty positions list with the available positions.
  public static populatePositionsList() {

    // Start transaction.
    const multi: Multi = this.client.multi();

    // Add positions to list.
    for (let ship: number = 0; ship < 4; ship++) {
      ['power', 'engine', 'shields', 'weapons'].forEach((role: string) => {
        multi.lpush('open-roles', `${ship}-${role}`);
      });
    }

    // Execute transaction.
    multi.exec();
  }

  // Check if any roles are open. If role is open, assign to player.
  // If no roles open, send error.
  public static assignRole(userId: string): Promise<string> {

    return new Promise((resolve, reject) => {

      this.client.rpop('open-roles', (err: Error | null, result: string) => {
        if (err || result === null) {
          reject(err || Error('Roles not available'));
          return;
        }
        this.client.set(userId, result, (err: Error | null, status: string) => {
          if (err) {
            reject(err);
            return;
          }
          if (status === 'OK') {
            resolve(result);
            return;
          }
          reject(new Error('Failed to assign user the role'));
        });
      });
    });
  }

  public static deassignRole(userId: string) {

    this.client.get(userId, (err: Error | null, result) => {
      if (err) {
        throw err;
      }
      if (result === null) {
        return;
      }
      this.client.lpush('open-roles', result, (err: Error | null) => {
        if (err) {
          throw err;
        }
      });
    });
  }
}
