#!/bin/sh
docker build admin/ -t litbox-admin
docker build tunnel/ -t litbox-tunnel 
docker build tor/ -t litbox-tor
docker build admin-go/ -t litbox-admin-go

