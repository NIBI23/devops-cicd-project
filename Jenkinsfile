pipeline {
    agent any
    
    environment {
        // UPDATE THESE WITH YOUR ACTUAL VALUES
        PROD_SERVER_IP = '16.16.65.170'
        PROD_SERVER_USER = 'ubuntu'                      
        BACKEND_DIR = '/home/ubuntu/my-app/backend'      
        FRONTEND_DIR = '/var/www/html'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo ' Cloning code from GitHub...'
                checkout scm
                echo '✅ Code cloned successfully'
                sh 'pwd'
                sh 'ls -la'
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                // Navigate to backend folder inside my-app
                dir('my-app/backend') {
                    sh 'pwd'
                    sh 'ls -la'
                    sh 'npm install'
                }
                echo '✅ Dependencies installed'
            }
        }
        
        stage('Deploy to Production Server') {
            steps {
                echo '🚀 Deploying to production server...'
                
                script {
                    // Create directories on production server
                    sh """
                        ssh -o StrictHostKeyChecking=no ${PROD_SERVER_USER}@${PROD_SERVER_IP} "mkdir -p ${BACKEND_DIR}"
                        ssh -o StrictHostKeyChecking=no ${PROD_SERVER_USER}@${PROD_SERVER_IP} "sudo mkdir -p ${FRONTEND_DIR}"
                    """
                    
                    // Copy backend files from my-app/backend
                    sh """
                        scp -o StrictHostKeyChecking=no -r my-app/backend/* ${PROD_SERVER_USER}@${PROD_SERVER_IP}:${BACKEND_DIR}/
                    """
                    
                    // Copy frontend files from my-app/frontend
                    sh """
                        scp -o StrictHostKeyChecking=no -r my-app/frontend/* ${PROD_SERVER_USER}@${PROD_SERVER_IP}:/tmp/
                        ssh -o StrictHostKeyChecking=no ${PROD_SERVER_USER}@${PROD_SERVER_IP} "sudo cp -r /tmp/* ${FRONTEND_DIR}/"
                    """
                    
                    // Install dependencies and restart backend with PM2
                    sh """
                        ssh -o StrictHostKeyChecking=no ${PROD_SERVER_USER}@${PROD_SERVER_IP} << 'EOF'
                            cd ${BACKEND_DIR}
                            npm install
                            pm2 stop backend-app || true
                            pm2 start server.js --name backend-app
                            pm2 save
                            sudo systemctl restart nginx
                            echo "Deployment completed on \$(date)"
                        EOF
                    """
                }
                echo '✅ Deployment completed successfully!'
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                script {
                    sleep time: 5, unit: 'SECONDS'
                    
                    sh """
                        ssh -o StrictHostKeyChecking=no ${PROD_SERVER_USER}@${PROD_SERVER_IP} << 'EOF'
                            echo "=== Backend Status ==="
                            curl -s http://localhost:3000/health || echo "Backend not responding"
                            echo ""
                            echo "=== PM2 Status ==="
                            pm2 list
                            echo ""
                            echo "=== Nginx Status ==="
                            sudo systemctl status nginx --no-pager | grep Active
                        EOF
                    """
                }
                echo '✅ Verification complete'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline executed successfully!'
            echo "📍 Frontend URL: http://${PROD_SERVER_IP}"
            echo "📍 Backend API: http://${PROD_SERVER_IP}:3000/health"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above for details.'
        }
        always {
            echo '🏁 Pipeline execution finished'
        }
    }
}
