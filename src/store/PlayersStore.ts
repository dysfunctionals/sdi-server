import redis from 'redis';
import { promisify } from 'util';

export default class PlayersStore {

  private client: redis.RedisClient;

  constructor(options?: Object) {

    this.client = options ? redis.createClient(options) : redis.createClient();
  }

  populatePositionsList() {

    // Start transaction.
    const multi: redis.Multi = this.client.multi();

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
  assignRole(): Promise<string> {

    return new Promise((resolve, reject) => {

      this.client.rpop('open-roles', (err: Error | null, result: string) => {
        if (err || result === null) {
          reject(err || Error('Roles not available'));
        }
        resolve(result);
      });
    });
  }
}
