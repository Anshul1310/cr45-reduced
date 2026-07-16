pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'anshul8394'
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/cr45-backend"
        NGINX_IMAGE    = "${DOCKERHUB_USER}/cr45-nginx"
    }

    stages {
        stage('Lint & Test') {
            steps {
                dir('backend') {
                    sh 'go vet ./...'
                    sh 'go test ./... -v || true'
                }
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                    
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    
                    sh "docker build -t ${NGINX_IMAGE}:${BUILD_NUMBER} -t ${NGINX_IMAGE}:latest -f nginx/Dockerfile ."
                    sh "docker push ${NGINX_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${NGINX_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose -p cr45-reduced pull backend-1 backend-2 backend-3 backend-4 backend-5 nginx
                    docker compose -p cr45-reduced up -d backend-1 backend-2 backend-3 backend-4 backend-5 nginx
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}
