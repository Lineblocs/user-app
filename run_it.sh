#! /bin/bash
PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ gulp compress-css
httpd-foreground
