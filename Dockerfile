FROM httpd:2.4
WORKDIR /usr/local/apache2/htdocs/
RUN apt-get -y update
RUN apt-get -y install wget xz-utils python git
RUN wget -O /usr/share/node.tar.xz https://nodejs.org/dist/v11.10.1/node-v11.10.1-linux-x64.tar.xz
RUN cd /usr/share/ && tar xvf /usr/share/node.tar.xz
COPY . .
RUN chmod 0755 *.sh
RUN PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ npm config set unsafe-perm=true
RUN PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ npm install
RUN PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ npm install -g install gulp@3.9.1
RUN PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ npm install -g install node-sass@4.13.0 --unsafe-perm
RUN PATH=$PATH:/usr/share/node-v11.10.1-linux-x64/bin/ npm install -g install bower@1.8.8
RUN ./deploy_docker.sh

COPY ports.conf /etc/apache2/ports.conf
COPY apache.conf /usr/local/apache2/conf/httpd.conf
ENV PORT 80
EXPOSE 80
ENTRYPOINT ["./entrypoint.sh"]
