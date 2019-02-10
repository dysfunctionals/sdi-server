import redis from 'redis';

export default abstract class Store {

  protected static client: redis.RedisClient;

  public static init(cb?: CallableFunction, options?: Object) {

    this.client = options ? redis.createClient(options) : redis.createClient();
    this.client.flushall((err: Error | null) => {
      if (err) {
        throw err;
      }
      if (cb) {
        cb();
      }
    });
  }
}
