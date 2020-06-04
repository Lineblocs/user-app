PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ gulp compress-css
rm -rf app/styles/app-blue.css
rm -rf app/styles/styles-dir
PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ node-sass app/styles/app-blue.scss -o app/styles/styles-dir
mv  app/styles/styles-dir/app-blue.css app/styles/app-blue.css
rm -rf app/styles/styles-dir
