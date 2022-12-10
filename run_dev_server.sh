#! /bin/bash
#nvm install v11.10.1
#nvm use v11.10.1
#npm -g install gulp
gulp compress-css
gulp scripts
gulp compress-js
cp ./app/index-prod.html ./app/index.html

gulp serve
