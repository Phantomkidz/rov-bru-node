FROM node:12.22.1-alpine3.12

ARG NODE_ENV=development
RUN echo "NODE_ENV => ${NODE_ENV}"
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# update and install dependency
RUN apk update && apk upgrade

# Install yarn
RUN apk add yarn

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
