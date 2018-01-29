#!/bin/ash

# insert all ssh keys
cat /root/ssh_keys/*.pub > /root/.ssh/authorized_keys
