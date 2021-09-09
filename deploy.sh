#!/bin/bash
 
echo 'Starting to Deploy...'
ssh ubuntu@54.169.160.52 " sudo docker image prune -f 
        cd diem-danh-cnpm 
        sudo docker-compose down
        git fetch origin main
        git reset --hard origin/main  &&  echo 'You are doing well'
        sudo docker-compose build && sudo docker-compose up -d
        "
echo 'Deployment completed successfully'
