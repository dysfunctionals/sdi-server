import redis from 'redis';

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
}
