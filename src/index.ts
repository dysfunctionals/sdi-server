import express from 'express';
import http from 'http';

import routes from './routes';

import logger from 'morgan';

import ClientSocket from './sockets/ClientSocket';

import Store from './store/Store';
import PlayerStore from './store/PlayerStore';
import ShipStore from './store/ShipStore';

// Create server.
const app: express.Application = express();
const server: http.Server = http.createServer(app);

// Set up logging middleware.
app.use(logger('dev'));

// Configurate routes.
routes(app);

// Initialize stores.
Store.init(() => {
  PlayerStore.populatePositionsList();
  ShipStore.populateShipData();
});

// Instantiate client socket.
const socket: ClientSocket = new ClientSocket(server);

// Start listening for requests.
server.listen(8080, (err: Error) => {
  if (err) {
    throw err;
  }
  // Start listening for socket connections.
  socket.listen();
  // tslint:disable-next-line
  console.log('Server listening on port 8080');
});
