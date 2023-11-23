FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

# CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "run", "start:dev" ]