pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }

    stages {
        stage('⬇️ Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/jorcidesign/SoloTrip-DevOps.git'
            }
        }

        stage('☕ Backend: Compilar') {
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

        stage('📦 Frontend: Instalar') {
            steps {
                // CORREGIDO: Ahora apunta a la carpeta real
                dir('DemoFrontEnd') {
                    sh 'npm install'
                }
            }
        }

        stage('🏗️ Frontend: Build') {
            steps {
                // CORREGIDO: Ahora apunta a la carpeta real
                dir('DemoFrontEnd') {
                    sh 'npm run build'
                }
            }
        }
    }
}