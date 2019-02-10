# Server for Hack the South project. 
## About
The base server to handle connections from the client and to then efficiently pass the current state on to the display. This is packaged in docker for maximum portability.

## Installation
### To make Docker container:

- `docker build -t abomination .`

### To launch Docker container:

- `docker run -p 8080:8080 -it abomination`

### To find out your ping to google:

- `ping google.com`

### To run in Docker container:

- `redis-server &`
- `cd app`
- `npm run dev`

Production build: npm build  
Run in dev mode: npm run dev  
Linting: npm run lint  
