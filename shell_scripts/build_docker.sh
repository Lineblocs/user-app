npm rebuild node-sass
./shell_scripts/build_css_docker.sh
./shell_scripts/build_js_docker.sh
cp ./app/index-prod.html ./app/index.html
cp ./dist/main.min.js ./app/scripts/