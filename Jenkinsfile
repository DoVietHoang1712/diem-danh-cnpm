pipeline {
    agent none

    environment {
        DOCKER_IMAGE = "hoang1712/nodejs-docker-cnpm"
    }

    stages {
        // stage("Test") {
        //     agent {
        //         docker {
        //             image 'node:12'
        //             args '-u 0:0 -v /tmp:/root/.cache'
        //         }
        //     }
        //     steps {
        //         sh 'npm install'
            
        //     }
        // }
        stage("build") {
            agent any
            environment {
                DOCKER_TAG="${GIT_BRANCH.tokenize('/').pop()}-${GIT_COMMIT.substring(0,7)}"
            }
            steps {
                // withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                //     sh "cd ~"
                //     sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD'
                // }
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} . "
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker image ls | grep ${DOCKER_IMAGE}"
                script {
                    if (GIT_BRANCH == ~ /.*main.*/) {
                        sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }

                //clean to save disk
                sh "docker image rm ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }
    post {
        success {
            echo "SUCCESSFUL"
        }
        failure {
            echo "FAILED"
        }
    }
}