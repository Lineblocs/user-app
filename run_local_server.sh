#! /bin/bash
PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ gulp compress-css
INDEX_PATH='app/index.html'

sed "s/CONFIGURED_DEPLOYMENT_DOMAIN/${DEPLOYMENT_DOMAIN}/g" $INDEX_PATH > $INDEX_PATH.cop
mv $INDEX_PATH.cop $INDEX_PATH

APACHE_CFG='/usr/local/apache2/conf/httpd.conf'
sed "s/DEPLOYMENT_DOMAIN/${DEPLOYMENT_DOMAIN}/g" $APACHE_CFG > $APACHE_CFG.cop
mv $APACHE_CFG.cop $APACHE_CFG

export PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/

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

gulp serve
