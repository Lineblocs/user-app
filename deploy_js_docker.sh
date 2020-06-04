PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ bower install --allow-root
PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ gulp compress-js
rm -rf ./app/bower_components/
mkdir ./app/bower_components/
cp -rf bower_components/* ./app/bower_components/
