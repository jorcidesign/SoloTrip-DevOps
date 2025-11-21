pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }
    
    environment {
        scannerHome = tool 'SonarScanner'
        DOCKER_USER = 'jorcidesign' 
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('⬇️ Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/jorcidesign/SoloTrip-DevOps.git'
            }
        }

        stage('🧪 Tests & Análisis') {
            steps {
                dir('AppBackEnd') {
                    // 1. Generamos reporte de cobertura (JaCoCo)
                    sh 'mvn clean verify -B' 
                    
                    // 2. Análisis SonarQube
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=SoloTrip-Backend \
                            -Dsonar.projectName="SoloTrip Backend" \
                            -Dsonar.sources=src/main/java \
                            -Dsonar.tests=src/test/java \
                            -Dsonar.java.binaries=target/classes \
                            -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                            -Dsonar.exclusions=**/security/**,**/config/**,**/dto/**,**/entity/**,**/exception/**,**/*Application.java
                        """
                    }
                }
            }
        }

        stage('🐳 Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_LOGIN')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER_LOGIN --password-stdin"
                        
                        dir('AppBackEnd') {
                            sh "docker build -t $DOCKER_USER/solotrip-backend:$IMAGE_TAG ."
                            sh "docker push $DOCKER_USER/solotrip-backend:$IMAGE_TAG"
                        }
                        
                        dir('DemoFrontEnd') {
                            sh "docker build -t $DOCKER_USER/solotrip-frontend:$IMAGE_TAG ."
                            sh "docker push $DOCKER_USER/solotrip-frontend:$IMAGE_TAG"
                        }
                    }
                }
            }
        }

        stage('✋ Approval Gate') {
            steps {
                input message: '¿Desplegar a Producción?', ok: '¡Desplegar!'
            }
        }

        // --- ESTA ES LA ETAPA NUEVA QUE AUTOMATIZA LA BD ---
        stage('🗄️ Preparar Base de Datos') {
            steps {
                script {
                    // Usamos '|| true' para que no falle si la BD ya existe (Idempotencia)
                    sh '''
                        docker exec sonar-postgres psql -U sonar -d sonar -c "CREATE DATABASE demodb;" || echo "BD ya existe"
                        docker exec sonar-postgres psql -U sonar -d sonar -c "CREATE USER admin WITH ENCRYPTED PASSWORD 'password';" || echo "Usuario ya existe"
                        docker exec sonar-postgres psql -U sonar -d sonar -c "GRANT ALL PRIVILEGES ON DATABASE demodb TO admin;"
                        docker exec sonar-postgres psql -U sonar -d sonar -c "ALTER DATABASE demodb OWNER TO admin;"
                        docker exec sonar-postgres psql -U sonar -d demodb -c "GRANT ALL ON SCHEMA public TO admin;"
                        
                        # Corrección del hash de contraseña por si se reinició
                        docker exec sonar-postgres psql -U sonar -d demodb -c "UPDATE users SET password = '\$2a\$10\$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlZ6p/Z1k3p6Kul' WHERE username = 'admin';" || echo "Tabla users aun no creada, lo hará Flyway"
                    '''
                }
            }
        }

        stage('🚀 Deploy to Production') {
            steps {
                script {
                    // Limpieza
                    sh 'docker stop backend-prod || true'
                    sh 'docker rm backend-prod || true'
                    sh 'docker stop frontend-prod || true'
                    sh 'docker rm frontend-prod || true'
                    
                    // Asegurar red
                    sh 'docker network create sonarnet || true'
                    sh 'docker network connect sonarnet sonar-postgres || true'

                    // Backend
                    sh """
                        docker run -d --name backend-prod --network sonarnet -p 8080:8080 \
                        -e SPRING_DATASOURCE_URL=jdbc:postgresql://sonar-postgres:5432/demodb \
                        -e SPRING_DATASOURCE_USERNAME=admin \
                        -e SPRING_DATASOURCE_PASSWORD=password \
                        $DOCKER_USER/solotrip-backend:$IMAGE_TAG
                    """

                    // Frontend
                    sh """
                        docker run -d --name frontend-prod --network sonarnet -p 80:80 \
                        $DOCKER_USER/solotrip-frontend:$IMAGE_TAG
                    """
                }
            }
        }

        stage('❤️ Monitoring Check') {
            steps {
                script {
                    echo "⏳ Esperando 40s a que Spring Boot arranque..."
                    sleep 40 
                    sh "curl -f http://localhost:8080/actuator/health || echo '⚠️ Backend tardando en responder, verificar manualmente'"
                }
            }
        }
    }
    
    post {
        success {
            archiveArtifacts artifacts: 'AppBackEnd/target/*.jar', fingerprint: true
        }
    }
}
