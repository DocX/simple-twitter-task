#!/bin/sh

export NODE_ENV=production
export PORT=4000

yarn install && 
( ./node_modules/.bin/sequelize db:create --config config/database.json || true ) &&
./node_modules/.bin/sequelize db:migrate --config config/database.json &&
yarn run start
