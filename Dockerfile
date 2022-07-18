FROM node:12.22.1-alpine3.12

ARG NODE_ENV=development
RUN echo "NODE_ENV => ${NODE_ENV}"
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
