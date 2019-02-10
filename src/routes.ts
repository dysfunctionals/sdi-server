import { Application, Request, Response } from 'express';

import ShipStore from './store/ShipStore';

const routes = (app: Application) => {

  // Route for game to access user input.
  app.route('/metrics')
    .get((req: Request, res: Response) => {

      ShipStore.getShipMetrics()
      .then(metrics => res.json(metrics))
      .catch(err => res.json(err));
    });
};

export default routes;
