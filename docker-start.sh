#!/bin/sh

yarn install && 
./db-migrate.sh &&
yarn run start
