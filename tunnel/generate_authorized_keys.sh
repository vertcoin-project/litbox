#!/bin/ash

mkdir -p /root/.ssh

# insert all ssh keys
cat /root/keys/*.pub > /root/.ssh/authorized_keys

for i in /root/keys/*.crt; do ssh-keygen -i -f $i >> /root/.ssh/authorized_keys; done