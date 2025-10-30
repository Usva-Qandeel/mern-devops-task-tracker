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
                echo 'No tests configured, skipping test stage...'
            }
        }

      stage('Docker Build & Push') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            bat '''
                docker build -t usvaqandeel/mern-devops-task-tracker .
                echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
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
