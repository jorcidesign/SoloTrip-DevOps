pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }

    environment {
        // Variables globales si hicieran falta
        CI = 'true'
    }

    stages {
        stage('⬇️ Checkout SCM') {
            steps {
                // Descarga el código de tu repositorio GitHub
                checkout scm
            }
        }

        stage('☕ Backend: Build & Test') {
            steps {
                dir('AppBackEnd') {
                    echo '🚀 Iniciando compilación de Spring Boot...'
                    // Compila y ejecuta los tests unitarios (JUnit)
                    sh 'mvn clean package'
                }
            }
        }

        stage('🌐 Frontend: Install') {
            steps {
                dir('AppFrontEnd') {
                    echo '📦 Instalando dependencias de Angular...'
                    sh 'npm install'
                }
            }
        }

        stage('🏗️ Frontend: Build') {
            steps {
                dir('AppFrontEnd') {
                    echo '🔨 Construyendo versión de producción...'
                    // Compila Angular para producción
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo '✅ ¡PIPELINE EXITOSO! La aplicación compila y pasa las pruebas.'
        }
        failure {
            echo '❌ EL PIPELINE FALLÓ. Revisa los logs.'
        }
    }
}