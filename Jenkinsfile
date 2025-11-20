pipeline {
    agent any

    tools {
        jdk 'Java21'
        maven 'Maven3'
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('AppBackEnd') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Backend Tests') {
            steps {
                dir('AppBackEnd') {
                    sh 'mvn test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('AppFrontEnd') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('AppFrontEnd') {
                    sh 'npm run build'
                }
            }
        }
    }
}