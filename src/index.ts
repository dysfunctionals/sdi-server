import express from 'express';
import http from 'http';
import ClientSocket from './sockets/ClientSocket';
import PlayersStore from './store/PlayersStore';

// Create server.
const app: express.Application = express();
const server: http.Server = http.createServer(app);

// Instantiate player store.
// tslint:disable-next-line:max-line-length
const store: PlayersStore = new PlayersStore();
store.populatePositionsList();

// Instantiate client socket.
const socket: ClientSocket = new ClientSocket(server);

// Start listening for requests.
server.listen(3000, (err: Error) => {
  if (err) {
    throw err;
  }
  // Start listening for socket connections.
  socket.listen();
  // tslint:disable-next-line
  console.log('Server listening on port 3000');
});
