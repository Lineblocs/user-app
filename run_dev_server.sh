#! /bin/bash
nvm use v11.10.1
gulp compress-css
gulp scripts
gulp compress-js
cp ./app/index-prod.html ./app/index.html

gulp serve
