#!/bin/sh

( ./node_modules/.bin/sequelize db:create --config config/database.json || true ) &&
./node_modules/.bin/sequelize db:migrate --config config/database.json &&