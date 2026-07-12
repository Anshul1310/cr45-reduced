pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'anshul8394'
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/cr45-backend"
        NGINX_IMAGE    = "${DOCKERHUB_USER}/cr45-nginx"
    }

    stages {

        // ──────────────────────────────────────────────
        // STAGE 1: Lint & Test (runs on every push / PR)
        // ──────────────────────────────────────────────

        stage('Backend Lint & Test') {
            steps {
                sh '''
                    docker run --rm \
                        --volumes-from $(hostname) \
                        -w $WORKSPACE/backend \
                        golang:1.26-alpine sh -c "
                            go vet ./... &&
                            go build ./... &&
                            go test ./... -v || true
                        "
                '''
            }
        }

        stage('Frontend Lint & Test') {
            steps {
                sh '''
                    docker run --rm \
                        --volumes-from $(hostname) \
                        -w $WORKSPACE/frontend \
                        node:20-alpine sh -c "
                            npm ci &&
                            npx eslint src/ || true &&
                            npm run build
                        "
                '''
            }
        }

        // ──────────────────────────────────────────────
        // STAGE 2: Build & Push (only on main branch)
        // ──────────────────────────────────────────────

        stage('Build & Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                    // Build and push backend image
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${BACKEND_IMAGE}:latest"

                    // Build and push nginx image (includes frontend build)
                    sh "docker build -t ${NGINX_IMAGE}:${BUILD_NUMBER} -t ${NGINX_IMAGE}:latest -f nginx/Dockerfile ."
                    sh "docker push ${NGINX_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${NGINX_IMAGE}:latest"
                }
            }
        }

        // ──────────────────────────────────────────────
        // STAGE 3: Deploy (only on main branch)
        // ──────────────────────────────────────────────

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker compose pull'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
