#!/bin/sh

# create data directory for lit
mkdir -p /usr/local/litbox/data/lit

# create directory containing private keys
mkdir -p /usr/local/litbox/data/secrets

# create directory containing public keys
mkdir -p /usr/local/litbox/data/keys

# generate SSH private key for the Admin box to connect to the Tunnel box
ssh-keygen -t rsa -N "" -f /usr/local/litbox/data/secrets/litbox-admin.key

# include the public key for the admin box SSH key into the list of allowed SSH keys (this directory is merged into authorized_keys on startup of the tunnel box)
mv /usr/local/litbox/data/secrets/litbox-admin.key.pub /usr/local/litbox/data/keys 

# generate a new private key for LIT 
hexdump -n 32 -e '8/4 "%08x"' /dev/random > /usr/local/litbox/data/lit/privkey.hex

cd /usr/local/litbox
curl -o docker-compose.yml https://raw.githubusercontent.com/gertjaap/litbox/master/docker-compose.yml

docker network create litbox-network

docker-compose up -d
