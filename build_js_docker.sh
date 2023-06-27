bower install --allow-root
gulp compress-js
rm -rf ./app/bower_components/
mkdir ./app/bower_components/
cp -rf bower_components/* ./app/bower_components/
cp -rf dist app/