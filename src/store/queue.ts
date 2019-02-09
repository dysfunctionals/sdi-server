import redis from 'redis';

export default class QueueStore {

  client: redis.RedisClient;

  constructor() {
    this.client = redis.createClient();
  }
}
