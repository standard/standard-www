#!/bin/sh
set -e
cd generate-site
npm install
npm start
cd ..
git commit -am "generate site"
git push origin gh-pages
