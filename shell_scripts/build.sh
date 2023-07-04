./shell_scripts/build_css.sh
./shell_scripts/build_js.sh
cp ./app/index-prod.html ./app/index.html
PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ gulp compress-css
