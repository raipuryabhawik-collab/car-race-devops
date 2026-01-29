pipeline {
    agent any

    stages {

    stage('Build Docker Image') {
            steps {
                sh 'docker build -t car-racing-devops:latest .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker rm -f car-racing || true
                docker run -d -p 8080:80 --name car-racing car-racing-devops:latest
                '''
            }
        }
    }
}

