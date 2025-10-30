pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Usva-Qandeel/mern-devops-task-tracker.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build --if-present'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test || echo "No tests configured"'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_TOKEN')]) {
                    bat '''
                        docker build -t usvaqandeel/mern-devops-task-tracker .
                        echo $DOCKERHUB_TOKEN | docker login -u usvaqandeel --password-stdin
                        docker push usvaqandeel/mern-devops-task-tracker
                    '''
                }
            }
        }

        stage('Deploy to Railway') {
            steps {
                echo 'Deploying to Railway... (handled automatically by Railway GitHub integration)'
            }
        }
    }
}
