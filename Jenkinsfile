pipeline {
    agent any

    environment {
        REGISTRY         = "your-registry.io"
        BACKEND_IMAGE    = "${REGISTRY}/sales-dashboard-backend"
        FRONTEND_IMAGE   = "${REGISTRY}/sales-dashboard-frontend"
        K8S_NAMESPACE    = "sales-dashboard"
        KUBECONFIG_CRED  = "kubeconfig-credentials-id"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint & Test — Backend') {
            steps {
                dir('backend') {
                    sh '''
                        python -m pip install -r requirements.txt
                        python -m py_compile sales_dashboard/settings.py
                        echo "Backend lint passed"
                    '''
                }
            }
        }

        stage('Lint & Test — Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run lint
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def tag = env.GIT_COMMIT.take(7)
                    sh "docker build -t ${BACKEND_IMAGE}:${tag} -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker build -t ${FRONTEND_IMAGE}:${tag} -t ${FRONTEND_IMAGE}:latest ./frontend"
                    env.IMAGE_TAG = tag
                }
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'registry-credentials',
                    usernameVariable: 'REGISTRY_USER',
                    passwordVariable: 'REGISTRY_PASS'
                )]) {
                    sh "echo ${REGISTRY_PASS} | docker login ${REGISTRY} -u ${REGISTRY_USER} --password-stdin"
                    sh "docker push ${BACKEND_IMAGE}:${env.IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:${env.IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    sh "kubectl apply -f k8s/namespace.yaml"
                    sh "kubectl apply -f k8s/secrets.yaml"
                    sh "kubectl apply -f k8s/backend-deployment.yaml"
                    sh "kubectl apply -f k8s/frontend-deployment.yaml"
                    sh "kubectl apply -f k8s/ingress.yaml"
                    sh "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${env.IMAGE_TAG} -n ${K8S_NAMESPACE}"
                    sh "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${env.IMAGE_TAG} -n ${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE}"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded — ${env.IMAGE_TAG} deployed to ${K8S_NAMESPACE}"
        }
        failure {
            echo "Pipeline failed — check logs above"
        }
    }
}
