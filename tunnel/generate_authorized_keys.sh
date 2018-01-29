#!/bin/ash

mkdir -p /root/.ssh

# insert all ssh keys
cat /root/keys/*.pub > /root/.ssh/authorized_keys
