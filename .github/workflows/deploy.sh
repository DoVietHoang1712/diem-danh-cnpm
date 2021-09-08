#!/bin/bash
 
echo 'Starting to Deploy...'
ssh ubuntu@52.38.40.75 " sudo docker image prune -f 
        echo '123s'
        "
echo 'Deployment completed successfully'