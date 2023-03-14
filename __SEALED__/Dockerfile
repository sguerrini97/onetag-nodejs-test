FROM node:16

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm config set cache /tmp --global
RUN npm install

COPY . .

CMD [ "npm", "run", "start:services" ]
