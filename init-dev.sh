#!/bin/sh

# create data directory for lit
mkdir -p data/lit

# create directory containing private keys
mkdir -p data/secrets

# create directory containing public keys
mkdir -p data/keys

# create directory containing tor hostname and key
mkdir -p data/tor

# generate SSH private key for the Admin box to connect to the Tunnel box
ssh-keygen -t rsa -N "" -f data/secrets/litbox-admin.key

# include the public key for the admin box SSH key into the list of allowed SSH keys (this directory is merged into authorized_keys on startup of the tunnel box)
mv data/secrets/litbox-admin.key.pub data/keys 

# generate a new private key for LIT 
hexdump -n 32 -e '8/4 "%08x"' /dev/random > data/lit/privkey.hex

docker network create litbox-network

