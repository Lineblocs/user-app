#! /bin/bash

echo "starting gulp dev server..."
gulp compress-css && gulp scripts && gulp compress-js && cp -rf app/scripts/main.min.js app/dist/ && gulp serve
