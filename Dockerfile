FROM node:16.20

WORKDIR /app

COPY package.json /app

COPY package-lock.json /app

RUN npm i -D ts-node@10.9.1 typescript@5.2.2

RUN npm install

COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]