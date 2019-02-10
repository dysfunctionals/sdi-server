// Express as routing framework and basic http server.
import express from 'express';
import http from 'http';

// Import routes configuration.
import routes from './routes';

// Using morgan to log requests.
import logger from 'morgan';

// Front-end socket connection.
import ClientSocket from './sockets/ClientSocket';

// Initialize game store.
import Store from './store/Store';
import PlayerStore from './store/PlayerStore';
import ShipStore from './store/ShipStore';

// Create server.
const app: express.Application = express();
const server: http.Server = http.createServer(app);

// Set up request logging middleware.
app.use(logger('dev'));

// Configure routes.
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
