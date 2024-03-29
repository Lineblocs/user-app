#! /bin/bash
INDEX_PATH='app/index.html'

sed "s/CONFIGURED_DEPLOYMENT_DOMAIN/${DEPLOYMENT_DOMAIN}/g" $INDEX_PATH > $INDEX_PATH.cop
mv $INDEX_PATH.cop $INDEX_PATH

APACHE_CFG='/usr/local/apache2/conf/httpd.conf'
sed "s/DEPLOYMENT_DOMAIN/${DEPLOYMENT_DOMAIN}/g" $APACHE_CFG > $APACHE_CFG.cop
mv $APACHE_CFG.cop $APACHE_CFG
httpd-foreground
