# Peacefull Mind

## Usage

After you have cloned the repo, start the project with `npm install` command.
This will install all project dependecies
You can simply start the project with `npm start`

## NPM scripts

- `npm run start:build`: It tells the TypeScript compiler to watch for changes in your TypeScript source files and automatically recompile them whenever they are modified.
- `npm run start:run`: It will run the compilled server.js file from `./dist` folder
- `npm start`: It will run all the npm script concurrently starting with npm:start:\*
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

## If you have docker installed in your host machine

You can simply run the npm script `npm run dc:up` and your server will be up and running.
To list all the running containers and ports attached with them you can type `docker ps` in your terminal
