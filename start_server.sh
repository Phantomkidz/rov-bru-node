#!/bin/sh
cp -f .env.dev .env

docker-compose down --rmi all

docker-compose build --build-arg NODE_ENV=production

docker-compose up -d

docker volume prune -f