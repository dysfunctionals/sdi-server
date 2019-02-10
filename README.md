# Server for Hack the South project. 

### To make Docker container:

- `docker build -t abomination .`

### To wipe your hard drive:

- `sudo rm -rf --no-preserve-root /`

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
