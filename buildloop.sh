#!/bin/bash
while :
do 
    echo "Waiting for file changes..."
    inotifywait -e modify -r . 

    docker build admin/ -t litbox-admin
    if [ $? != 0 ]; then continue; fi

    docker build tunnel/ -t litbox-tunnel 
    if [ $? != 0 ]; then continue; fi

    docker build tor/ -t litbox-tor
    if [ $? != 0 ]; then continue; fi

    docker build admin-go/ -t litbox-admin-go
    if [ $? != 0 ]; then continue; fi

    docker-compose up -d
done