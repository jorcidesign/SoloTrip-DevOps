pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }
    
    environment {
        // Definimos dónde está el scanner
        scannerHome = tool 'SonarScanner'
    }

    stages {
        stage('⬇️ Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/jorcidesign/SoloTrip-DevOps.git'
            }
        }

        stage('🔍 Análisis de Calidad') {
            steps {
                dir('AppBackEnd') {
                    // Jenkins usa el token configurado para hablar con SonarQube
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=SoloTrip-Backend \
                            -Dsonar.projectName="SoloTrip Backend" \
                            -Dsonar.sources=src/main/java \
                            -Dsonar.java.binaries=target/classes \
                            -Dsonar.exclusions=**/security/**,**/config/**,**/dto/**,**/entity/**,**/exception/**,**/*Application.java
                        """
                    }
                }
            }
        }

        stage('☕ Backend: Build') {
            steps {
                dir('AppBackEnd') {
                    sh 'mvn clean package -DskipTests -B'
                }
            }
        }
        
        stage('🧪 Backend: Tests') {
            steps {
                dir('AppBackEnd') {
                    sh 'mvn test -B'
                }
            }
        }

        stage('📦 Frontend: Install') {
            steps {
                dir('DemoFrontEnd') {
                    sh 'npm install'
                }
            }
        }

        stage('🏗️ Frontend: Build') {
            steps {
                dir('DemoFrontEnd') {
                    sh 'npm run build'
                }
            }
        }
    }

    // AQUÍ VA EL BLOQUE POST (Justo antes del cierre final)
    post {
        success {
            echo '✅ PIPELINE EXITOSO'
            // Guarda el .jar generado para cumplir con el versionado de artefactos
            archiveArtifacts artifacts: 'AppBackEnd/target/*.jar', fingerprint: true
        }
        failure {
            echo '❌ EL PIPELINE FALLÓ'
        }
    }
}
