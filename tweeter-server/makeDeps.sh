#!/bin/bash

set -e

cd "$(dirname "$0")"

npm install
(cd ../tweeter-shared && npm run build)

mkdir -p nodejs
cp -rL node_modules nodejs/

rm -f nodejs.zip
zip -qr nodejs.zip nodejs

rm -rf nodejs
echo "nodejs.zip created"
