bower install --allow-root
gulp scripts
rm -rf ./app/bower_components/
mkdir ./app/bower_components/
cp -rf bower_components/* ./app/bower_components/
