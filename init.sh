#!/bin/sh
rm -rf /tmp/vertcoin-box
mkdir -p /tmp/vertcoin-box
cd /tmp/vertcoin-box
git clone --depth 1 https://github.com/gertjaap/vertcoin-box
git clone --depth 1 https://github.com/gertjaap/vertcoin-box-tunnel
git clone --depth 1 https://github.com/gertjaap/vertcoin-box-admin
cd /tmp/vertcoin-box/vertcoin-box-admin
ssh-keygen -t rsa -N "" -f ./vertcoin-box-admin.key
docker build . -t vertcoin-box-admin

cd /tmp/vertcoin-box/vertcoin-box-tunnel
cp ../vertcoin-box-admin/vertcoin-box-admin.key.pub .
docker build . -t vertcoin-box-tunnel

mkdir -p /usr/local/vertcoin-box
cp -R /tmp/vertcoin-box/vertcoin-box/* /usr/local/vertcoin-box 
mkdir -p /usr/local/vertcoin-box/data/lit

cd /usr/local/vertcoin-box
docker-compose -f vertcoin-box.yml up -d
1
