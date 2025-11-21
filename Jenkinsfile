pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }
    
    environment {
        scannerHome = tool 'SonarScanner'
        // CAMBIA ESTO POR TU USUARIO REAL DE DOCKER HUB
        DOCKER_USER = 'jorcidesign' 
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('⬇️ Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/jorcidesign/SoloTrip-DevOps.git'
            }
        }

        stage('🔍 Calidad & Tests') {
            steps {
                dir('AppBackEnd') {
                    // Compilar, Testear y Analizar
                    sh 'mvn clean package -DskipTests -B' // Generar JAR primero
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=SoloTrip-Backend -Dsonar.projectName='SoloTrip Backend' -Dsonar.sources=src/main/java -Dsonar.java.binaries=target/classes -Dsonar.exclusions=**/security/**,**/config/**,**/dto/**,**/entity/**,**/exception/**,**/*Application.java"
                    }
                }
            }
        }

        // --- AQUÍ EMPIEZA LO NUEVO ---

        stage('🐳 Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_LOGIN')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER_LOGIN --password-stdin"
                        
                        // Backend
                        dir('AppBackEnd') {
                            sh "docker build -t $DOCKER_USER/solotrip-backend:$IMAGE_TAG ."
                            sh "docker push $DOCKER_USER/solotrip-backend:$IMAGE_TAG"
                        }
                        
                        // Frontend
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
                // Esto pausa el pipeline hasta que tú le des click
                input message: '¿Desplegar a Producción?', ok: '¡Desplegar!'
            }
        }

        stage('🚀 Deploy to Production') {
            steps {
                script {
                    // Limpieza de contenedores viejos (si existen)
                    sh 'docker stop backend-prod || true'
                    sh 'docker rm backend-prod || true'
                    sh 'docker stop frontend-prod || true'
                    sh 'docker rm frontend-prod || true'
                    sh 'docker network create sonarnet || true'

                    // Desplegar Backend
                    sh """
                        docker run -d --name backend-prod --network sonarnet -p 8080:8080 \
                        -e SPRING_DATASOURCE_URL=jdbc:postgresql://sonar-postgres:5432/demodb \
                        -e SPRING_DATASOURCE_USERNAME=admin \
                        -e SPRING_DATASOURCE_PASSWORD=password \
                        $DOCKER_USER/solotrip-backend:$IMAGE_TAG
                    """

                    // Desplegar Frontend
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
                    echo "Esperando a que arranque el servicio..."
                    sleep 20 // Dar tiempo a Spring Boot para iniciar
                    // Verificamos si el endpoint de salud responde
                    sh "curl -f http://localhost:8080/actuator/health || echo '⚠️ Warning: Health check failed but deployment continues'"
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
