import { Multi, RedisClient } from 'redis';

import Store from './Store';

export default class ShipStore extends Store {

  public static populateShipData() {

    // Start transaction.
    const multi: Multi = this.client.multi();

    // Generate default ship stats.
    for (let ship: number = 0; ship < 4; ship++) {
      ['engine', 'weapons', 'shields'].forEach((role: string) => {
        multi.hmset(`ship:${ship}:${role}`, {
          power: 33,
          angle: 0,
          active: 0,
        });
      });
    }

    // Execute transaction.
    multi.exec();
  }

  public static changePowerDistribution(ship: number, distribution: { [index:string] : string }) {

    // Start transaction.
    const multi: Multi = this.client.multi();

    // Change distribution.
    ['engine', 'weapons', 'shields'].forEach((role: string) => {
      multi.hset(`ship:${ship}:${role}`, 'power', distribution[role]);
    });

    // Execute transaction.
    multi.exec();
  }

  public static changeAngle(ship: number, role: string, angle: string) {

    this.client.hset(`ship:${ship}:${role}`, 'angle', angle);
  }

  public static getShipMetrics(): Promise<Object> {

    // Start transaction.
    const multi: Multi = this.client.multi();

    // Get metrics from each ship.
    for (let ship: number = 0; ship < 4; ship++) {
      ['engine', 'weapons', 'shields'].forEach((role: string) => {
        multi.hgetall(`ship:${ship}:${role}`);
      });
    }

    // Execute transaction.
    return new Promise((resolve, reject) => {

      multi.exec((err: Error | null, results) => {
        if (err) {
          reject(err);
          return;
        }
        const metrics: Object[] = [];
        const resultsLength: number = results.length;
        for (let index: number = 0; index < resultsLength; index += 3) {
          const shipData = {
            engine: {},
            weapons: {},
            shields: {},
          };

          shipData.engine = results[index];
          shipData.weapons = results[index + 1];
          shipData.shields = results[index + 2];

          metrics.push(shipData);
        }
        resolve(metrics);
      });
    });
  }
}
