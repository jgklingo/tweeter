#!/bin/bash

set -e

cd "$(dirname "$0")"

npm run build
rm -f dist.zip
cd dist || exit 1
zip -qr ../dist.zip ./*
cd ..
echo dist.zip created
