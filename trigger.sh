#!/bin/sh
set -e

npm install
npm run build
git commit -am "generate site"
npm run deploy
