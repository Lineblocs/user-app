#! /bin/bash
gulp compress-css
gulp compress-js
cp ./app/index-prod.html ./app/index.html

gulp serve
