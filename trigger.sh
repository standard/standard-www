#!/bin/sh
set -e
cd generate-site
npm install
npm run build
cd ..
git commit -am "generate site"
git push origin gh-pages
