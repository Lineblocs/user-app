#! /bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v11.10.1
nvm use v11.10.1
npm -g install gulp
npm -g install bower
npm install
bower install --allow-root
gulp compress-css
gulp scripts
gulp compress-js
rm -rf app/dist && cp -rf dist app/
cp ./app/index-prod.html ./app/index.html

#gulp serve
gulp watch
